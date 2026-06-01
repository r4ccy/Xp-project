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

module.exports = {
    createFunction
};