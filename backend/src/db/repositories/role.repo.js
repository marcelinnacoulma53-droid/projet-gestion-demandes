// ============================================================
// REPOSITORY RÔLES (version temporaire)
// En attendant la version finale de Membre 1
// ============================================================

// Simulation de la table roles
const roles = [
    { id_role: 1, libelle: 'admin' },
    { id_role: 2, libelle: 'etudiant' },
    { id_role: 3, libelle: 'secretaire' },
    { id_role: 4, libelle: 'sp' },
    { id_role: 5, libelle: 'da' },
    { id_role: 6, libelle: 'professeur' },
    { id_role: 7, libelle: 'directrice' },
    { id_role: 8, libelle: 'presidence' },
    { id_role: 9, libelle: 'scolarite' }
];

const roleRepo = {
    // Trouver un rôle par son libellé
    findByLibelle: async (libelle) => {
        const role = roles.find(r => r.libelle === libelle);
        return role || null;
    },

    // Trouver un rôle par son ID
    findById: async (id_role) => {
        const role = roles.find(r => r.id_role === id_role);
        return role || null;
    },

    // Récupérer tous les rôles
    findAll: async () => {
        return [...roles];
    },

    // Récupérer les rôles d'un type spécifique
    findByType: async (type) => {
        // type peut être 'etudiant', 'professeur', 'personnel'
        const mapping = {
            'etudiant': ['etudiant'],
            'professeur': ['professeur'],
            'personnel': ['admin', 'secretaire', 'sp', 'da', 'directrice', 'presidence', 'scolarite']
        };
        
        const libelles = mapping[type] || [];
        return roles.filter(r => libelles.includes(r.libelle));
    }
};

module.exports = roleRepo;