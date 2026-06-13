// ============================================================
// CONNEXION À LA BASE DE DONNÉES POSTGRESQL
// Ce fichier crée et exporte un pool de connexions
// ============================================================

// J'importe le module "pg" (PostgreSQL client for Node.js)
// Ce module permet de faire des requêtes SQL depuis Node.js
// Il a été installé avec : npm install pg
const { Pool } = require('pg');

// Création d'un pool de connexions
// Un "pool" est un ensemble de connexions prêtes à l'emploi
// Au lieu d'ouvrir/fermer une connexion à chaque requête (lent),
// on réutilise des connexions existantes (rapide)
const pool = new Pool({
    // hôte = adresse du serveur PostgreSQL
    // localhost = la base est sur la même machine que le backend
    host: process.env.DB_HOST || 'localhost',
    
    // port = numéro de porte où PostgreSQL écoute
    // 5432 = port par défaut de PostgreSQL
    port: process.env.DB_PORT || 5432,
    
    // user = nom d'utilisateur PostgreSQL
    // par défaut c'est 'postgres'
    user: process.env.DB_USER || 'postgres',
    
    // password = mot de passe de l'utilisateur PostgreSQL
    // Ce mot de passe est défini lors de l'installation de PostgreSQL
    password: process.env.DB_PASSWORD,
    
    // database = nom de la base de données à utiliser
    database: process.env.DB_NAME || 'gestion_demandes',
    
    // Optionnel : nombre maximum de connexions dans le pool
    max: 20,
    
    // Optionnel : temps d'inactivité avant fermeture (ms)
    idleTimeoutMillis: 30000,
});

// J'exporte le pool pour qu'il soit utilisable dans d'autres fichiers
// Exemple : const pool = require('./config/database');
module.exports = pool;