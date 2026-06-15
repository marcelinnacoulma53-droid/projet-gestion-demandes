const db = require('../connection');


// =======================================
// Créer un document
// =======================================
async function create(documentData) {

    const {
        id_demande,
        nom_fichier,
        nom_original,
        type_fichier,
        taille,
        chemin_stockage,
        id_type_document
    } = documentData;


    const result = await db.query(
        `
        INSERT INTO documents
        (
            id_demande,
            nom_fichier,
            nom_original,
            type_fichier,
            taille,
            chemin_stockage,
            id_type_document
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING
            id_document,
            id_demande,
            nom_original
        `,
        [
            id_demande,
            nom_fichier,
            nom_original,
            type_fichier,
            taille,
            chemin_stockage,
            id_type_document
        ]
    );


    return result.rows[0];
}



// =======================================
// Trouver un document par ID
// =======================================
async function findById(documentId) {

    const result = await db.query(
        `
        SELECT
            id_document,
            id_demande,
            nom_original,
            chemin_stockage,
            type_fichier,
            taille
        FROM documents
        WHERE id_document = $1
        `,
        [documentId]
    );


    return result.rows[0] || null;
}



// =======================================
// Trouver les documents d'une demande
// =======================================
async function findByDemande(demandeId) {

    const result = await db.query(
        `
        SELECT
            id_document,
            nom_original
        FROM documents
        WHERE id_demande = $1
        ORDER BY date_depot DESC
        `,
        [demandeId]
    );


    return result.rows;
}



// =======================================
// Supprimer un document
// =======================================
async function deleteDocument(documentId) {

    const result = await db.query(
        `
        DELETE FROM documents
        WHERE id_document = $1
        `,
        [documentId]
    );


    return result.rowCount > 0;
}



module.exports = {
    create,
    findById,
    findByDemande,
    delete: deleteDocument
};
