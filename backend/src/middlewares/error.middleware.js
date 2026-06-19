// ============================================================
// MIDDLEWARE DE GESTION DES ERREURS
// Capture toutes les erreurs non gérées par try/catch
// ============================================================

/**
 * errorHandler - Middleware global de gestion des erreurs
 * Doit être le dernier middleware chargé dans app.js
 * 
 * @param {Error} err - L'erreur capturée
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
const errorHandler = (err, req, res, next) => {
    // Affiche l'erreur complète dans le terminal (pour déboguer)
    console.error('❌ Erreur capturée :', err.stack);

    // Vérifie si l'erreur a un code HTTP spécifique
    const statusCode = err.statusCode || 500;

    // Message d'erreur (si personnalisé, on le garde)
    const message = err.message || 'Erreur interne du serveur';

    // Envoie la réponse au client
    res.status(statusCode).json({
        success: false,
        message: message,
        // En développement, on peut renvoyer plus de détails (optionnel)
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { errorHandler };