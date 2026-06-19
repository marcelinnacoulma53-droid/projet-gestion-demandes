// ============================================================
// CONNEXION À LA BASE DE DONNÉES POSTGRESQL
// Ce fichier crée et exporte un pool de connexions
// ============================================================

const { Pool } = require('pg');
require('dotenv').config();

// Création d'un pool de connexions
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'gestion_demandes',
    max: 20,
    idleTimeoutMillis: 30000,
});

// Test de connexion (pour vérifier que tout fonctionne)
pool.query('SELECT NOW()')
    .then(result => {
        console.log("✅ Connexion PostgreSQL réussie :", result.rows[0]);
    })
    .catch(error => {
        console.error("❌ Erreur PostgreSQL :", error.message);
    });

module.exports = pool;