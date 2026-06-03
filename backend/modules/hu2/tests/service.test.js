const service = require("../service");

describe("Análisis de complejidad", () => {

    test(
        "debe calcular complejidad O(1) si no hay ciclos ni recursividad",
        () => {

            const result =
                service.analyzeComplexity(
                    "saludar",
                    "console.log('Hola');"
                );

            expect(result)
                .toBe("O(1)");
        }
    );

    test(
        "debe calcular complejidad O(n) por un ciclo",
        () => {

            const result =
                service.analyzeComplexity(
                    "recorrer",
                    `
                    for(let i = 0; i < n; i++) {
                        console.log(i);
                    }
                    `
                );

            expect(result)
                .toBe("O(n)");
        }
    );

    test(
    "debe calcular complejidad O(n) por un ciclo",
    () => {

        const result =
            service.analyzeComplexity(
                "recorrer",
                `
                for(let i = 0; i < n; i++) {
                    console.log(i);
                }
                `
            );

        expect(result)
            .toBe("O(n)");
    }
);

    test(
        "debe calcular complejidad O(n²) por ciclos anidados",
        () => {

            const result =
                service.analyzeComplexity(
                    "ordenar",
                    `
                    for(let i = 0; i < n; i++) {
                        for(let j = 0; j < n; j++) {
                            console.log(i, j);
                        }
                    }
                    `
                );

            expect(result)
                .toBe("O(n²)");
        }
    );

    test(
        "debe lanzar error cuando la complejidad no puede determinarse",
        () => {

            expect(() =>
                service.analyzeComplexity(
                    "desconocida",
                    "@@@"
                )
            ).toThrow(
                "The complexity of the function could not be determined"
            );
        }
    );

});