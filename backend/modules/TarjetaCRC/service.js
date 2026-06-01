const pool = require("../../config/supabase");

async function crearTarjeta(nombre, responsabilidades) {
    if (!responsabilidades || responsabilidades.length === 0) {
        throw new Error("Debe tener al menos una responsabilidad");
    }

    const existe = await pool.query(
        "SELECT id FROM crc_cards WHERE nombre_clase = $1",
        [nombre]
    );

    if (existe.rows.length > 0) {
        return false;
    }

    const result = await pool.query(
        `INSERT INTO crc_cards(nombre_clase)
         VALUES($1)
         RETURNING *`,
        [nombre]
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

    return await obtenerTarjeta(nombre);
}

async function obtenerTarjeta(nombre) {
    const cardResult = await pool.query(
        "SELECT * FROM crc_cards WHERE nombre_clase = $1",
        [nombre]
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
    const result = await pool.query(
        "DELETE FROM crc_cards WHERE nombre_clase = $1",
        [nombre]
    );

    return result.rowCount > 0;
}

async function agregarResponsabilidad(nombre, descripcion) {
    const tarjeta = await obtenerTarjeta(nombre);

    if (!tarjeta) return false;

    const existe = tarjeta.responsabilidades.some(
        r => r.descripcion === descripcion
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

    if (tarjeta.colaboradores.includes(colaborador)) {
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
    agregarResponsabilidad,
    eliminarResponsabilidad,
    agregarColaborador,
    eliminarColaborador
};