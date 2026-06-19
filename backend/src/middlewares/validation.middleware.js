// ============================================================
// MIDDLEWARE DE VALIDATION
// (validation = vérification)
// Vérifie que les données envoyées par le client sont correctes
// ============================================================

/**
 * validate - Vérifie que les champs requis sont présents
 * @param {Array} requiredFields - Liste des champs obligatoires
 * @returns {Function} - Middleware Express
 * 
 * Utilisation : router.post('/register', validate(['nom', 'email', 'mot_de_passe']), controller.register)
 */
const validate = (requiredFields) => {
    return (req, res, next) => {
        // requiredFields = ['nom', 'email', 'mot_de_passe'] par exemple
        // req.body = ce que le client a envoyé
        
        // Vérifier quels champs sont manquants
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        // Si des champs sont manquants
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Champs manquants : ${missingFields.join(', ')}`
            });
        }
        
        // Tout est bon, on passe au suivant
        next();
    };
};

/**
 * validateEmail - Vérifie que l'email est au bon format
 * (optionnel, pour aller plus loin)
 */
const validateEmail = (req, res, next) => {
    const email = req.body.email;
    
    if (!email) {
        return next(); // pas d'email, on passe (le validate s'en occupera)
    }
    
    // Regex simple pour vérifier le format email
    // email = quelque chose@quelque chose.quelque chose
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Format d\'email invalide'
        });
    }
    
    next();
};

module.exports = { validate, validateEmail };