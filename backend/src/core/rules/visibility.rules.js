// ============================================================
// RÈGLES DE VISIBILITÉ (M3)
// Définit qui peut voir quoi
// ============================================================

const visibilityRules = {
    getDemandesVisibles: async (id_utilisateur, role) => {
        // TODO: Implémenter avec les repositories de M1
        // if (role === 'etudiant') {
        //     const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
        //     return await demandeRepo.findByEtudiant(etudiant.id_etudiant);
        // }
        // if (role === 'professeur') {
        //     return await demandeRepo.findByProfesseur(id_professeur);
        // }
        // return await demandeRepo.findAll();
        
        return [];
    }
};

module.exports = visibilityRules;