const service = require("../service");

describe("Gestión de funciones analizadas", () => {

    const testName =
        `test_${Date.now()}`;

    test(
        "debe registrar una nueva función",
        async () => {

            const result =
                await service.registerFunction(
                    testName,
                    "console.log('hola');"
                );

            expect(result.name)
                .toBe(testName);
        }
    );

    test(
        "no debe registrar una función sin nombre",
        async () => {

            await expect(
                service.registerFunction(
                    "",
                    "console.log('hola');"
                )
            ).rejects.toThrow(
                "Function name is required"
            );
        }
    );

    test(
        "no debe registrar una función sin contenido",
        async () => {

            await expect(
                service.registerFunction(
                    "sinContenido",
                    ""
                )
            ).rejects.toThrow(
                "Function content is required"
            );
        }
    );

    test(
        "no debe registrar funciones con nombre duplicado",
        async () => {

            const name =
                `duplicada_${Date.now()}`;

            await service.registerFunction(
                name,
                "console.log('hola');"
            );

            await expect(
                service.registerFunction(
                    name,
                    "console.log('hola');"
                )
            ).rejects.toThrow(
                "Function name already exists"
            );
        }
    );

    test(
        "debe obtener funciones registradas",
        async () => {

            const functions =
                await service.getFunctions();

            expect(
                Array.isArray(functions)
            ).toBe(true);
        }
    );

    test(
        "debe eliminar una función registrada",
        async () => {

            const created =
                await service.registerFunction(
                    `delete_${Date.now()}`,
                    "console.log('hola');"
                );

            await service.deleteFunction(
                created.id
            );

            const functions =
                await service.getFunctions();

            const exists =
                functions.find(
                    functionItem =>
                        functionItem.id === created.id
                );

            expect(exists)
                .toBeUndefined();
        }
    );

    test(
        "debe recalcular complejidad al actualizar",
        async () => {

            const created =
                await service.registerFunction(
                    `update_${Date.now()}`,
                    "console.log('hola');"
                );

            const updated =
                await service.updateFunction(
                    created.id,
                    `
                    for(let i = 0; i < n; i++) {
                        console.log(i);
                    }
                    `
                );

            expect(
                updated.complexity
            ).toBe("O(n)");
        }
    );

    test(
        "no debe actualizar una función con contenido vacío",
        async () => {

            const created =
                await service.registerFunction(
                    `emptyUpdate_${Date.now()}`,
                    "console.log('hola');"
                );

            await expect(
                service.updateFunction(
                    created.id,
                    ""
                )
            ).rejects.toThrow(
                "Function content is required"
            );
        }
    );

    test(
        "cada función debe mantener resultados independientes",
        async () => {

            const first =
                await service.registerFunction(
                    `first_${Date.now()}`,
                    "console.log('a');"
                );

            const second =
                await service.registerFunction(
                    `second_${Date.now()}`,
                    `
                    for(let i = 0; i < n; i++) {
                        console.log(i);
                    }
                    `
                );

            expect(first.id)
                .not.toBe(second.id);
        }
    );

});