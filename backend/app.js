require("dotenv").config();

const express = require("express");

const hu2Routes =
    require("./modules/hu2/routes");
const app = express();

app.use(express.json());
app.use("/api", hu2Routes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});