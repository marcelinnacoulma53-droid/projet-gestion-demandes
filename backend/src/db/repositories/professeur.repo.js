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

// =======================================
// Lister tous les professeurs avec leurs noms
// =======================================
async function findAll() {
    const result = await db.query(
        `
        SELECT
            p.id_professeur,
            p.id_utilisateur,
            p.grade,
            p.specialite,
            u.nom,
            u.prenom,
            u.email
        FROM professeurs p
        JOIN utilisateurs u ON p.id_utilisateur = u.id_utilisateur
        ORDER BY u.nom ASC
        `
    );
    return result.rows;
}

module.exports = {
    create,
    findByUserId,
    findAll
};
