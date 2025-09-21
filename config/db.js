const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    port: 3309, 
    user: "utnuser",
    password: "utnpass",
    database: "UTNExamen",
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
