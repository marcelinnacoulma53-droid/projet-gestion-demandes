const db = require('../connection');


// =======================================
// Créer un professeur
// =======================================
async function create(professeurData) {

    const {
        id_utilisateur,
        grade,
        specialite
    } = professeurData;


    const result = await db.query(
        `
        INSERT INTO professeurs
        (
            id_utilisateur,
            grade,
            specialite
        )
        VALUES ($1,$2,$3)
        RETURNING
            id_professeur,
            id_utilisateur
        `,
        [
            id_utilisateur,
            grade,
            specialite
        ]
    );


    return result.rows[0];
}



// =======================================
// Trouver un professeur par ID utilisateur
// =======================================
async function findByUserId(id_utilisateur) {
    const result = await db.query(
        `
        SELECT
            id_professeur,
            id_utilisateur,
            grade,
            specialite
        FROM professeurs
        WHERE id_utilisateur = $1
        `,
        [id_utilisateur]
    );

    return result.rows[0] || null;
}

module.exports = {
    create,
    findByUserId
};
