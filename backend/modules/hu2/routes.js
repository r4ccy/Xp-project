const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.post(
    "/functions",
    controller.createFunction
);

module.exports = router;