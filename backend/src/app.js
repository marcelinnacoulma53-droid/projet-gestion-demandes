// ============================================================
// APPLICATION EXPRESS
// Ce fichier configure le serveur (middlewares, routes, erreurs)
// ============================================================

const express = require('express');
const cors = require('cors');

// ============================================================
// IMPORT DES ROUTES
// ============================================================

// Routes d'authentification
const authRoutes = require('./api/routes/auth.routes');
// Roues des demandes
const demandeRoutes = require('./api/routes/demandes.routes');
//routes des 
const workflowRoutes = require('./api/routes/workflow.routes');
//routes 
const documentRoutes = require('./api/routes/documents.routes');
//routes 
const { errorHandler } = require('./middlewares/error.middleware');
// route
const notificationRoutes = require('./api/routes/notifications.routes');
// ============================================================
// CRÉATION DE L'APPLICATION
// ============================================================

const app = express();

// ============================================================
// MIDDLEWARES GLOBAUX
// ============================================================

// CORS : autorise le frontend (sur un autre port) à appeler l'API
app.use(cors());

// JSON : transforme les requêtes JSON en objet JavaScript utilisable
app.use(express.json());

// URL encodée : pour les formulaires classiques (optionnel mais recommandé)
app.use(express.urlencoded({ extended: true }));

// ============================================================
// ROUTE DE TEST (pour vérifier que le serveur fonctionne)
// ============================================================

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// ============================================================
// ENREGISTREMENT DES ROUTES DE L'API
// ============================================================

// Toutes les routes d'authentification sont préfixées par /api/auth
// Exemple : /api/auth/register, /api/auth/login, /api/auth/me
app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandeRoutes); 
// ============================================================
// GESTION DES ERREURS 404 (route non trouvée)
// ============================================================

app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// ============================================================
// MIDDLEWARE D'ERREUR GLOBAL
// Capturera toutes les erreurs non gérées ailleurs
// ============================================================

app.use((err, req, res, next) => {
    console.error('Erreur non capturée :', err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur' });
});


app.use('/api/workflow', workflowRoutes);


app.use('/api/documents', documentRoutes);

app.use('/api/notifications', notificationRoutes);

// ============================================================
// MIDDLEWARE D'ERREUR GLOBAL
// Doit être APRÈS toutes les routes
// ============================================================


app.use(errorHandler);
// ============================================================
// EXPORT DE L'APPLICATION
// ============================================================
module.exports = app;