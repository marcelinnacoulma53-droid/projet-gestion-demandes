const db = require('../connection');


// =======================================
// Créer un personnel administratif
// =======================================
async function create(personnelData) {

    const {
        id_utilisateur,
        fonction,
        service
    } = personnelData;


    const result = await db.query(
        `
        INSERT INTO personnel_administratif
        (
            id_utilisateur,
            fonction,
            service
        )
        VALUES ($1,$2,$3)
        RETURNING
            id_personnel,
            id_utilisateur
        `,
        [
            id_utilisateur,
            fonction,
            service
        ]
    );


    return result.rows[0];
}



module.exports = {
    create
};
