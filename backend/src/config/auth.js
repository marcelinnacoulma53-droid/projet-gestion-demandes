// ============================================================
// CONFIGURATION DE L'AUTHENTIFICATION
// Ce fichier centralise tous les paramètres liés à la sécurité
// ============================================================

// Lecture de la variable d'environnement JWT_SECRET
// Cette clé sert à signer (créer) et vérifier les tokens JWT
// Elle est stockée dans .env pour ne pas être exposée dans le code
const jwtSecret = process.env.JWT_SECRET;

// Durée de validité d'un token JWT
// '24h' = 24 heures. Après ce délai, l'utilisateur doit se reconnecter
// Autres exemples : '1h', '7d', '30m'
const jwtExpire = '24h';

// Nombre de tours de hachage pour bcrypt
// Plus le nombre est élevé, plus le hachage est sécurisé... mais plus lent
// 10 est un bon compromis entre sécurité et performance
// Valeur typique : entre 10 et 12
const bcryptRounds = 10;

// J'exporte un objet contenant toutes ces configurations
// Ainsi, d'autres fichiers peuvent les importer avec require()
module.exports = {
    jwtSecret,
    jwtExpire,
    bcryptRounds
};