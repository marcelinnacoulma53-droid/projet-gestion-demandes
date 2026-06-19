const db = require('../connection');


// =======================================
// Créer une demande
// =======================================
async function create(demandeData) {

    const {
        reference,
        id_etudiant,
        objet,
        description,
        id_type_demande,
        id_statut,
        id_etape_courante
    } = demandeData;


    const result = await db.query(
        `
        INSERT INTO demandes
        (
            reference,
            id_etudiant,
            objet,
            description,
            id_type_demande,
            id_statut,
            id_etape_courante
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING
            id_demande,
            reference,
            objet,
            description,
            date_creation
        `,
        [
            reference,
            id_etudiant,
            objet,
            description,
            id_type_demande,
            id_statut,
            id_etape_courante
        ]
    );


    return result.rows[0];
}



// =======================================
// Trouver les demandes d'un étudiant
// =======================================
async function findByEtudiant(id_etudiant) {

    const result = await db.query(
        `
        SELECT
            id_demande,
            reference,
            objet,
            s.libelle AS statut
        FROM demandes d
        LEFT JOIN statuts s
            ON d.id_statut = s.id_statut
        WHERE d.id_etudiant = $1
        ORDER BY d.date_creation DESC
        `,
        [id_etudiant]
    );


    return result.rows;
}



// =======================================
// Trouver une demande par ID
// =======================================
async function findById(id_demande) {

    const result = await db.query(
        `
        SELECT
            d.id_demande,
            d.reference,
            d.objet,
            d.description,
            s.libelle AS statut,
            d.date_creation,
            d.id_etudiant
        FROM demandes d
        LEFT JOIN statuts s
            ON d.id_statut = s.id_statut
        WHERE d.id_demande = $1
        `,
        [id_demande]
    );


    return result.rows[0] || null;
}



// =======================================
// Mettre à jour une demande
// =======================================
async function update(id_demande, updates) {

    const fields = [];
    const values = [];

    let index = 1;


    for (const key in updates) {

        fields.push(`${key} = $${index}`);
        values.push(updates[key]);

        index++;
    }


    if (fields.length === 0) {
        return null;
    }


    values.push(id_demande);


    const result = await db.query(
        `
        UPDATE demandes
        SET ${fields.join(', ')}
        WHERE id_demande = $${index}
        RETURNING *
        `,
        values
    );


    return result.rows[0] || null;
}



// =======================================
// Récupérer toutes les demandes
// (fonction déjà présente avant)
// =======================================
async function findAll() {

    const result = await db.query(
        `
        SELECT *
        FROM demandes
        ORDER BY date_creation DESC
        `
    );


    return result.rows;
}



module.exports = {
    create,
    findByEtudiant,
    findById,
    update,
    findAll
};
