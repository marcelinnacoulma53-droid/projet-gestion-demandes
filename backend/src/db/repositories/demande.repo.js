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
        id_etape_courante,
        annee_universitaire,
        correspondant
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
            id_etape_courante,
            annee_universitaire,
            correspondant
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING
            id_demande,
            reference,
            objet,
            description,
            date_creation,
            annee_universitaire,
            correspondant
        `,
        [
            reference,
            id_etudiant,
            objet,
            description,
            id_type_demande,
            id_statut,
            id_etape_courante,
            annee_universitaire || null,
            correspondant || null
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
            d.id_demande,
            d.reference,
            d.objet,
            d.description,
            d.date_creation,
            LOWER(s.libelle) AS statut,
            LOWER(td.libelle) AS type_demande,
            LOWER(ew.libelle) AS etape_courante
        FROM demandes d
        LEFT JOIN statuts s ON d.id_statut = s.id_statut
        LEFT JOIN types_demande td ON d.id_type_demande = td.id_type_demande
        LEFT JOIN etapes_workflow ew ON d.id_etape_courante = ew.id_etape
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
            d.date_creation,
            d.date_soumission,
            d.annee_universitaire,
            d.correspondant,
            LOWER(s.libelle) AS statut,
            LOWER(td.libelle) AS type_demande,
            LOWER(ew.libelle) AS etape_courante,
            d.id_etudiant,
            d.id_statut,
            d.id_type_demande,
            d.id_etape_courante,
            r.id_professeur,
            r.id_matiere,
            r.id_semestre,
            r.description_reclamation,
            (SELECT u2.nom || ' ' || u2.prenom FROM professeurs p2 JOIN utilisateurs u2 ON p2.id_utilisateur = u2.id_utilisateur WHERE p2.id_professeur = r.id_professeur) AS enseignant,
            u.nom AS nom_etudiant,
            u.prenom AS prenom_etudiant,
            u.telephone,
            e.matricule AS ine,
            f.libelle AS filiere,
            n.libelle AS niveau,
            o.libelle AS option,
            COALESCE(sm.libelle, dp_sm.libelle, dg_sm.libelle) AS semestre,
            COALESCE(r.session, dp.session, dg.session) AS session,
            m.libelle AS matiere,
            dg.motif AS derogation_motif,
            dg.annee_academique,
            dp.id_type_document_academique,
            dp.nombre_exemplaires AS duplicata_exemplaires,
            at.id_type_attestation,
            at.nombre_exemplaires AS attestation_exemplaires,
            ta.libelle AS type_attestation_libelle,
            tda.libelle AS type_document_academique_libelle,
            ARRAY(
                SELECT mo.libelle
                FROM demande_motifs dm
                JOIN motifs mo ON dm.id_motif = mo.id_motif
                WHERE dm.id_demande = d.id_demande
            ) AS motifs
        FROM demandes d
        LEFT JOIN statuts s
            ON d.id_statut = s.id_statut
        LEFT JOIN types_demande td
            ON d.id_type_demande = td.id_type_demande
        LEFT JOIN etapes_workflow ew
            ON d.id_etape_courante = ew.id_etape
        LEFT JOIN reclamations r
            ON r.id_demande = d.id_demande
        LEFT JOIN derogations dg
            ON dg.id_demande = d.id_demande
        LEFT JOIN duplicatas dp
            ON dp.id_demande = d.id_demande
        LEFT JOIN attestations at
            ON at.id_demande = d.id_demande
        LEFT JOIN etudiants e
            ON d.id_etudiant = e.id_etudiant
        LEFT JOIN utilisateurs u
            ON e.id_utilisateur = u.id_utilisateur
        LEFT JOIN filieres f
            ON e.id_filiere = f.id_filiere
        LEFT JOIN niveaux n
            ON e.id_niveau = n.id_niveau
        LEFT JOIN options o
            ON e.id_option = o.id_option
        LEFT JOIN semestres sm
            ON r.id_semestre = sm.id_semestre
        LEFT JOIN semestres dp_sm
            ON dp.id_semestre = dp_sm.id_semestre
        LEFT JOIN semestres dg_sm
            ON dg.id_semestre = dg_sm.id_semestre
        LEFT JOIN matieres m
            ON r.id_matiere = m.id_matiere
        LEFT JOIN types_attestation ta
            ON at.id_type_attestation = ta.id_type_attestation
        LEFT JOIN types_document_academique tda
            ON dp.id_type_document_academique = tda.id_type_document_academique
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
        SELECT
            d.id_demande,
            d.reference,
            d.objet,
            d.description,
            d.date_creation,
            d.date_soumission,
            d.id_etudiant,
            d.id_type_demande,
            d.id_statut,
            d.id_etape_courante,
            LOWER(s.libelle) AS statut,
            LOWER(td.libelle) AS type_demande,
            LOWER(ew.libelle) AS etape_courante,
            u.nom AS nom_etudiant,
            u.prenom AS prenom_etudiant
        FROM demandes d
        LEFT JOIN statuts s ON d.id_statut = s.id_statut
        LEFT JOIN types_demande td ON d.id_type_demande = td.id_type_demande
        LEFT JOIN etapes_workflow ew ON d.id_etape_courante = ew.id_etape
        LEFT JOIN etudiants e ON d.id_etudiant = e.id_etudiant
        LEFT JOIN utilisateurs u ON e.id_utilisateur = u.id_utilisateur
        ORDER BY d.date_creation DESC
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

async function getDecisionId(libelleDecision) {
    const result = await db.query(
        `SELECT id_decision FROM decisions WHERE libelle ILIKE $1`,
        [libelleDecision]
    );
    return result.rows[0]?.id_decision || null;
}

async function findByStatutLibelle(libelleStatut) {
    const result = await db.query(
        `
        SELECT
            d.id_demande, d.reference, d.objet, d.description, d.date_creation,
            d.id_etudiant, LOWER(td.libelle) AS type_demande, LOWER(s.libelle) AS statut,
            LOWER(ew.libelle) AS etape_courante
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
            d.id_etudiant, LOWER(td.libelle) AS type_demande, LOWER(s.libelle) AS statut,
            LOWER(ew.libelle) AS etape_courante,
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

async function findByRoleAndEtape(role) {
    const roleFilters = {
        secretaire: { etapes: ['secretaire', 'secretaire_retour'] },
        da: { etapes: ['da', 'da_final'], types: ['reclamation', 'duplicata', 'attestation'] },
        sp: { etapes: ['sp'], types: ['derogation', 'duplicata'] },
        directrice: { etapes: ['directrice'] },
        presidence: { etapes: ['presidence'] },
        scolarite: { etapes: ['scolarite'] }
    };

    const filters = roleFilters[role];
    if (!filters) return await findAll();

    const params = [];

    let etapeCondition = '';
    if (filters.etapes && filters.etapes.length > 0) {
        etapeCondition = `LOWER(ew.libelle) = ANY($${params.length + 1})`;
        params.push(filters.etapes);
    }

    // Demandes actives à cette étape + toutes les demandes finalisées (historique)
    const whereClause = `(${etapeCondition} AND LOWER(s.libelle) NOT IN ('acceptee', 'terminee', 'rejetee'))
        OR LOWER(s.libelle) IN ('acceptee', 'terminee', 'rejetee')`;

    let finalWhere = whereClause;
    if (filters.types && filters.types.length > 0) {
        finalWhere = `(${whereClause}) AND LOWER(td.libelle) = ANY($${params.length + 1})`;
        params.push(filters.types);
    }

    const result = await db.query(`
        SELECT
            d.id_demande, d.reference, d.objet, d.description, d.date_creation, d.date_soumission,
            d.id_etudiant, LOWER(s.libelle) AS statut, LOWER(td.libelle) AS type_demande,
            LOWER(ew.libelle) AS etape_courante,
            u.nom AS nom_etudiant, u.prenom AS prenom_etudiant
        FROM demandes d
        LEFT JOIN statuts s ON d.id_statut = s.id_statut
        LEFT JOIN types_demande td ON d.id_type_demande = td.id_type_demande
        LEFT JOIN etapes_workflow ew ON d.id_etape_courante = ew.id_etape
        LEFT JOIN etudiants e ON d.id_etudiant = e.id_etudiant
        LEFT JOIN utilisateurs u ON e.id_utilisateur = u.id_utilisateur
        WHERE ${finalWhere}
        ORDER BY d.date_creation DESC
    `, params);

    return result.rows;
}

async function findByTypeLibelles(listeLibellesType) {
    const result = await db.query(
        `
        SELECT
            d.id_demande, d.reference, d.objet, d.description, d.date_creation,
            d.id_etudiant, LOWER(td.libelle) AS type_demande, LOWER(s.libelle) AS statut,
            LOWER(ew.libelle) AS etape_courante,
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
            d.id_etudiant, LOWER(td.libelle) AS type_demande, LOWER(s.libelle) AS statut,
            LOWER(ew.libelle) AS etape_courante,
            u.nom AS nom_etudiant, u.prenom AS prenom_etudiant,
            m.libelle AS matiere
        FROM demandes d
        LEFT JOIN types_demande td ON d.id_type_demande = td.id_type_demande
        LEFT JOIN statuts s ON d.id_statut = s.id_statut
        LEFT JOIN etapes_workflow ew ON d.id_etape_courante = ew.id_etape
        LEFT JOIN reclamations r ON r.id_demande = d.id_demande
        LEFT JOIN matieres m ON r.id_matiere = m.id_matiere
        LEFT JOIN etudiants e ON d.id_etudiant = e.id_etudiant
        LEFT JOIN utilisateurs u ON e.id_utilisateur = u.id_utilisateur
        WHERE r.id_professeur = $1
        ORDER BY d.date_creation DESC
        `,
        [id_professeur]
    );
    return result.rows;
}

// =======================================
// Créer un enregistrement dans reclamations
// =======================================
async function createReclamation(demandeId, data) {
    const { id_matiere, id_semestre, id_professeur, session, description_reclamation } = data;
    const result = await db.query(
        `INSERT INTO reclamations (id_demande, id_matiere, id_semestre, id_professeur, session, description_reclamation)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id_reclamation`,
        [demandeId, id_matiere || null, id_semestre || null, id_professeur || null, session || null, description_reclamation || '']
    );
    return result.rows[0];
}

// =======================================
// Créer un enregistrement dans derogations
// =======================================
async function createDerogation(demandeId, data) {
    const { motif, annee_academique, id_semestre, session } = data;
    const result = await db.query(
        `INSERT INTO derogations (id_demande, motif, annee_academique, id_semestre, session)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING id_derogation`,
        [demandeId, motif || '', annee_academique || null, id_semestre || null, session || null]
    );
    return result.rows[0];
}

// =======================================
// Créer un enregistrement dans duplicatas
// =======================================
async function createDuplicata(demandeId, data) {
    const { id_type_document_academique, nombre_exemplaires, id_semestre, session } = data;
    const result = await db.query(
        `INSERT INTO duplicatas (id_demande, id_type_document_academique, nombre_exemplaires, id_semestre, session)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING id_duplicata`,
        [demandeId, id_type_document_academique || null, nombre_exemplaires || 1, id_semestre || null, session || null]
    );
    return result.rows[0];
}

// =======================================
// Créer un enregistrement dans attestations
// =======================================
async function createAttestation(demandeId, data) {
    const { id_type_attestation, nombre_exemplaires } = data;
    const result = await db.query(
        `INSERT INTO attestations (id_demande, id_type_attestation, nombre_exemplaires)
         VALUES ($1,$2,$3)
         RETURNING id_attestation`,
        [demandeId, id_type_attestation || null, nombre_exemplaires || 1]
    );
    return result.rows[0];
}

// =======================================
// Associer des motifs à une demande
// =======================================
async function ajouterMotifs(demandeId, motifIds) {
    if (!motifIds || motifIds.length === 0) return;
    const values = motifIds.map((_, i) => `($1, $${i + 2})`).join(', ');
    await db.query(
        `INSERT INTO demande_motifs (id_demande, id_motif) VALUES ${values} ON CONFLICT DO NOTHING`,
        [demandeId, ...motifIds]
    );
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
    getDecisionId,
    findByStatutLibelle,
    findByEtapeLibelle,
    findByTypeLibelles,
    findByRoleAndEtape,
    findByProfesseur,
    createReclamation,
    createDerogation,
    createDuplicata,
    createAttestation,
    ajouterMotifs
};
