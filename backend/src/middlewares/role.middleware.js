// ============================================================
// MIDDLEWARE DE VÉRIFICATION DES RÔLES
// ============================================================

// checkRole est une fonction qui reçoit un tableau de rôles autorisés
// Exemple d'appel : checkRole(['admin', 'secretaire'])
const checkRole = (allowedRoles) => {
    
    // Elle RETOURNE une autre fonction (le vrai middleware)
    // Ce middleware reçoit req, res, next comme tout middleware Express
    return (req, res, next) => {
        
        // ÉTAPE 1 : Vérifier que l'utilisateur est authentifié
        // req.user est ajouté par le middleware authenticate (exécuté avant)
        if (!req.user) {
            // 401 = Non authentifié (pas connecté du tout)
            return res.status(401).json({ 
                message: 'Non authentifié' 
            });
        }

        // ÉTAPE 2 : Vérifier que son rôle est dans la liste autorisée
        // req.user.role = "etudiant" par exemple
        if (!allowedRoles.includes(req.user.role)) {
            // 403 = Interdit (connecté mais pas les droits suffisants)
            return res.status(403).json({ 
                message: `Accès interdit. Rôle requis : ${allowedRoles.join(', ')}` 
            });
        }

        // ÉTAPE 3 : Si tout est bon, on laisse passer
        next();
    };
};

// On exporte la fonction pour l'utiliser dans les routes
module.exports = { checkRole };