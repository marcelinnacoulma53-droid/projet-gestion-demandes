// ============================================================
// ROUTES DES NOTIFICATIONS
// Gère la consultation des notifications (lues/non lues)
// ============================================================

const express = require('express');
const router = express.Router();

// J'importe le contrôleur qui contient la logique des notifications
const notificationController = require('../controllers/notification.controller');

// J'importe le middleware d'authentification
// Toutes les notifications sont personnelles, donc l'utilisateur doit être connecté
const { authenticate } = require('../../middlewares/auth.middleware');

// ============================================================
// ROUTES NOTIFICATIONS (TOUTES NÉCESSITENT D'ÊTRE AUTHENTIFIÉ)
// ============================================================

/**
 * GET /api/notifications
 * Récupérer toutes les notifications de l'utilisateur connecté
 * 
 * Exemple : un étudiant consulte ses notifications
 * 
 * Triées par date décroissante (les plus récentes d'abord)
 * Possibilité d'ajouter un filtre ?lu=false pour voir uniquement les non lues
 */
router.get('/', authenticate, notificationController.getMesNotifications);

/**
 * PUT /api/notifications/:id/lu
 * Marquer une notification comme lue
 * 
 * Exemple : l'utilisateur clique sur une notification pour la lire
 * 
 * Paramètre : id = L'ID de la notification à marquer
 */
router.put('/:id/lu', authenticate, notificationController.marquerCommeLu);

/**
 * PUT /api/notifications/lire-tout
 * Marquer TOUTES les notifications de l'utilisateur comme lues
 * 
 * Exemple : l'utilisateur clique sur "Tout marquer comme lu"
 */
router.put('/lire-tout', authenticate, notificationController.toutMarquerCommeLu);

/**
 * DELETE /api/notifications/:id
 * Supprimer une notification
 * 
 * Exemple : l'utilisateur supprime une notification qu'il a déjà lue
 * 
 * Paramètre : id = L'ID de la notification à supprimer
 */
router.delete('/:id', authenticate, notificationController.supprimerNotification);

// J'exporte le routeur pour l'utiliser dans app.js
module.exports = router;