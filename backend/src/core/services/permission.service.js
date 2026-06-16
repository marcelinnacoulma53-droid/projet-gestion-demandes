// ============================================================
// SERVICE PERMISSION (M3)
// Gère les droits d'accès
// ============================================================

const demandeRepo = require('../../db/repositories/demande.repo');
const etudiantRepo = require('../../db/repositories/etudiant.repo');
const professeurRepo = require('../../db/repositories/professeur.repo');
const workflowRules = require('../rules/workflow.rules');

const permissionService = {
    /**
     * Vérifie si un utilisateur peut valider une demande
     */
    peutValider: async (id_demande, id_utilisateur, role) => {
        try {
            const demande = await demandeRepo.findById(id_demande);
            if (!demande) return false;
            
            const rolesAutorises = workflowRules.getRolesAutorisesPourEtape(
                demande.type_demande, 
                demande.etape_courante
            );
            
            if (!rolesAutorises.includes(role)) return false;
            
            // Vérification supplémentaire pour les professeurs
            if (role === 'professeur') {
                const professeur = await professeurRepo.findByUserId(id_utilisateur);
                return demande.id_professeur === professeur.id_professeur;
            }
            
            return true;
        } catch (error) {
            console.error('Erreur peutValider:', error);
            return false;
        }
    },

    /**
     * Vérifie si un utilisateur peut voir une demande
     */
    peutVoir: async (id_demande, id_utilisateur, role) => {
        try {
            const demande = await demandeRepo.findById(id_demande);
            if (!demande) return false;
            
            // Admin voit tout
            if (role === 'admin') return true;
            
            // Étudiant : seulement ses propres demandes
            if (role === 'etudiant') {
                const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
                return demande.id_etudiant === etudiant.id_etudiant;
            }
            
            // Professeur : seulement ses réclamations
            if (role === 'professeur') {
                const professeur = await professeurRepo.findByUserId(id_utilisateur);
                return demande.id_professeur === professeur.id_professeur;
            }
            
            // Personnel : voit tout
            return true;
        } catch (error) {
            console.error('Erreur peutVoir:', error);
            return false;
        }
    }
};

module.exports = permissionService;