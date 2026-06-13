// ============================================================
// REPOSITORY DEMANDES (version temporaire)
// En attendant la version finale de Membre 1
// ============================================================

// Simulation d'une base de données en mémoire
let demandes = [
    {
        id_demande: 1,
        reference: 'DEM-001',
        objet: 'Demande d\'attestation',
        description: 'Besoin d\'une attestation pour le stage',
        statut: 'soumise',
        date_creation: new Date(),
        date_soumission: new Date(),
        id_etudiant: 1,
        id_type_demande: 1,
        id_etape_courante: null
    }
];

const demandeRepo = {
    // Créer une nouvelle demande
    create: async (demandeData) => {
        const newId = demandes.length + 1;
        const newDemande = {
            id_demande: newId,
            reference: `DEM-${String(newId).padStart(3, '0')}`,
            objet: demandeData.objet,
            description: demandeData.description || '',
            statut: demandeData.statut || 'brouillon',
            date_creation: new Date(),
            date_soumission: null,
            id_etudiant: demandeData.id_etudiant,
            id_type_demande: demandeData.type_demande === 'reclamation' ? 1 : 2,
            id_etape_courante: null
        };
        demandes.push(newDemande);
        return newDemande;
    },

    // Trouver les demandes d'un étudiant
    findByEtudiant: async (id_etudiant) => {
        return demandes.filter(d => d.id_etudiant === id_etudiant);
    },

    // Trouver une demande par son ID
    findById: async (id_demande) => {
        return demandes.find(d => d.id_demande === parseInt(id_demande)) || null;
    },

    // Mettre à jour une demande
    update: async (id_demande, updates) => {
        const index = demandes.findIndex(d => d.id_demande === parseInt(id_demande));
        if (index === -1) return null;
        
        demandes[index] = { ...demandes[index], ...updates };
        return demandes[index];
    },

    // Supprimer une demande
    delete: async (id_demande) => {
        const index = demandes.findIndex(d => d.id_demande === parseInt(id_demande));
        if (index === -1) return false;
        
        demandes.splice(index, 1);
        return true;
    }
};

module.exports = demandeRepo;