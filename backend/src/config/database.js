const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

module.exports = pool;

pool.query('SELECT NOW()')
.then(result => {
    console.log("Connexion PostgreSQL réussie :", result.rows[0]);
})
.catch(error => {
    console.error("Erreur PostgreSQL :", error);
});
