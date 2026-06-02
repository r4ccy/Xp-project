require("dotenv").config();
const pool = require("./config/supabase");

(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log(result.rows);
    console.log("Conexión exitosa");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();