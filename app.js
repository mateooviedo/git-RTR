const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", authRoutes);

app.use("/api/clientes", require("./routes/clientesRoutes"));

app.get("/", (req,res) => {
    res.json({
        mensaje: "Backend funcionando correctamnte"
    });
});

module.exports = app;