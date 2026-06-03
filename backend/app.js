const express = require("express");
const cors = require("cors");
const path = require("path");

const complejidadRoutes   = require("./modules/complejidad/routes");
const tarjetaRoutes = require("./modules/tarjeta-crc/routes");
//const analizadorRoutes = require('./modules/analizador-crc/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", complejidadRoutes);
app.use("/api", tarjetaRoutes);
//app.use("/api", analizadorRoutes);

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});