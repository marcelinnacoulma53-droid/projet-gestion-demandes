// J'importe jsonwebtoken (l'outil qui gère les tokens)
// require = "je veux utiliser ce paquet installé avec npm"
const jwt = require('jsonwebtoken');

// J'importe la configuration (pour récupérer le secret)
//m const config = require('../config/env');
const { jwtSecret } = require('../config/auth');

// Je crée une fonction que j'appellerai "authenticate"
// (req, res, next) = les 3 paramètres de tout middleware
const authenticate = (req, res, next) => {
    // ----- ÉTAPE 1 : Lire le token -----
    // Le token est envoyé dans l'en-tête "Authorization"
    // Format attendu : "Bearer eyJhbGciOiJ..."
    // req.headers.authorization = "Bearer xxxxx"
    const authHeader = req.headers.authorization;

    // ----- ÉTAPE 2 : Vérifier que l'en-tête existe -----
    if (!authHeader) {
        // Pas de token → l'utilisateur n'est pas authentifié
        // res.status(401) = code HTTP "Non autorisé"
        return res.status(401).json({ 
            message: 'Accès non autorisé. Token manquant.' 
        });
    }

    // ----- ÉTAPE 3 : Extraire le token -----
    // "Bearer xxxxx".split(' ') = ["Bearer", "xxxxx"]
    // [1] = prend le deuxième élément (le token)
    const token = authHeader.split(' ')[1];

    // ----- ÉTAPE 4 : Vérifier que le token existe -----
    if (!token) {
        return res.status(401).json({ 
            message: 'Accès non autorisé. Format du token invalide.' 
        });
    }

    // ----- ÉTAPE 5 : Vérifier la validité du token -----
    // jwt.verify() vérifie que le token est authentique et non expiré
    // 3 paramètres : (token, secret, callback)
    // Si c'est bon → on récupère le décodage (decoded)
    // Si c'est faux → erreur
    jwt.verify(token, jwtSecret, (err, decoded) => {
        
        // Si erreur → token invalide (falsifié ou expiré)
        if (err) {
            return res.status(401).json({ 
                message: 'Token invalide ou expiré.' 
            });
        }

        // ----- ÉTAPE 6 : Succès ! -----
        // decoded contient ce qui a été mis dans le token
        // Exemple : { userId: 1, role: "etudiant", iat: 123456789 }
        
        // J'attache ces infos à req.user
        // Ainsi, le contrôleur (ou les prochains middlewares) pourra savoir qui est connecté
        req.user = decoded;

        // ----- ÉTAPE 7 : Laisser passer -----
        // next() signifie "passe au middleware/contrôleur suivant"
        next();
    });
};

// ----- J'exporte la fonction -----
// module.exports = rend disponible pour les autres fichiers
module.exports = { authenticate };