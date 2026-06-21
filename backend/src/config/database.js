const { Pool } = require('pg');
require('dotenv').config();

const useSsl = process.env.DB_SSL
    ? process.env.DB_SSL === 'true'
    : Boolean(process.env.DATABASE_URL) && process.env.NODE_ENV === 'production';

const poolConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
} : {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestion_demandes',
};

const pool = new Pool({
    ...poolConfig,
    ...(useSsl && { ssl: { rejectUnauthorized: false } }),
    max: Number(process.env.DB_POOL_MAX) || 20,
    idleTimeoutMillis: 30000,
});

pool.query('SELECT NOW()')
    .then(result => {
        console.log('Connexion PostgreSQL reussie :', result.rows[0]);
    })
    .catch(error => {
        console.error('Erreur PostgreSQL :', error.code || error.message || error);
    });

module.exports = pool;
