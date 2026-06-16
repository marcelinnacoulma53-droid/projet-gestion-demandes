// ============================================================
// SERVICE PERMISSION (M3)
// Gère les droits d'accès
// ============================================================

const permissionService = {
    peutValider: async (id_demande, id_utilisateur, role) => {
        // TODO: Implémenter avec les règles de workflow
        // const demande = await demandeRepo.findById(id_demande);
        // const rolesAutorises = workflowRules.getRolesAutorisesPourEtape(demande.type, demande.etape_courante);
        // return rolesAutorises.includes(role);
        
        return true;
    },

    peutVoir: async (id_demande, id_utilisateur, role) => {
        // TODO: Implémenter selon les règles de visibilité
        // if (role === 'etudiant') return demande.id_etudiant === id_etudiant;
        // if (role === 'professeur') return demande.id_professeur === id_professeur;
        
        return true;
    }
};

module.exports = permissionService;