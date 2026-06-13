// ============================================================
// ROUTES DU WORKFLOW (CIRCUIT DE VALIDATION)
// Ces routes sont utilisées par le personnel pour traiter les demandes
// ============================================================

const express = require('express');
const router = express.Router();

// J'importe le contrôleur qui contient la logique des actions
const workflowController = require('../controllers/workflow.controller');

// J'importe le middleware d'authentification (vérifie que l'utilisateur est connecté)
const { authenticate } = require('../../middlewares/auth.middleware');

// ============================================================
// ROUTES WORKFLOW (TOUTES NÉCESSITENT D'ÊTRE AUTHENTIFIÉ)
// ============================================================

/**
 * POST /api/workflow/:id/valider
 * Valider une demande (la faire avancer d'une étape)
 * 
 * Exemple : un DA valide une réclamation → elle va au professeur
 * 
 * Paramètre : id = l'ID de la demande
 * Body (optionnel) : { "commentaire": "Dossier complet" }
 */
router.post('/:id/valider', authenticate, workflowController.validerDemande);

/**
 * POST /api/workflow/:id/rejeter
 * Rejeter une demande (la refuser définitivement)
 * 
 * Paramètre : id = l'ID de la demande
 * Body : { "motif": "Pièce jointe manquante" }
 */
router.post('/:id/rejeter', authenticate, workflowController.rejeterDemande);

/**
 * GET /api/workflow/:id/historique
 * Voir tout l'historique des actions sur une demande
 * 
 * Paramètre : id = l'ID de la demande
 * Retourne la liste des actions avec dates et commentaires
 */
router.get('/:id/historique', authenticate, workflowController.getHistorique);

// J'exporte le routeur pour l'utiliser dans app.js
module.exports = router;