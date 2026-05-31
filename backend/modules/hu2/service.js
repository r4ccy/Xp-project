const pool = require("../../config/supabase");

async function registerFunction(name, content) {
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

module.exports = {
    registerFunction,
    getFunctions
};