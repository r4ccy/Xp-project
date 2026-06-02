const pool = require("../../config/supabase");

function normalizeNombre(nombre) {
    return nombre ? nombre.trim().toLowerCase() : null;
}

async function crearTarjeta(nombre, responsabilidades, colaboradores = []) {
    const nombreNormalizado = normalizeNombre(nombre);
    if (!nombreNormalizado) {
        throw new Error("El nombre de la clase es obligatorio");
    }

    if (!responsabilidades || responsabilidades.length === 0) {
        throw new Error("Debe tener al menos una responsabilidad");
    }

    const existe = await pool.query(
        "SELECT id FROM crc_cards WHERE LOWER(nombre_clase) = $1",
        [nombreNormalizado]
    );

    if (existe.rows.length > 0) {
        return false;
    }

    const result = await pool.query(
        `INSERT INTO crc_cards(nombre_clase)
         VALUES($1)
         RETURNING *`,
        [nombreNormalizado]
    );

    const tarjeta = result.rows[0];

    for (const r of responsabilidades) {
        await pool.query(
            `INSERT INTO crc_responsibilities
             (crc_card_id, descripcion)
             VALUES($1, $2)`,
            [tarjeta.id, r.descripcion]
        );
    }

    for (const colaborador of colaboradores || []) {
        if (!colaborador || typeof colaborador !== 'string') continue;
        await pool.query(
            `INSERT INTO crc_collaborators
             (crc_card_id, nombre)
             VALUES($1, $2)`,
            [tarjeta.id, colaborador]
        );
    }

    return await obtenerTarjeta(nombre);
}

async function obtenerTarjeta(nombre) {
    const nombreNormalizado = normalizeNombre(nombre);
    const cardResult = await pool.query(
        "SELECT * FROM crc_cards WHERE LOWER(nombre_clase) = $1",
        [nombreNormalizado]
    );

    if (cardResult.rows.length === 0) {
        return null;
    }

    const tarjeta = cardResult.rows[0];

    const responsabilidadesResult = await pool.query(
        `SELECT descripcion
         FROM crc_responsibilities
         WHERE crc_card_id = $1`,
        [tarjeta.id]
    );

    const colaboradoresResult = await pool.query(
        `SELECT nombre
         FROM crc_collaborators
         WHERE crc_card_id = $1`,
        [tarjeta.id]
    );

    return {
        id: tarjeta.id,
        nombre: tarjeta.nombre_clase,
        responsabilidades: responsabilidadesResult.rows,
        colaboradores: colaboradoresResult.rows.map(c => c.nombre)
    };
}

async function eliminarTarjeta(nombre) {
    const nombreNormalizado = normalizeNombre(nombre);
    const tarjeta = await obtenerTarjeta(nombreNormalizado);
    if (!tarjeta) return false;

    await pool.query(
        "DELETE FROM crc_responsibilities WHERE crc_card_id = $1",
        [tarjeta.id]
    );

    await pool.query(
        "DELETE FROM crc_collaborators WHERE crc_card_id = $1",
        [tarjeta.id]
    );

    const result = await pool.query(
        "DELETE FROM crc_cards WHERE id = $1",
        [tarjeta.id]
    );

    return result.rowCount > 0;
}

async function listarTarjetas() {
    const result = await pool.query(
        `SELECT MIN(c.nombre_clase) AS nombre,
                COUNT(DISTINCT r.id) AS responsabilidades,
                COUNT(DISTINCT col.id) AS colaboradores
         FROM crc_cards c
         LEFT JOIN crc_responsibilities r ON r.crc_card_id = c.id
         LEFT JOIN crc_collaborators col ON col.crc_card_id = c.id
         GROUP BY LOWER(c.nombre_clase)
         ORDER BY MIN(c.nombre_clase)`
    );

    return result.rows.map(row => ({
        nombre: row.nombre,
        responsabilidades: Number(row.responsabilidades),
        colaboradores: Number(row.colaboradores)
    }));
}

async function actualizarTarjeta(nombreActual, nombreNuevo, responsabilidades, colaboradores = []) {
    const tarjeta = await obtenerTarjeta(nombreActual);
    if (!tarjeta) return null;

    const nombreNuevoNormalizado = normalizeNombre(nombreNuevo);
    const nombreActualNormalizado = normalizeNombre(nombreActual);

    if (nombreNuevoNormalizado && nombreNuevoNormalizado !== nombreActualNormalizado) {
        const existe = await pool.query(
            "SELECT id FROM crc_cards WHERE LOWER(nombre_clase) = $1 AND id <> $2",
            [nombreNuevoNormalizado, tarjeta.id]
        );

        if (existe.rows.length > 0) {
            throw new Error("Ya existe otra tarjeta con ese nombre");
        }

        await pool.query(
            "UPDATE crc_cards SET nombre_clase = $1 WHERE id = $2",
            [nombreNuevoNormalizado, tarjeta.id]
        );
    }

    await pool.query(
        "DELETE FROM crc_responsibilities WHERE crc_card_id = $1",
        [tarjeta.id]
    );

    await pool.query(
        "DELETE FROM crc_collaborators WHERE crc_card_id = $1",
        [tarjeta.id]
    );

    for (const r of responsabilidades || []) {
        await pool.query(
            `INSERT INTO crc_responsibilities
             (crc_card_id, descripcion)
             VALUES($1, $2)`,
            [tarjeta.id, r.descripcion]
        );
    }

    for (const colaborador of colaboradores || []) {
        if (!colaborador || typeof colaborador !== 'string') continue;
        await pool.query(
            `INSERT INTO crc_collaborators
             (crc_card_id, nombre)
             VALUES($1, $2)`,
            [tarjeta.id, colaborador]
        );
    }

    const nombreFinal = nombreNuevo && nombreNuevo.length > 0 ? nombreNuevo : nombreActual;
    return await obtenerTarjeta(nombreFinal);
}

async function agregarResponsabilidad(nombre, descripcion) {
    const tarjeta = await obtenerTarjeta(nombre);

    if (!tarjeta) return false;

    const existe = tarjeta.responsabilidades.some(
        r => (r.descripcion || '').toLowerCase() === (descripcion || '').toLowerCase()
    );

    if (existe) return false;

    await pool.query(
        `INSERT INTO crc_responsibilities
         (crc_card_id, descripcion)
         VALUES($1, $2)`,
        [tarjeta.id, descripcion]
    );

    return true;
}

async function eliminarResponsabilidad(nombre, descripcion) {
    const tarjeta = await obtenerTarjeta(nombre);

    if (!tarjeta) return false;

    await pool.query(
        `DELETE FROM crc_responsibilities
         WHERE crc_card_id = $1
         AND descripcion = $2`,
        [tarjeta.id, descripcion]
    );

    return true;
}

async function agregarColaborador(nombre, colaborador) {
    const tarjeta = await obtenerTarjeta(nombre);

    if (!tarjeta) return false;

    const colaboradorNormalizado = (colaborador || '').trim().toLowerCase();
    if (tarjeta.colaboradores.some(c => c.toLowerCase() === colaboradorNormalizado)) {
        return false;
    }

    await pool.query(
        `INSERT INTO crc_collaborators
         (crc_card_id, nombre)
         VALUES($1, $2)`,
        [tarjeta.id, colaborador]
    );

    return true;
}

async function eliminarColaborador(nombre, colaborador) {
    const tarjeta = await obtenerTarjeta(nombre);

    if (!tarjeta) return false;

    await pool.query(
        `DELETE FROM crc_collaborators
         WHERE crc_card_id = $1
         AND nombre = $2`,
        [tarjeta.id, colaborador]
    );

    return true;
}

module.exports = {
    crearTarjeta,
    obtenerTarjeta,
    eliminarTarjeta,
    listarTarjetas,
    actualizarTarjeta,
    agregarResponsabilidad,
    eliminarResponsabilidad,
    agregarColaborador,
    eliminarColaborador
};
