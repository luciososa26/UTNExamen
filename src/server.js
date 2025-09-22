const express = require("express");
const app = express();

const usuariosRoutes = require("./routes/usuariosRoutes");
const productosRoutes = require("./routes/productosRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");
const authRoutes = require("./routes/authRoutes");

const { createTable: createUsuarioTable } = require("./models/usuarioModel");
const { createTable: createProductoTable } = require("./models/productoModel");
const { createTable: createPedidoTable } = require("./models/pedidoModel");

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);
app.use("/pedidos", pedidosRoutes);

const startServer = async () => {
  try {
    await createUsuarioTable();
    await createProductoTable();
    await createPedidoTable();

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error creando tablas:", err);
  }
};

startServer();
