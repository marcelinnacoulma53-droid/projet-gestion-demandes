// ============================================================
// ROUTES DES DOCUMENTS (FICHIERS JOINTS)
// Gère l'upload, le téléchargement et la suppression des fichiers
// ============================================================

const express = require('express');
const router = express.Router();

// J'importe le contrôleur qui gère la logique des fichiers
const documentController = require('../controllers/document.controller');

// J'importe le middleware d'authentification (vérifie que l'utilisateur est connecté)
const { authenticate } = require('../../middlewares/auth.middleware');


// ============================================================
// ROUTES DOCUMENTS (TOUTES NÉCESSITENT D'ÊTRE AUTHENTIFIÉ)
// ============================================================

/**
 * POST /api/documents/upload/:demandeId
 * Uploader un fichier pour une demande spécifique
 * 
 * Exemple : un étudiant joint un PDF à sa réclamation
 * 
 * Paramètre : demandeId = L'ID de la demande concernée
 * Body : fichier (multipart/form-data)
 */
router.post(
    '/upload/:demandeId', 
    authenticate,           // Vérifie que l'utilisateur est connecté
    documentController.upload.single('fichier'),  // ← middleware multer // Traite le fichier (un seul fichier, nommé 'fichier')
    documentController.uploadFichier 
);

/**
 * GET /api/documents/:documentId
 * Télécharger un fichier
 * 
 * Exemple : un secrétaire télécharge la pièce jointe d'une demande
 * 
 * Paramètre : documentId = L'ID du document à télécharger
 */
router.get('/:documentId', authenticate, documentController.download);

/**
 * DELETE /api/documents/:documentId
 * Supprimer un fichier
 * 
 * Exemple : un étudiant supprime un brouillon avec sa pièce jointe
 * 
 * Paramètre : documentId = L'ID du document à supprimer
 */
router.delete('/:documentId', authenticate, documentController.delete);

// J'exporte le routeur pour l'utiliser dans app.js
module.exports = router;