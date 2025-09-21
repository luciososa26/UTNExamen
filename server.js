const express = require("express");
const app = express();
const usuariosRoutes = require("./routes/usuariosRoutes");
const productosRoutes = require("./routes/productosRoutes")
const pedidosRoutes = require("./routes/pedidosRoutes")
const authRoutes = require("./routes/authRoutes")

app.use(express.json());
app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use('/auth', authRoutes)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
