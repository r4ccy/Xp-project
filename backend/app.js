const express = require("express");
const cors = require("cors");
const path = require("path");

const hu2Routes =
    require("./modules/hu2/routes");

const tarjetaRoutes =
    require("./modules/TarjetaCRC/routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", hu2Routes);
app.use("/api", tarjetaRoutes);

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