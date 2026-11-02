const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const clientesRoutes = require("./routes/clientesRoutes");
const menuRoutes = require("./routes/menuRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/api", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/pedidos", pedidosRoutes);

app.get("/", (req,res) => {
    res.json({
        mensaje: "Backend funcionando correctamnte"
    });
});

module.exports = app;