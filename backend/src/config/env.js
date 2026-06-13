require('dotenv').config();  // ← Va lire le fichier .env
const authConfig = require('./auth');

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: authConfig.jwtSecret,
    jwtExpire: authConfig.jwtExpire
};