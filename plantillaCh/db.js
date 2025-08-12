//Instala las dependencias necesarias:
// npm install express mysql2

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'jefferson_db'  
});



module.exports = pool;



//// Carga de clientes desde CSV
// Asegúrate de tener un archivo 'clients.csv' con las columnas 'name,email