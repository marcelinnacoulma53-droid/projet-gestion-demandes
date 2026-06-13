// ============================================================
// CONTRÔLEUR DU WORKFLOW
// Gère les actions : valider, rejeter, voir l'historique
// ============================================================

// ⚠️ DÉPENDANCE VERS MEMBRE 3 ⚠️
// Ce fichier a besoin du service suivant fourni par Membre 3 :
// - workflow.service.js (avec les fonctions avancerDemande, rejeterDemande, getHistorique)
// Emplacement : backend/src/core/services/workflow.service.js
//
// Quand Membre 3 aura livré ce service, décommentez la ligne ci-dessous
// et supprimez les fonctions temporaires
//
// const workflowService = require('../../core/services/workflow.service');
// ============================================================

// ============================================================
// VERSION TEMPORAIRE (en attendant Membre 3)
// À remplacer par les vrais appels quand workflow.service.js sera disponible
// ============================================================

/**
 * VALIDER UNE DEMANDE (la faire avancer d'une étape)
 * POST /api/workflow/:id/valider
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 3 ⚠️
 * Remplacer par : const resultat = await workflowService.avancerDemande(demandeId, userId, commentaire);
 */
const validerDemande = async (req, res, next) => {
    const demandeId = req.params.id;
    const userId = req.user.userId;
    const { commentaire } = req.body;

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 3 LIVRE workflow.service.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // const resultat = await workflowService.avancerDemande(demandeId, userId, commentaire);
        // res.json({
        //     success: true,
        //     message: 'Demande validée avec succès',
        //     data: resultat
        // });
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`🔁 [TEMPORAIRE] Validation demande ${demandeId} par utilisateur ${userId}`);
        res.json({
            success: true,
            message: '✅ Demande validée (version temporaire - en attendant Membre 3)',
            data: { demandeId, userId, commentaire: commentaire || null }
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

/**
 * REJETER UNE DEMANDE
 * POST /api/workflow/:id/rejeter
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 3 ⚠️
 * Remplacer par : const resultat = await workflowService.rejeterDemande(demandeId, userId, motif);
 */
const rejeterDemande = async (req, res, next) => {
    const demandeId = req.params.id;
    const userId = req.user.userId;
    const { motif } = req.body;

    if (!motif) {
        return res.status(400).json({ message: 'Le motif du rejet est requis' });
    }

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 3 LIVRE workflow.service.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // const resultat = await workflowService.rejeterDemande(demandeId, userId, motif);
        // res.json({
        //     success: true,
        //     message: 'Demande rejetée',
        //     data: resultat
        // });
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`❌ [TEMPORAIRE] Rejet demande ${demandeId} par utilisateur ${userId}, motif: ${motif}`);
        res.json({
            success: true,
            message: '❌ Demande rejetée (version temporaire - en attendant Membre 3)',
            data: { demandeId, userId, motif }
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

/**
 * VOIR L'HISTORIQUE D'UNE DEMANDE
 * GET /api/workflow/:id/historique
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 3 ⚠️
 * Remplacer par : const historique = await workflowService.getHistorique(demandeId);
 */
const getHistorique = async (req, res, next) => {
    const demandeId = req.params.id;

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 3 LIVRE workflow.service.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // const historique = await workflowService.getHistorique(demandeId);
        // res.json({
        //     success: true,
        //     historique
        // });
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`📜 [TEMPORAIRE] Consultation historique demande ${demandeId}`);
        res.json({
            success: true,
            historique: [
                {
                    date_traitement: new Date().toISOString(),
                    action: "Soumission",
                    utilisateur: "Étudiant",
                    commentaire: "Demande soumise"
                },
                {
                    date_traitement: new Date().toISOString(),
                    action: "En attente",
                    utilisateur: "Secrétariat",
                    commentaire: "En cours de traitement"
                }
            ]
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

module.exports = {
    validerDemande,
    rejeterDemande,
    getHistorique
};