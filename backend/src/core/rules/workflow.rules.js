// ============================================================
// RÈGLES DU WORKFLOW (M3)
// Définit le chemin de validation pour chaque type de demande
// ============================================================

const workflowRules = {
    /**
     * Détermine la prochaine étape
     */
    getNextStep: (typeDemande, etapeActuelle) => {
        const workflows = {
            reclamation: {
                'secretaire': 'da',
                'da': 'professeur',
                'professeur': 'da',
                'da_final': 'scolarite'
            },
            derogation: {
                'secretaire': 'sp',
                'sp': 'directrice',
                'directrice': 'presidence',
                'presidence': 'scolarite'
            },
            duplicata: {
                'secretaire': 'sp',
                'sp': 'da'
            },
            attestation: {
                'secretaire': 'da'
            }
        };
        
        return workflows[typeDemande]?.[etapeActuelle] || null;
    },

    /**
     * Détermine la première étape
     */
    getFirstStep: (typeDemande) => {
        const firstSteps = {
            reclamation: 'secretaire',
            derogation: 'secretaire',
            duplicata: 'secretaire',
            attestation: 'secretaire'
        };
        return firstSteps[typeDemande] || 'secretaire';
    },

    /**
     * Vérifie si une étape est valide
     */
    isEtapeValide: (typeDemande, etape) => {
        const workflows = {
            reclamation: ['secretaire', 'da', 'professeur', 'da_final', 'scolarite'],
            derogation: ['secretaire', 'sp', 'directrice', 'presidence', 'scolarite'],
            duplicata: ['secretaire', 'sp', 'da'],
            attestation: ['secretaire', 'da']
        };
        return workflows[typeDemande]?.includes(etape) || false;
    },

    /**
     * Retourne les rôles autorisés pour une étape
     */
    getRolesAutorisesPourEtape: (typeDemande, etape) => {
        const rolesMap = {
            reclamation: {
                'secretaire': ['secretaire'],
                'da': ['da'],
                'professeur': ['professeur'],
                'da_final': ['da'],
                'scolarite': ['scolarite']
            },
            derogation: {
                'secretaire': ['secretaire'],
                'sp': ['sp'],
                'directrice': ['directrice'],
                'presidence': ['presidence'],
                'scolarite': ['scolarite']
            },
            duplicata: {
                'secretaire': ['secretaire'],
                'sp': ['sp'],
                'da': ['da']
            },
            attestation: {
                'secretaire': ['secretaire'],
                'da': ['da']
            }
        };
        return rolesMap[typeDemande]?.[etape] || [];
    }
};

module.exports = workflowRules;