// ============================================================
// ROUTES D'AUTHENTIFICATION
// Définit les endpoints pour l'authentification
// ============================================================

const express = require('express');
const router = express.Router();

// ✅ Import du contrôleur
const authController = require('../controllers/auth.controller');

// ✅ Import du middleware d'authentification
const { authenticate } = require('../../middlewares/auth.middleware');
// ✅ IMPORTER LE MIDDLEWARE DE VALIDATION
const { validate, validateEmail } = require('../../middlewares/validation.middleware');
// Import du middleware checkRole
const { checkRole } = require('../../middlewares/role.middleware');

// ============================================================
// ROUTES PUBLIQUES (sans authentification)
// ============================================================

// ✅ Inscription étudiant
// Inscription avec validation des champs
router.post('/register', 
    validate(['nom', 'prenom', 'matricule', 'email', 'mot_de_passe']),
    validateEmail,
    authController.register
);

// ✅ Connexion (étudiants + staff)
// Connexion avec validation des champs
router.post('/login',
    validate(['email', 'mot_de_passe']),
    authController.login
);

// ✅ Déconnexion
router.post('/logout', authController.logout);

// ============================================================
// ROUTES PROTÉGÉES (nécessitent un token valide)
// ============================================================

// ✅ Profil de l'utilisateur connecté
router.get('/me', authenticate, authController.getMe);

// ✅ Changer les identifiants (première connexion du personnel)
router.post('/changer-identifiants', 
    authenticate,
    authController.changerIdentifiants
);

// ============================================================
// À VENIR PLUS TARD
// ============================================================
// ✅ Création d'un compte staff par l'admin (authenticate + checkRole)
// router.post('/admin/staff', authenticate, checkRole(['admin']), authController.createStaff);

// Route pour créer un compte staff (admin uniquement) avec validation
router.post('/admin/staff', 
    authenticate, 
    checkRole(['admin']),
    validate(['nom', 'prenom', 'email', 'mot_de_passe', 'role']),
    validateEmail,
    authController.createStaff
);

module.exports = router;