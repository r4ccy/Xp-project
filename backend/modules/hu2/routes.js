const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.post(
    "/functions",
    controller.createFunction
);

router.get(
    "/functions",
    controller.getFunctions
);

router.put(
    "/functions/:id",
    controller.updateFunction
);

router.delete(
    "/functions/:id",
    controller.deleteFunction
);

module.exports = router;