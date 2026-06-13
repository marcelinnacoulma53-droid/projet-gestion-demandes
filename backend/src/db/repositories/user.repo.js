// ============================================================
// REPOSITORY UTILISATEURS (version temporaire)
// En attendant la version finale de Membre 1
// ============================================================

// Simulation d'une base de données en mémoire
let utilisateurs = [
    {
        id_utilisateur: 1,
        nom: 'Admin',
        prenom: 'System',
        email: 'admin@univ.fr',
        mot_de_passe: '$2b$10$GATeUpAeGtJwZqIgHsKUtOmRUApbZrLpB16H6Gwd3kxJYbnpR5aba', // "admin123"
        actif: true,
        id_role: 1
    }
];

const userRepo = {
    // Trouver un utilisateur par son email
    findByEmail: async (email) => {
        const user = utilisateurs.find(u => u.email === email);
        return user || null;
    },

    // Trouver un utilisateur par email avec son rôle (jointure simulée)
    findByEmailWithRole: async (email) => {
        const user = utilisateurs.find(u => u.email === email);
        if (!user) return null;
        
        // Simulation de la jointure avec la table roles
        const roleMap = {
            1: 'admin',
            2: 'etudiant',
            3: 'secretaire',
            4: 'sp',
            5: 'da',
            6: 'professeur',
            7: 'directrice',
            8: 'presidence',
            9: 'scolarite'
        };
        
        return {
            ...user,
            role_libelle: roleMap[user.id_role] || 'inconnu'
        };
    },

    // Trouver un utilisateur par son ID
    findById: async (id) => {
        const user = utilisateurs.find(u => u.id_utilisateur === id);
        if (!user) return null;
        
        // On ne retourne pas le mot de passe
        const { mot_de_passe, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    // Créer un nouvel utilisateur
    create: async (userData) => {
        const { nom, prenom, email, mot_de_passe, id_role } = userData;
        
        const newId = utilisateurs.length + 1;
        const newUser = {
            id_utilisateur: newId,
            nom,
            prenom,
            email,
            mot_de_passe,
            actif: true,
            id_role: id_role || 2 // Par défaut : étudiant
        };
        
        utilisateurs.push(newUser);
        
        return {
            id_utilisateur: newId,
            nom,
            prenom,
            email
        };
    },
    // Trouver un étudiant par son ID utilisateur
    findEtudiantByUserId: async (id_utilisateur) => {
        // Simulation
        const etudiants = [
            { id_etudiant: 1, id_utilisateur: 1, matricule: '20240001' },
            { id_etudiant: 2, id_utilisateur: 2, matricule: '20240002' }
        ];
        return etudiants.find(e => e.id_utilisateur === parseInt(id_utilisateur)) || null;
    },

    // Mettre à jour un utilisateur
    update: async (id, userData) => {
        const index = utilisateurs.findIndex(u => u.id_utilisateur === id);
        if (index === -1) return null;
        
        utilisateurs[index] = { ...utilisateurs[index], ...userData };
        return utilisateurs[index];
    },

    // Supprimer un utilisateur (désactiver)
    desactiver: async (id) => {
        const index = utilisateurs.findIndex(u => u.id_utilisateur === id);
        if (index === -1) return null;
        
        utilisateurs[index].actif = false;
        return utilisateurs[index];
    }
};
module.exports = userRepo;