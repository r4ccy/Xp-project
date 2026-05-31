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

    const result = await pool.query(
      `
        INSERT INTO analyzed_function(name, content)
        VALUES($1, $2)
        RETURNING *
        `,
        [name, content]
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

module.exports = {
    registerFunction,
    getFunctions,
    deleteFunction
};