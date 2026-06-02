const service = require("../service");
const supabase = require("../../../config/supabase");

beforeEach(async () => {
    await supabase.query(
        "TRUNCATE crc_cards RESTART IDENTITY CASCADE"
    );
});

describe("TarjetaCRC Service (Supabase)", () => {

    test("Debe crear tarjeta con responsabilidades", async () => {
        const result = await service.crearTarjeta("Colaborador", [
            { descripcion: "Registrar información del colaborador" }
        ]);

        expect(result).not.toBe(false);
        expect(result.nombre).toBe("Colaborador");
        expect(result.responsabilidades.length).toBeGreaterThan(0);
    });

    test("No debe crear tarjeta sin responsabilidades", async () => {
        await expect(
            service.crearTarjeta("Colaborador", [])
        ).rejects.toThrow("Debe tener al menos una responsabilidad");
    });

    test("No debe permitir tarjetas duplicadas", async () => {
        await service.crearTarjeta("Colaborador", [
            { descripcion: "Registrar información" }
        ]);

        const result = await service.crearTarjeta("Colaborador", [
            { descripcion: "Otra responsabilidad" }
        ]);

        expect(result).toBe(false);
    });

    test("Debe obtener una tarjeta por nombre", async () => {
        await service.crearTarjeta("Colaborador", [
            { descripcion: "Registrar información" }
        ]);

        const tarjeta = await service.obtenerTarjeta("Colaborador");

        expect(tarjeta).not.toBeNull();
        expect(tarjeta.nombre).toBe("Colaborador");
    });

    test("Debe eliminar una tarjeta", async () => {
        await service.crearTarjeta("Colaborador", [
            { descripcion: "Registrar información" }
        ]);

        const result = await service.eliminarTarjeta("Colaborador");

        expect(result).toBe(true);

        const deleted = await service.obtenerTarjeta("Colaborador");
        expect(deleted).toBeNull();
    });

    test("Debe agregar responsabilidad correctamente", async () => {
        await service.crearTarjeta("Colaborador", [
            { descripcion: "Inicial" }
        ]);

        const result = await service.agregarResponsabilidad(
            "Colaborador",
            "Nueva responsabilidad"
        );

        expect(result).toBe(true);

        const tarjeta = await service.obtenerTarjeta("Colaborador");
        expect(tarjeta.responsabilidades.length).toBe(2);
    });

    test("No debe permitir responsabilidades duplicadas", async () => {
        await service.crearTarjeta("Colaborador", [
            { descripcion: "Registrar información" }
        ]);

        const result = await service.agregarResponsabilidad(
            "Colaborador",
            "Registrar información"
        );

        expect(result).toBe(false);
    });

    test("Debe eliminar responsabilidad", async () => {
        await service.crearTarjeta("Colaborador", [
            { descripcion: "R1" },
            { descripcion: "R2" }
        ]);

        const result = await service.eliminarResponsabilidad(
            "Colaborador",
            "R1"
        );

        expect(result).toBe(true);

        const tarjeta = await service.obtenerTarjeta("Colaborador");
        expect(tarjeta.responsabilidades.length).toBe(1);
    });

    test("Debe agregar colaborador", async () => {
        await service.crearTarjeta("Colaborador", [
            { descripcion: "R1" }
        ]);

        const result = await service.agregarColaborador(
            "Colaborador",
            "Docente"
        );

        expect(result).toBe(true);

        const tarjeta = await service.obtenerTarjeta("Colaborador");
        expect(tarjeta.colaboradores.length).toBe(1);
    });

    test("No debe permitir colaboradores duplicados", async () => {
        await service.crearTarjeta("Colaborador", [
            { descripcion: "R1" }
        ]);

        await service.agregarColaborador("Colaborador", "Docente");

        const result = await service.agregarColaborador(
            "Colaborador",
            "Docente"
        );

        expect(result).toBe(false);
    });

    test("Debe eliminar colaborador", async () => {
        await service.crearTarjeta("Colaborador", [
            { descripcion: "R1" }
        ]);

        await service.agregarColaborador("Colaborador", "Docente");

        const result = await service.eliminarColaborador(
            "Colaborador",
            "Docente"
        );

        expect(result).toBe(true);
    });

});


