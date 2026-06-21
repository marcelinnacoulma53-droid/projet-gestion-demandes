// ============================================================
// SERVICE WORKFLOW (M3)
// Gère le circuit de validation des demandes
// ============================================================

const demandeRepo = require('../../db/repositories/demande.repo');
const traitementRepo = require('../../db/repositories/traitement.repo');
const notificationService = require('./notification.service');
const workflowRules = require('../rules/workflow.rules');

const workflowService = {
    /**
     * Avancer une demande à l'étape suivante
     */
    avancerDemande: async (id_demande, id_utilisateur, commentaire) => {
        try {
            // 1. Récupérer la demande
            const demande = await demandeRepo.findById(id_demande);
            if (!demande) {
                throw new Error('Demande non trouvée');
            }
            
            // 2. Déterminer la prochaine étape
            const nextStep = workflowRules.getNextStep(demande.type_demande, demande.etape_courante);
            
            if (!nextStep) {
                // Fin du workflow
                const id_terminee = await demandeRepo.getStatutId('Terminee');
                await demandeRepo.update(id_demande, { 
                    id_statut: id_terminee
                });

                // Enregistrer le traitement final
                await traitementRepo.create({
                    id_demande,
                    id_utilisateur,
                    decision: 'VALIDE',
                    commentaire,
                    ancienne_etape: demande.etape_courante,
                    nouvelle_etape: null
                });

                // Notifier l'étudiant que sa demande est terminée
                await notificationService.notifierUtilisateur(
                    demande.id_etudiant,
                    `Votre demande ${demande.reference} a été traitée avec succès et est désormais terminée.`,
                    id_demande
                );

                return { success: true, nextEtape: null, termine: true };
            }
            
            // 3. Mettre à jour la demande
            const id_etape_suivante = await demandeRepo.getEtapeId(nextStep);
            const id_en_cours = await demandeRepo.getStatutId('En cours de traitement');
            await demandeRepo.update(id_demande, { 
                id_etape_courante: id_etape_suivante,
                id_statut: id_en_cours
            });
            
            // 4. Enregistrer le traitement
            await traitementRepo.create({
                id_demande,
                id_utilisateur,
                decision: 'VALIDE',
                commentaire,
                ancienne_etape: demande.etape_courante,
                nouvelle_etape: nextStep
            });
            
            // 5. Notifier le prochain acteur
            await notificationService.notifierRole(nextStep, 
                `Nouvelle demande ${demande.reference} à traiter`, 
                id_demande);

            // 6. Notifier l'étudiant de l'avancement
            await notificationService.notifierUtilisateur(
                demande.id_etudiant,
                `Votre demande ${demande.reference} a avancé à l'étape suivante du traitement.`,
                id_demande
            );
            
            return { success: true, nextEtape: nextStep };
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
            const demande = await demandeRepo.findById(id_demande);
            if (!demande) {
                throw new Error('Demande non trouvée');
            }
            
            // Changer le statut
            const id_rejetee = await demandeRepo.getStatutId('Rejetee');
            await demandeRepo.update(id_demande, { 
                id_statut: id_rejetee
            });
            
            // Enregistrer le traitement
            await traitementRepo.create({
                id_demande,
                id_utilisateur,
                decision: 'REJETE',
                commentaire: motif,
                ancienne_etape: demande.etape_courante,
                nouvelle_etape: null
            });
            
            // Notifier l'étudiant
            await notificationService.notifierUtilisateur(
                demande.id_etudiant,
                `Votre demande ${demande.reference} a été rejetée. Motif: ${motif}`,
                id_demande
            );
            
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
            const traitements = await traitementRepo.findByDemande(id_demande);
            return traitements;
        } catch (error) {
            console.error('Erreur getHistorique:', error);
            throw error;
        }
    }
};

module.exports = workflowService;