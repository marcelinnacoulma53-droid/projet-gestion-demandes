// ============================================================
// SERVICE DEMANDE (M3)
// Logique métier pour la gestion des demandes
// ============================================================

const demandeRepo = require('../../db/repositories/demande.repo');
const etudiantRepo = require('../../db/repositories/etudiant.repo');
const notificationService = require('./notification.service');
const workflowRules = require('../rules/workflow.rules');
const { generateReference } = require('../../utils/generateReference');

const demandeService = {
    /**
     * Créer une nouvelle demande (brouillon)
     */
    creerDemande: async (id_utilisateur, typeDemande, objet, description = '') => {
        try {
            // 1. Récupérer l'étudiant
            const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            if (!etudiant) {
                throw new Error('Étudiant non trouvé');
            }
            
            // 2. Générer une référence unique
            const reference = generateReference(typeDemande);
            
            // 3. Récupérer la première étape du workflow
            const premiereEtape = workflowRules.getFirstStep(typeDemande);
            
            // 4. Récupérer l'id_type_demande
            const typeDemandeId = await demandeRepo.getTypeDemandeId(typeDemande);
            
            // 5. Créer la demande
            const id_statut_brouillon = await demandeRepo.getStatutId('Brouillon');
            const id_etape = await demandeRepo.getEtapeId(premiereEtape);
            const nouvelleDemande = await demandeRepo.create({
                id_etudiant: etudiant.id_etudiant,
                reference: reference,
                objet: objet,
                description: description,
                id_type_demande: typeDemandeId,
                id_statut: id_statut_brouillon,
                id_etape_courante: id_etape
            });
            
            return nouvelleDemande;
        } catch (error) {
            console.error('Erreur creerDemande:', error);
            throw error;
        }
    },

    /**
     * Soumettre une demande (passer de brouillon à soumise)
     */
    soumettreDemande: async (id_demande, id_utilisateur) => {
        try {
            // 1. Récupérer la demande
            const demande = await demandeRepo.findById(id_demande);
            if (!demande) {
                throw new Error('Demande non trouvée');
            }
            
            // 2. Vérifier que l'utilisateur est le propriétaire
            const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            if (demande.id_etudiant !== etudiant.id_etudiant) {
                throw new Error('Non autorisé');
            }
            
            // 3. Vérifier que la demande est en brouillon
            if (demande.statut !== 'brouillon') {
                throw new Error('Seules les demandes en brouillon peuvent être soumises');
            }
            
            // 4. Mettre à jour la demande
            const id_soumise = await demandeRepo.getStatutId('Soumise');
            const demandeSoumise = await demandeRepo.update(id_demande, {
                id_statut: id_soumise,
                date_soumission: new Date()
            });
            
            // 5. Notifier le premier validateur
            await notificationService.notifierRole(
                demande.etape_courante,
                `Nouvelle demande ${demande.reference} à traiter`,
                id_demande
            );
            
            return demandeSoumise;
        } catch (error) {
            console.error('Erreur soumettreDemande:', error);
            throw error;
        }
    },

    /**
     * Récupérer toutes les demandes d'un étudiant
     */
    getDemandesByEtudiant: async (id_utilisateur) => {
        try {
            const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            if (!etudiant) {
                throw new Error('Étudiant non trouvé');
            }
            
            const demandes = await demandeRepo.findByEtudiant(etudiant.id_etudiant);
            return demandes;
        } catch (error) {
            console.error('Erreur getDemandesByEtudiant:', error);
            throw error;
        }
    },

    /**
     * Récupérer une demande par son ID avec vérification des droits
     */
    getDemandeById: async (id_demande, id_utilisateur, role) => {
        try {
            const demande = await demandeRepo.findById(id_demande);
            if (!demande) {
                throw new Error('Demande non trouvée');
            }
            
            // Vérifier les droits d'accès
            const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            const isOwner = demande.id_etudiant === etudiant.id_etudiant;
            const isStaff = ['secretaire', 'da', 'sp', 'admin'].includes(role);
            
            if (!isOwner && !isStaff) {
                throw new Error('Accès non autorisé');
            }
            
            return demande;
        } catch (error) {
            console.error('Erreur getDemandeById:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour un brouillon
     */
    updateBrouillon: async (id_demande, id_utilisateur, objet, description) => {
        try {
            const demande = await demandeRepo.findById(id_demande);
            if (!demande) {
                throw new Error('Demande non trouvée');
            }
            
            const etudiant = await etudiantRepo.findByUserId(id_utilisateur);
            if (demande.id_etudiant !== etudiant.id_etudiant) {
                throw new Error('Non autorisé');
            }
            
            if (demande.statut !== 'brouillon') {
                throw new Error('Seules les demandes en brouillon peuvent être modifiées');
            }
            
            const demandeMaj = await demandeRepo.update(id_demande, {
                objet: objet,
                description: description
            });
            
            return demandeMaj;
        } catch (error) {
            console.error('Erreur updateBrouillon:', error);
            throw error;
        }
    },

    /**
     * Récupérer les demandes pour le personnel (selon rôle)
     */
    getDemandesPourPersonnel: async (role, id_utilisateur) => {
        try {
            let demandes = [];
            
            switch(role) {
                case 'secretaire':
                    demandes = await demandeRepo.findByStatut('soumise');
                    break;
                case 'da':
                    demandes = await demandeRepo.findByEtape('da');
                    break;
                case 'sp':
                    demandes = await demandeRepo.findByType(['derogation', 'duplicata']);
                    break;
                default:
                    demandes = await demandeRepo.findAll();
            }
            
            return demandes;
        } catch (error) {
            console.error('Erreur getDemandesPourPersonnel:', error);
            throw error;
        }
    }
};

module.exports = demandeService;