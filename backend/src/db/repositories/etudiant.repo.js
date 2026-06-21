const db = require('../connection');


// =======================================
// Trouver un étudiant par matricule
// Retour : id_etudiant, matricule
// =======================================
async function findByMatricule(matricule) {

    const result = await db.query(
        `
        SELECT
            id_etudiant,
            matricule
        FROM etudiants
        WHERE matricule = $1
        `,
        [matricule]
    );

    return result.rows[0] || null;
}


// =======================================
// Créer un étudiant
// =======================================
async function create(etudiantData) {

    const {
        id_utilisateur,
        matricule,
        id_filiere,
        id_niveau,
        id_option
    } = etudiantData;


    const result = await db.query(
        `
        INSERT INTO etudiants
        (
            id_utilisateur,
            matricule,
            id_filiere,
            id_niveau,
            id_option
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING
            id_etudiant,
            id_utilisateur,
            matricule
        `,
        [
            id_utilisateur,
            matricule,
            id_filiere,
            id_niveau,
            id_option
        ]
    );


    return result.rows[0];
}

// =======================================
// Trouver un étudiant par son ID utilisateur
// =======================================
async function findByUserId(id_utilisateur) {
    const result = await db.query(
        `
        SELECT
            id_etudiant,
            id_utilisateur,
            matricule,
            id_filiere,
            id_niveau
        FROM etudiants
        WHERE id_utilisateur = $1
        `,
        [id_utilisateur]
    );

    return result.rows[0] || null;
}

// =======================================
// Trouver un étudiant par son ID etudiant
// =======================================
async function findById(id_etudiant) {
    const result = await db.query(
        `
        SELECT
            id_etudiant,
            id_utilisateur,
            matricule
        FROM etudiants
        WHERE id_etudiant = $1
        `,
        [id_etudiant]
    );

    return result.rows[0] || null;
}

module.exports = {
    findByMatricule,
    create,
    findByUserId,
    findById
};
