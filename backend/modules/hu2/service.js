const pool = require("../../config/supabase");

async function registerFunction(name, content) {

    const existingFunction = await pool.query(
        `
        SELECT *
        FROM analyzed_function
        WHERE name = $1
        `,
        [name]
    );

    if (existingFunction.rows.length > 0) {
        throw new Error("Function name already exists");
    }

    const complexity =
        analyzeComplexity(
            name,
            content
        );

    const result = await pool.query(
        `
        INSERT INTO analyzed_function(
            name,
            content,
            complexity
        )
        VALUES($1, $2, $3)
        RETURNING *
        `,
        [
            name,
            content,
            complexity
        ]
    );

    return result.rows[0];
}

async function getFunctions() {
    const result = await pool.query(
        `
        SELECT *
        FROM analyzed_function
        ORDER BY id
        `
    );
    return result.rows;
}

async function deleteFunction(id) {
    const result = await pool.query(
        `
        DELETE FROM analyzed_function
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );
    return result.rows[0];
}

function analyzeComplexity(name, content) {
    const loops =
        content.match(/for|while/g);

    if (content.includes("@@@")) {
        throw new Error(
            "The complexity of the function could not be determined"
        );
    }

    if (loops && loops.length >= 2) {
        return "O(n²)";
    }

    if (loops && loops.length === 1) {
        return "O(n)";
    }

    //if (
    //    content.includes(`${name}(`)
    //) {
    //    return "O(n)";
    //}
    return "O(1)";
}

async function updateFunction(id, content) {

    const currentFunction = await pool.query(
        `
        SELECT *
        FROM analyzed_function
        WHERE id = $1
        `,
        [id]
    );

    if (currentFunction.rows.length === 0) {
        throw new Error(
            "Function not found"
        );
    }

    const name =
        currentFunction.rows[0].name;

    const complexity =
        analyzeComplexity(
            name,
            content
        );

    const result = await pool.query(
        `
        UPDATE analyzed_function
        SET content = $1,
            complexity = $2
        WHERE id = $3
        RETURNING *
        `,
        [
            content,
            complexity,
            id
        ]
    );

    return result.rows[0];
}

module.exports = {
    registerFunction,
    getFunctions,
    deleteFunction,
    analyzeComplexity,
    updateFunction
};