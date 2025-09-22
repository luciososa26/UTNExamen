const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3309,
    user: process.env.DB_USER || "utnuser",
    password: process.env.DB_PASSWORD || "utnpass",
    database: process.env.DB_NAME || "UTNExamen",
    waitForConnections: true,
    connectionLimit: 10,
});

const db = pool.promise();

db.getConnection()
    .then(connection => {
        console.log("Conectado a MySQL en Docker (UTNExamen) con Pool");
        connection.release(); 
    })
    .catch(err => {
        console.error("Error conectando a la BD:", err);
        process.exit(1);
    });

module.exports = db;
