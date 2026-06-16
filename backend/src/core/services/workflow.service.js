// ============================================================
// SERVICE WORKFLOW (M3)
// Gère le circuit de validation des demandes
// ============================================================

const workflowRules = require('../rules/workflow.rules');

const workflowService = {
    /**
     * Avancer une demande à l'étape suivante
     */
    avancerDemande: async (id_demande, id_utilisateur, commentaire) => {
        try {
            // TODO: Implémenter avec les repositories de M1
            // const demande = await demandeRepo.findById(id_demande);
            // const nextStep = workflowRules.getNextStep(demande.type, demande.etape_courante);
            // await demandeRepo.update(id_demande, { etape_courante: nextStep });
            
            console.log(`✅ Demande ${id_demande} avancée par ${id_utilisateur}`);
            return { success: true, nextEtape: "da" };
        } catch (error) {
            console.error('Erreur avancerDemande:', error);
            throw error;
        }
    },

    /**
     * Rejeter une demande
     */
    rejeterDemande: async (id_demande, id_utilisateur, motif) => {
        try {
            // TODO: Implémenter avec les repositories de M1
            // await demandeRepo.update(id_demande, { statut: 'rejetee' });
            
            console.log(`❌ Demande ${id_demande} rejetée par ${id_utilisateur}, motif: ${motif}`);
            return { success: true };
        } catch (error) {
            console.error('Erreur rejeterDemande:', error);
            throw error;
        }
    },

    /**
     * Récupérer l'historique des traitements
     */
    getHistorique: async (id_demande) => {
        try {
            // TODO: Implémenter avec les repositories de M1
            // const traitements = await traitementRepo.findByDemande(id_demande);
            
            return [
                {
                    date_traitement: new Date().toISOString(),
                    action: "Soumission",
                    utilisateur: "Étudiant",
                    commentaire: "Demande soumise"
                }
            ];
        } catch (error) {
            console.error('Erreur getHistorique:', error);
            throw error;
        }
    }
};

module.exports = workflowService;