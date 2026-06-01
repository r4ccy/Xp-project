const service = require("./service");

async function crearTarjeta(req, res) {
    try {
        const { nombre, responsabilidades } = req.body;

        const resultado = await service.crearTarjeta(nombre, responsabilidades);

        if (!resultado) {
            return res.status(400).json({
                message: "La tarjeta ya existe"
            });
        }

        return res.status(201).json(resultado);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


async function obtenerTarjeta(req, res) {
    try {
        const { nombre } = req.params;

        const tarjeta = await service.obtenerTarjeta(nombre);

        if (!tarjeta) {
            return res.status(404).json({
                message: "Tarjeta no encontrada"
            });
        }

        return res.status(200).json(tarjeta);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


async function eliminarTarjeta(req, res) {
    try {
        const { nombre } = req.params;

        const resultado = await service.eliminarTarjeta(nombre);

        if (!resultado) {
            return res.status(404).json({
                message: "No se pudo eliminar la tarjeta"
            });
        }

        return res.status(200).json({
            message: "Tarjeta eliminada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    crearTarjeta,
    obtenerTarjeta,
    eliminarTarjeta
};