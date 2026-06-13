// ============================================================
// ROUTES DES DEMANDES
// ============================================================

const express = require('express');
const router = express.Router();

// Import du contrôleur des demandes
const demandeController = require('../controllers/demande.controller');

// Import des middlewares
const { authenticate } = require('../../middlewares/auth.middleware');

// ============================================================
// TOUTES CES ROUTES NÉCESSITENT D'ÊTRE AUTHENTIFIÉ
// ============================================================

// Récupérer toutes les demandes de l'étudiant connecté
router.get('/mes-demandes', authenticate, demandeController.getMesDemandes);

// Créer une nouvelle demande (brouillon)
router.post('/', authenticate, demandeController.createDemande);

// Récupérer une demande spécifique
router.get('/:id', authenticate, demandeController.getDemandeById);

// Modifier un brouillon
router.put('/:id/brouillon', authenticate, demandeController.updateBrouillon);

// Soumettre une demande (l'envoyer pour traitement)
router.post('/:id/soumettre', authenticate, demandeController.soumettreDemande);

module.exports = router;