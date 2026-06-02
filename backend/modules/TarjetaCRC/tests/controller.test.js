const controller = require("../controller");

function mockRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
}
beforeEach(async () => {
    const pool = require("../../../config/supabase");
    await pool.query(
        "TRUNCATE crc_cards RESTART IDENTITY CASCADE"
    );
});

describe("Controller TarjetaCRC", () => {

    test("Debe registrar una tarjeta CRC válida", async () => {
        const req = {
            body: {
                nombre: "Colaborador",
                responsabilidades: [
                    { descripcion: "Registrar información del colaborador" }
                ]
            }
        };
        const res = mockRes();
        await controller.crearTarjeta(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test("No debe registrar tarjetas duplicadas", async () => {
        const req = {
            body: {
                nombre: "Colaborador",
                responsabilidades: [
                    { descripcion: "Registrar información del colaborador" }
                ]
            }
        };

        const res = mockRes();

        await controller.crearTarjeta(req, res);
        await controller.crearTarjeta(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test("Debe obtener una tarjeta CRC", async () => {
        const reqCreate = {
            body: {
                nombre: "Colaborador",
                responsabilidades: [
                    { descripcion: "Registrar información" }
                ]
            }
        };

        const reqGet = {
            params: { nombre: "Colaborador" }
        };

        const res1 = mockRes();
        const res2 = mockRes();

        await controller.crearTarjeta(reqCreate, res1);
        await controller.obtenerTarjeta(reqGet, res2);

        expect(res2.json).toHaveBeenCalled();
        expect(res2.status).toHaveBeenCalledWith(200);
    });

    test("Debe eliminar una tarjeta CRC", async () => {
        const reqCreate = {
            body: {
                nombre: "Colaborador",
                responsabilidades: [
                    { descripcion: "Registrar información" }
                ]
            }
        };

        const reqDelete = {
            params: { nombre: "Colaborador" }
        };

        const res1 = mockRes();
        const res2 = mockRes();

        await controller.crearTarjeta(reqCreate, res1);
        await controller.eliminarTarjeta(reqDelete, res2);

        expect(res2.status).toHaveBeenCalledWith(200);
    });

});