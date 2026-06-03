const service = require("./service");

async function createFunction(req, res) {
    try {

        const { name, content } = req.body;
        const result =
            await service.registerFunction(
                name,
                content
            );

        res.status(201).json(result);

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

async function getFunctions(req, res) {
    try {
        const functions =
            await service.getFunctions();
        res.status(200).json(functions);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

async function updateFunction(req, res) {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const result =
            await service.updateFunction(
                id,
                content
            );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

async function deleteFunction(req, res) {
    try {
        const { id } = req.params;
        const result =
            await service.deleteFunction(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

module.exports = {
    createFunction,
    getFunctions,
    updateFunction,
    deleteFunction
};