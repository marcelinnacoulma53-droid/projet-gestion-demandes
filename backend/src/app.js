// ============================================================
// APPLICATION EXPRESS
// ============================================================

const express = require('express');
const cors = require('cors');

// Test de connexion PostgreSQL (ajouté depuis M1)
/*const db = require('./config/database');
db.query('SELECT NOW()')
    .then(result => {
        console.log("✅ Connexion PostgreSQL réussie :", result.rows[0]);
    })
    .catch(error => {
        console.error("❌ Erreur PostgreSQL :", error.message);
    });*/

// ============================================================
// IMPORT DES ROUTES
// ============================================================

const authRoutes = require('./api/routes/auth.routes');
const demandeRoutes = require('./api/routes/demandes.routes');
const workflowRoutes = require('./api/routes/workflow.routes');
const documentRoutes = require('./api/routes/documents.routes');
const notificationRoutes = require('./api/routes/notifications.routes');
const { errorHandler } = require('./middlewares/error.middleware');

// ============================================================
// CRÉATION DE L'APPLICATION
// ============================================================

const app = express();
// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});
// ============================================================
// MIDDLEWARES GLOBAUX
// ============================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// ROUTE DE TEST
// ============================================================

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// ============================================================
// ENREGISTREMENT DES ROUTES
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandeRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);

// ============================================================
// GESTION DES ERREURS 404
// ============================================================

app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// ============================================================
// MIDDLEWARE D'ERREUR GLOBAL
// ============================================================

app.use(errorHandler);

module.exports = app;