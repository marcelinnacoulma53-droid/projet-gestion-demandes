const db = require('../connection');


// =======================================
// Trouver un rôle par son libellé
// Exemple : 'etudiant', 'admin'
// Retour : id_role, libelle
// =======================================
async function findByLibelle(libelle) {

    const result = await db.query(
        `
        SELECT
            id_role,
            libelle
        FROM roles
        WHERE LOWER(libelle) = LOWER($1)
        `,
        [libelle]
    );


    return result.rows[0] || null;
}



module.exports = {
    findByLibelle
};
