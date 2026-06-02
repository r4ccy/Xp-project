const express = require("express");
const app = express();

app.use(express.json());

const tarjetaRoutes = require("./modules/TarjetaCRC/routes");
app.use("/api", tarjetaRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API funcionando correctamente" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});