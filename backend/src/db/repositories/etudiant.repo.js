// ============================================================
// REPOSITORY ÉTUDIANTS (version temporaire)
// En attendant la version finale de Membre 1
// ============================================================

// Simulation d'une base de données en mémoire
let etudiants = [
    {
        id_etudiant: 1,
        id_utilisateur: 1,
        matricule: 'ADMIN001',
        id_filiere: null,
        id_niveau: null
    }
];

const etudiantRepo = {
    // Trouver un étudiant par son matricule
    findByMatricule: async (matricule) => {
        const etudiant = etudiants.find(e => e.matricule === matricule);
        return etudiant || null;
    },

    // Trouver un étudiant par son ID utilisateur
    findByIdUtilisateur: async (id_utilisateur) => {
        const etudiant = etudiants.find(e => e.id_utilisateur === id_utilisateur);
        return etudiant || null;
    },

    // Trouver tous les étudiants d'une filière
    findByFiliere: async (id_filiere) => {
        return etudiants.filter(e => e.id_filiere === id_filiere);
    },

    // Créer un nouvel étudiant
    create: async (etudiantData) => {
        const { id_utilisateur, matricule, id_filiere, id_niveau } = etudiantData;
        
        const newId = etudiants.length + 1;
        const newEtudiant = {
            id_etudiant: newId,
            id_utilisateur,
            matricule,
            id_filiere: id_filiere || null,
            id_niveau: id_niveau || null
        };
        
        etudiants.push(newEtudiant);
        
        return newEtudiant;
    },

    // Mettre à jour la filière d'un étudiant
    updateFiliere: async (id_utilisateur, id_filiere) => {
        const index = etudiants.findIndex(e => e.id_utilisateur === id_utilisateur);
        if (index === -1) return null;
        
        etudiants[index].id_filiere = id_filiere;
        return etudiants[index];
    },

    // Mettre à jour le niveau d'un étudiant
    updateNiveau: async (id_utilisateur, id_niveau) => {
        const index = etudiants.findIndex(e => e.id_utilisateur === id_utilisateur);
        if (index === -1) return null;
        
        etudiants[index].id_niveau = id_niveau;
        return etudiants[index];
    }
};

module.exports = etudiantRepo;