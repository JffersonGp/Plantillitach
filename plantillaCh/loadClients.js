
//. Script de carga de clientes desde CSV
//Instala las dependencias necesarias:
//npm install csv-parser mysql2
//Asegúrate de tener un archivo 'clients.csv' con las columnas 'name'
const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');

async function loadClients() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'jefferson_db'
    });

    const clients = [];
    fs.createReadStream('clients.csv')
        .pipe(csv())
        .on('data', (row) => {
            clients.push([row.name, row.email]);
        })
        .on('end', async () => {
            for (const client of clients) {
                await connection.execute(
                    'INSERT INTO Client (name, email) VALUES (?, ?)',
                    client
                );
            }
            console.log('Carga de clientes completada');
            await connection.end();
        });
}

loadClients();