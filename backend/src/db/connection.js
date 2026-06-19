const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'projet_gestion_demandes',
    max: 20,
    idleTimeoutMillis: 30000,
});

pool.query('SELECT NOW()')
    .then(() => console.log('✅ Connexion PostgreSQL réussie'))
    .catch(err => console.error('❌ Erreur PostgreSQL :', err.message));

module.exports = pool;
