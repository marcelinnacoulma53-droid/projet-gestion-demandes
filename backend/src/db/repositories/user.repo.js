const db = require('../connection');


// =======================================
// Trouver un utilisateur par email
// Retour : id_utilisateur, email, mot_de_passe, actif, id_role
// =======================================
async function findByEmail(email) {

    const result = await db.query(
        `
        SELECT 
            id_utilisateur,
            email,
            mot_de_passe,
            actif,
            id_role
        FROM utilisateurs
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0] || null;
}


// =======================================
// Trouver un utilisateur avec son rôle
// =======================================
async function findByEmailWithRole(email) {

    const result = await db.query(
        `
        SELECT 
            u.id_utilisateur,
            u.email,
            u.mot_de_passe,
            u.actif,
            u.id_role,
            r.libelle AS role_libelle
        FROM utilisateurs u
        LEFT JOIN roles r
            ON u.id_role = r.id_role
        WHERE u.email = $1
        `,
        [email]
    );

    return result.rows[0] || null;
}


// =======================================
// Trouver un utilisateur par ID
// =======================================
async function findById(id) {

    const result = await db.query(
        `
        SELECT
            id_utilisateur,
            nom,
            prenom,
            email,
            telephone
        FROM utilisateurs
        WHERE id_utilisateur = $1
        `,
        [id]
    );

    return result.rows[0] || null;
}


// =======================================
// Créer un utilisateur
// =======================================
async function create(userData) {

    const {
        nom,
        prenom,
        email,
        mot_de_passe,
        id_role
    } = userData;


    const result = await db.query(
        `
        INSERT INTO utilisateurs
        (
            nom,
            prenom,
            email,
            mot_de_passe,
            id_role
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING
            id_utilisateur,
            nom,
            prenom,
            email
        `,
        [
            nom,
            prenom,
            email,
            mot_de_passe,
            id_role
        ]
    );


    return result.rows[0];
}


// =======================================
// Trouver l'étudiant lié à un utilisateur
// =======================================
async function findEtudiantByUserId(id_utilisateur) {

    const result = await db.query(
        `
        SELECT
            id_etudiant,
            id_utilisateur,
            matricule
        FROM etudiants
        WHERE id_utilisateur = $1
        `,
        [id_utilisateur]
    );


    return result.rows[0] || null;
}



// Export du repository
module.exports = {
    findByEmail,
    findByEmailWithRole,
    findById,
    create,
    findEtudiantByUserId
};
