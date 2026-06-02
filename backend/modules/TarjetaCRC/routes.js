const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.post("/tarjetas", controller.crearTarjeta);
router.get("/tarjetas/:nombre", controller.obtenerTarjeta);
router.delete("/tarjetas/:nombre", controller.eliminarTarjeta);

module.exports = router;