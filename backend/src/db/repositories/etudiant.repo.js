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
        id_niveau
    } = etudiantData;


    const result = await db.query(
        `
        INSERT INTO etudiants
        (
            id_utilisateur,
            matricule,
            id_filiere,
            id_niveau
        )
        VALUES ($1,$2,$3,$4)
        RETURNING
            id_etudiant,
            id_utilisateur,
            matricule
        `,
        [
            id_utilisateur,
            matricule,
            id_filiere,
            id_niveau
        ]
    );


    return result.rows[0];
}



module.exports = {
    findByMatricule,
    create
};
