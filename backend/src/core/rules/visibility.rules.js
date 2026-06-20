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
                return await demandeRepo.findByEtudiant(etudiant.id_etudiant);
            }
            
            // Professeur : seulement les réclamations qui le concernent
            if (role === 'professeur') {
                const professeur = await professeurRepo.findByUserId(id_utilisateur);
                return await demandeRepo.findByProfesseur(professeur.id_professeur);
            }
            
            // SP : seulement dérogations et duplicatas
            if (role === 'sp') {
                return await demandeRepo.findByTypeLibelles(['Derogation', 'Duplicata']);
            }
            
            // DA : réclamations, duplicatas, attestations
            if (role === 'da') {
                return await demandeRepo.findByTypeLibelles(['Reclamation', 'Duplicata', 'Attestation']);
            }
            
            // Secrétaire, directrice, présidence, scolarité : voir tout
            return await demandeRepo.findAll();
        } catch (error) {
            console.error('Erreur getDemandesVisibles:', error);
            return [];
        }
    }
};

module.exports = visibilityRules;