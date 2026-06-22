// ============================================================
// RÈGLES DE VISIBILITÉ (M3)
// Définit qui peut voir quoi
// ============================================================

const demandeRepo = require('../../db/repositories/demande.repo');
const etudiantRepo = require('../../db/repositories/etudiant.repo');
const professeurRepo = require('../../db/repositories/professeur.repo');

const visibilityRules = {
    /**
     * Récupère les demandes visibles par un utilisateur
     */
    getDemandesVisibles: async (id_utilisateur, role) => {
        try {
            // Admin voit tout
            if (role === 'admin' || role === 'administrateur') {
                return await demandeRepo.findAll();
            }
            
            // Étudiant : seulement ses propres demandes
            if (role === 'etudiant') {
                const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
                if (!etudiant) return [];
                return await demandeRepo.findByEtudiant(etudiant.id_etudiant);
            }
            
            // Professeur : seulement les réclamations qui le concernent
            if (role === 'professeur') {
                const professeur = await professeurRepo.findByUserId(id_utilisateur);
                if (!professeur) return [];
                return await demandeRepo.findByProfesseur(professeur.id_professeur);
            }
            
            // SP, DA, secrétaire, directrice, présidence, scolarité : filtré par étape
            return await demandeRepo.findByRoleAndEtape(role);
        } catch (error) {
            console.error('Erreur getDemandesVisibles:', error);
            return [];
        }
    }
};

module.exports = visibilityRules;