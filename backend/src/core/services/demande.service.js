// ============================================================
// SERVICE DEMANDE (M3)
// Logique métier pour la gestion des demandes
// ============================================================

// Dépendances (seront décommentées quand les repositories de M1 seront prêts)
// const demandeRepo = require('../../db/repositories/demande.repo');
// const etudiantRepo = require('../../db/repositories/etudiant.repo');
// const notificationService = require('./notification.service');
// const workflowRules = require('../rules/workflow.rules');
// const { generateReference } = require('../../utils/generateReference');

const demandeService = {
    /**
     * Créer une nouvelle demande (brouillon)
     * @param {number} id_utilisateur - ID de l'utilisateur connecté
     * @param {string} typeDemande - Type de demande (reclamation, derogation, duplicata, attestation)
     * @param {string} objet - Objet de la demande
     * @param {string} description - Description (optionnel)
     * @returns {Object} - La demande créée
     */
    creerDemande: async (id_utilisateur, typeDemande, objet, description = '') => {
        try {
            // TODO: Décommenter quand M1 est prêt
            // // 1. Récupérer l'étudiant
            // const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            // if (!etudiant) {
            //     throw new Error('Étudiant non trouvé');
            // }
            // 
            // // 2. Générer une référence unique
            // const reference = generateReference(typeDemande);
            // 
            // // 3. Récupérer la première étape du workflow
            // const premiereEtape = workflowRules.getFirstStep(typeDemande);
            // 
            // // 4. Créer la demande
            // const nouvelleDemande = await demandeRepo.create({
            //     id_etudiant: etudiant.id_etudiant,
            //     reference: reference,
            //     objet: objet,
            //     description: description,
            //     type_demande: typeDemande,
            //     statut: 'brouillon',
            //     etape_courante: premiereEtape
            // });
            // 
            // return nouvelleDemande;

            // Simulation (à remplacer)
            console.log(`📝 Création demande pour utilisateur ${id_utilisateur}, type: ${typeDemande}`);
            return {
                id_demande: 1,
                reference: `DEM-${Date.now()}`,
                objet: objet,
                description: description,
                statut: 'brouillon',
                date_creation: new Date().toISOString()
            };
        } catch (error) {
            console.error('Erreur creerDemande:', error);
            throw error;
        }
    },

    /**
     * Soumettre une demande (la faire passer de brouillon à soumise)
     * @param {number} id_demande - ID de la demande
     * @param {number} id_utilisateur - ID de l'utilisateur connecté
     * @returns {Object} - La demande soumise
     */
    soumettreDemande: async (id_demande, id_utilisateur) => {
        try {
            // TODO: Décommenter quand M1 est prêt
            // // 1. Récupérer la demande
            // const demande = await demandeRepo.findById(id_demande);
            // if (!demande) {
            //     throw new Error('Demande non trouvée');
            // }
            // 
            // // 2. Vérifier que l'utilisateur est le propriétaire
            // const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            // if (demande.id_etudiant !== etudiant.id_etudiant) {
            //     throw new Error('Non autorisé');
            // }
            // 
            // // 3. Vérifier que la demande est en brouillon
            // if (demande.statut !== 'brouillon') {
            //     throw new Error('Seules les demandes en brouillon peuvent être soumises');
            // }
            // 
            // // 4. Mettre à jour la demande
            // const demandeSoumise = await demandeRepo.update(id_demande, {
            //     statut: 'soumise',
            //     date_soumission: new Date()
            // });
            // 
            // // 5. Notifier le premier validateur
            // await notificationService.notifierRole(
            //     demande.etape_courante,
            //     `Nouvelle demande ${demande.reference} à traiter`,
            //     id_demande
            // );
            // 
            // return demandeSoumise;

            // Simulation (à remplacer)
            console.log(`📤 Soumission demande ${id_demande} par utilisateur ${id_utilisateur}`);
            return {
                id_demande: id_demande,
                statut: 'soumise',
                date_soumission: new Date().toISOString()
            };
        } catch (error) {
            console.error('Erreur soumettreDemande:', error);
            throw error;
        }
    },

    /**
     * Récupérer toutes les demandes d'un étudiant
     * @param {number} id_utilisateur - ID de l'utilisateur connecté
     * @returns {Array} - Liste des demandes
     */
    getDemandesByEtudiant: async (id_utilisateur) => {
        try {
            // TODO: Décommenter quand M1 est prêt
            // const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            // if (!etudiant) {
            //     throw new Error('Étudiant non trouvé');
            // }
            // 
            // const demandes = await demandeRepo.findByEtudiant(etudiant.id_etudiant);
            // return demandes;

            // Simulation (à remplacer)
            console.log(`📋 Récupération demandes pour utilisateur ${id_utilisateur}`);
            return [];
        } catch (error) {
            console.error('Erreur getDemandesByEtudiant:', error);
            throw error;
        }
    },

    /**
     * Récupérer une demande par son ID avec vérification des droits
     * @param {number} id_demande - ID de la demande
     * @param {number} id_utilisateur - ID de l'utilisateur connecté
     * @param {string} role - Rôle de l'utilisateur
     * @returns {Object} - La demande
     */
    getDemandeById: async (id_demande, id_utilisateur, role) => {
        try {
            // TODO: Décommenter quand M1 est prêt
            // const demande = await demandeRepo.findById(id_demande);
            // if (!demande) {
            //     throw new Error('Demande non trouvée');
            // }
            // 
            // // Vérifier les droits d'accès
            // const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            // const isOwner = demande.id_etudiant === etudiant.id_etudiant;
            // const isStaff = ['secretaire', 'da', 'sp', 'admin'].includes(role);
            // 
            // if (!isOwner && !isStaff) {
            //     throw new Error('Accès non autorisé');
            // }
            // 
            // return demande;

            // Simulation (à remplacer)
            console.log(`🔍 Récupération demande ${id_demande} par utilisateur ${id_utilisateur} (${role})`);
            return {
                id_demande: id_demande,
                objet: "Demande exemple",
                statut: "brouillon"
            };
        } catch (error) {
            console.error('Erreur getDemandeById:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour un brouillon
     * @param {number} id_demande - ID de la demande
     * @param {number} id_utilisateur - ID de l'utilisateur connecté
     * @param {string} objet - Nouvel objet
     * @param {string} description - Nouvelle description
     * @returns {Object} - La demande mise à jour
     */
    updateBrouillon: async (id_demande, id_utilisateur, objet, description) => {
        try {
            // TODO: Décommenter quand M1 est prêt
            // const demande = await demandeRepo.findById(id_demande);
            // if (!demande) {
            //     throw new Error('Demande non trouvée');
            // }
            // 
            // const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            // if (demande.id_etudiant !== etudiant.id_etudiant) {
            //     throw new Error('Non autorisé');
            // }
            // 
            // if (demande.statut !== 'brouillon') {
            //     throw new Error('Seules les demandes en brouillon peuvent être modifiées');
            // }
            // 
            // const demandeMaj = await demandeRepo.update(id_demande, {
            //     objet: objet,
            //     description: description
            // });
            // 
            // return demandeMaj;

            // Simulation (à remplacer)
            console.log(`✏️ Mise à jour brouillon ${id_demande} par utilisateur ${id_utilisateur}`);
            return {
                id_demande: id_demande,
                objet: objet,
                description: description,
                statut: 'brouillon'
            };
        } catch (error) {
            console.error('Erreur updateBrouillon:', error);
            throw error;
        }
    },

    /**
     * Récupérer les demandes pour le personnel (selon rôle)
     * @param {string} role - Rôle de l'utilisateur
     * @param {number} id_utilisateur - ID de l'utilisateur
     * @returns {Array} - Liste des demandes à traiter
     */
    getDemandesPourPersonnel: async (role, id_utilisateur) => {
        try {
            // TODO: Décommenter quand M1 est prêt
            // let demandes = [];
            // 
            // switch(role) {
            //     case 'secretaire':
            //         demandes = await demandeRepo.findByStatut('soumise');
            //         break;
            //     case 'da':
            //         demandes = await demandeRepo.findByEtape('da');
            //         break;
            //     case 'professeur':
            //         const professeur = await professeurRepo.findByUserId(id_utilisateur);
            //         demandes = await demandeRepo.findByProfesseur(professeur.id_professeur);
            //         break;
            //     default:
            //         demandes = [];
            // }
            // 
            // return demandes;

            // Simulation (à remplacer)
            console.log(`📋 Récupération demandes pour rôle ${role}`);
            return [];
        } catch (error) {
            console.error('Erreur getDemandesPourPersonnel:', error);
            throw error;
        }
    }
};

module.exports = demandeService;