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
            LOWER(s.libelle) AS statut,
            LOWER(td.libelle) AS type_demande,
            LOWER(ew.libelle) AS etape_courante,
            d.date_creation,
            d.id_etudiant,
            d.id_statut,
            d.id_type_demande,
            d.id_etape_courante
        FROM demandes d
        LEFT JOIN statuts s
            ON d.id_statut = s.id_statut
        LEFT JOIN types_demande td
            ON d.id_type_demande = td.id_type_demande
        LEFT JOIN etapes_workflow ew
            ON d.id_etape_courante = ew.id_etape
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

//
async function getTypeDemandeId(libelleType) {
    const result = await db.query(
        `SELECT id_type_demande FROM types_demande WHERE libelle ILIKE $1`,
        [libelleType]
    );
    return result.rows[0]?.id_type_demande || null;
}

async function getStatutId(libelleStatut) {
    const result = await db.query(
        `SELECT id_statut FROM statuts WHERE libelle ILIKE $1`,
        [libelleStatut]
    );
    return result.rows[0]?.id_statut || null;
}

async function getEtapeId(libelleEtape) {
    const result = await db.query(
        `SELECT id_etape FROM etapes_workflow WHERE libelle ILIKE $1`,
        [libelleEtape]
    );
    return result.rows[0]?.id_etape || null;
}

async function findByStatutLibelle(libelleStatut) {
    const result = await db.query(
        `
        SELECT
            d.id_demande, d.reference, d.objet, d.description, d.date_creation,
            d.id_etudiant, td.libelle AS type_demande, s.libelle AS statut,
            ew.libelle AS etape_courante
        FROM demandes d
        LEFT JOIN types_demande td ON d.id_type_demande = td.id_type_demande
        LEFT JOIN statuts s ON d.id_statut = s.id_statut
        LEFT JOIN etapes_workflow ew ON d.id_etape_courante = ew.id_etape
        WHERE s.libelle ILIKE $1
        ORDER BY d.date_creation DESC
        `,
        [libelleStatut]
    );
    return result.rows;
}

async function findByEtapeLibelle(libelleEtape) {
    const result = await db.query(
        `
        SELECT
            d.id_demande, d.reference, d.objet, d.description, d.date_creation,
            d.id_etudiant, td.libelle AS type_demande, s.libelle AS statut,
            ew.libelle AS etape_courante,
            u.nom AS nom_etudiant, u.prenom AS prenom_etudiant
        FROM demandes d
        LEFT JOIN types_demande td ON d.id_type_demande = td.id_type_demande
        LEFT JOIN statuts s ON d.id_statut = s.id_statut
        LEFT JOIN etapes_workflow ew ON d.id_etape_courante = ew.id_etape
        LEFT JOIN etudiants e ON d.id_etudiant = e.id_etudiant
        LEFT JOIN utilisateurs u ON e.id_utilisateur = u.id_utilisateur
        WHERE ew.libelle ILIKE $1
        ORDER BY d.date_creation DESC
        `,
        [libelleEtape]
    );
    return result.rows;
}

async function findByTypeLibelles(listeLibellesType) {
    const result = await db.query(
        `
        SELECT
            d.id_demande, d.reference, d.objet, d.description, d.date_creation,
            d.id_etudiant, td.libelle AS type_demande, s.libelle AS statut,
            ew.libelle AS etape_courante,
            u.nom AS nom_etudiant, u.prenom AS prenom_etudiant
        FROM demandes d
        LEFT JOIN types_demande td ON d.id_type_demande = td.id_type_demande
        LEFT JOIN statuts s ON d.id_statut = s.id_statut
        LEFT JOIN etapes_workflow ew ON d.id_etape_courante = ew.id_etape
        LEFT JOIN etudiants e ON d.id_etudiant = e.id_etudiant
        LEFT JOIN utilisateurs u ON e.id_utilisateur = u.id_utilisateur
        WHERE td.libelle ILIKE ANY($1)
        ORDER BY d.date_creation DESC
        `,
        [listeLibellesType]
    );
    return result.rows;
}


async function findByProfesseur(id_professeur) {
    const result = await db.query(
        `
        SELECT
            d.id_demande, d.reference, d.objet, d.description, d.date_creation,
            d.id_etudiant, td.libelle AS type_demande, s.libelle AS statut,
            ew.libelle AS etape_courante,
            u.nom AS nom_etudiant, u.prenom AS prenom_etudiant
        FROM demandes d
        LEFT JOIN types_demande td ON d.id_type_demande = td.id_type_demande
        LEFT JOIN statuts s ON d.id_statut = s.id_statut
        LEFT JOIN etapes_workflow ew ON d.id_etape_courante = ew.id_etape
        LEFT JOIN reclamations r ON r.id_demande = d.id_demande
        LEFT JOIN etudiants e ON d.id_etudiant = e.id_etudiant
        LEFT JOIN utilisateurs u ON e.id_utilisateur = u.id_utilisateur
        WHERE r.id_professeur = $1
        ORDER BY d.date_creation DESC
        `,
        [id_professeur]
    );
    return result.rows;
}

module.exports = {
    create,
    findByEtudiant,
    findById,
    update,
    findAll,
    getTypeDemandeId,
    getStatutId,
    getEtapeId,
    findByStatutLibelle,
    findByEtapeLibelle,
    findByTypeLibelles,
    findByProfesseur
};
