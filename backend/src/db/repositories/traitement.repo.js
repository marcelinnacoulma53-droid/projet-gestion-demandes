// ============================================================
// REPOSITORY TRAITEMENTS
// Gère l'historique des actions sur les demandes
// ============================================================

const pool = require('../connection');

const traitementRepo = {
    /**
     * Trouver tous les traitements d'une demande
     * @param {number} id_demande - ID de la demande
     * @returns {Array} - Liste des traitements
     */
    findByDemande: async (id_demande) => {
        const query = `
            SELECT t.*, 
                   u.nom as utilisateur_nom, 
                   u.prenom as utilisateur_prenom,
                   d.libelle as decision_libelle,
                   ae.libelle as ancienne_etape_libelle,
                   ne.libelle as nouvelle_etape_libelle
            FROM traitements t
            LEFT JOIN utilisateurs u ON t.id_utilisateur = u.id_utilisateur
            LEFT JOIN decisions d ON t.id_decision = d.id_decision
            LEFT JOIN etapes_workflow ae ON t.ancienne_etape = ae.id_etape
            LEFT JOIN etapes_workflow ne ON t.nouvelle_etape = ne.id_etape
            WHERE t.id_demande = $1
            ORDER BY t.date_traitement ASC
        `;
        const result = await pool.query(query, [id_demande]);
        return result.rows;
    },

    /**
     * Créer un nouveau traitement
     * @param {Object} data - Données du traitement
     * @param {number} data.id_demande - ID de la demande
     * @param {number} data.id_utilisateur - ID de l'utilisateur qui traite
     * @param {string} data.decision - Libellé de la décision (VALIDE, REJETE, TRANSMIS, etc.)
     * @param {string} data.commentaire - Commentaire optionnel
     * @param {number} data.ancienne_etape - ID de l'étape précédente
     * @param {number} data.nouvelle_etape - ID de la nouvelle étape
     * @returns {Object} - Le traitement créé
     */
    create: async (data) => {
        const { id_demande, id_utilisateur, decision, commentaire, ancienne_etape, nouvelle_etape } = data;
        
        const query = `
            INSERT INTO traitements (
                id_demande, 
                id_utilisateur, 
                id_decision, 
                commentaire, 
                ancienne_etape, 
                nouvelle_etape, 
                date_traitement
            )
            VALUES (
                $1, 
                $2, 
                (SELECT id_decision FROM decisions WHERE libelle = $3),
                $4, 
                $5, 
                $6, 
                NOW()
            )
            RETURNING *
        `;
        
        const result = await pool.query(query, [
            id_demande, 
            id_utilisateur, 
            decision, 
            commentaire, 
            ancienne_etape, 
            nouvelle_etape
        ]);
        
        return result.rows[0];
    },

    /**
     * Trouver un traitement par son ID
     * @param {number} id_traitement - ID du traitement
     * @returns {Object|null} - Le traitement ou null
     */
    findById: async (id_traitement) => {
        const query = `
            SELECT t.*, 
                   u.nom as utilisateur_nom, 
                   u.prenom as utilisateur_prenom,
                   d.libelle as decision_libelle
            FROM traitements t
            LEFT JOIN utilisateurs u ON t.id_utilisateur = u.id_utilisateur
            LEFT JOIN decisions d ON t.id_decision = d.id_decision
            WHERE t.id_traitement = $1
        `;
        const result = await pool.query(query, [id_traitement]);
        return result.rows[0] || null;
    },

    /**
     * Trouver tous les traitements d'un utilisateur
     * @param {number} id_utilisateur - ID de l'utilisateur
     * @returns {Array} - Liste des traitements
     */
    findByUtilisateur: async (id_utilisateur) => {
        const query = `
            SELECT t.*, 
                   d.libelle as decision_libelle,
                   de.reference as demande_reference
            FROM traitements t
            LEFT JOIN decisions d ON t.id_decision = d.id_decision
            LEFT JOIN demandes de ON t.id_demande = de.id_demande
            WHERE t.id_utilisateur = $1
            ORDER BY t.date_traitement DESC
            LIMIT 50
        `;
        const result = await pool.query(query, [id_utilisateur]);
        return result.rows;
    },

    /**
     * Récupérer le dernier traitement d'une demande
     * @param {number} id_demande - ID de la demande
     * @returns {Object|null} - Le dernier traitement ou null
     */
    findLastByDemande: async (id_demande) => {
        const query = `
            SELECT t.*, 
                   d.libelle as decision_libelle,
                   ae.libelle as ancienne_etape_libelle,
                   ne.libelle as nouvelle_etape_libelle
            FROM traitements t
            LEFT JOIN decisions d ON t.id_decision = d.id_decision
            LEFT JOIN etapes_workflow ae ON t.ancienne_etape = ae.id_etape
            LEFT JOIN etapes_workflow ne ON t.nouvelle_etape = ne.id_etape
            WHERE t.id_demande = $1
            ORDER BY t.date_traitement DESC
            LIMIT 1
        `;
        const result = await pool.query(query, [id_demande]);
        return result.rows[0] || null;
    }
};

module.exports = traitementRepo;