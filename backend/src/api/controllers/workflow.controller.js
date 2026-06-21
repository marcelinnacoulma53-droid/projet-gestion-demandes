// ============================================================
// CONTRÔLEUR DU WORKFLOW
// Gère les actions : valider, rejeter, voir l'historique
// ============================================================

const workflowService = require('../../core/services/workflow.service');
const permissionService = require('../../core/services/permission.service');

/**
 * VALIDER UNE DEMANDE (la faire avancer d'une étape)
 * POST /api/workflow/:id/valider
 * 
 * 
 */
const validerDemande = async (req, res, next) => {
    const demandeId = req.params.id;
    const userId = req.user.userId;
    const role = req.user.role;
    const { commentaire } = req.body;

    try {
        const peutValider = await permissionService.peutValider(demandeId, userId, role);
        if (!peutValider) {
            return res.status(403).json({
                message: 'Vous n\'êtes pas autorisé à traiter cette demande à cette étape.'
            });
        }

         const resultat = await workflowService.avancerDemande(demandeId, userId, commentaire);
         res.json({
             success: true,
             message: 'Demande validée avec succès',
             data: resultat
         });

    } catch (error) {
        next(error);
    }
};

/**
 * REJETER UNE DEMANDE
 * POST /api/workflow/:id/rejeter
 * 
 *
 */
const rejeterDemande = async (req, res, next) => {
    const demandeId = req.params.id;
    const userId = req.user.userId;
    const role = req.user.role;
    const { motif } = req.body;

    if (!motif) {
        return res.status(400).json({ message: 'Le motif du rejet est requis' });
    }

    try {
        const peutRejeter = await permissionService.peutValider(demandeId, userId, role);
        if (!peutRejeter) {
            return res.status(403).json({
                message: 'Vous n\'êtes pas autorisé à rejeter cette demande.'
            });
        }

         const resultat = await workflowService.rejeterDemande(demandeId, userId, motif);
         res.json({
             success: true,
             message: 'Demande rejetée',
             data: resultat
         });

    } catch (error) {
        next(error);
    }
};

/**
 * VOIR L'HISTORIQUE D'UNE DEMANDE
 * GET /api/workflow/:id/historique
 * 
 * 
 */
const getHistorique = async (req, res, next) => {
    const demandeId = req.params.id;

    try {
        const historique = await workflowService.getHistorique(demandeId);
        res.json({
            success: true,
            historique
        });
        

    } catch (error) {
        next(error);
    }
};

module.exports = {
    validerDemande,
    rejeterDemande,
    getHistorique
};