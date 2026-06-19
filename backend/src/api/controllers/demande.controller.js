// ============================================================
// CONTRÔLEUR DES DEMANDES (avec intégration M3)
// ============================================================

const demandeRepo = require('../../db/repositories/demande.repo');
const { generateReference } = require('../../utils/generateReference');
const userRepo = require('../../db/repositories/user.repo');

// ✅ IMPORT DES SERVICES DE MEMBRE 3
const permissionService = require('../../core/services/permission.service');
const visibilityRules = require('../../core/rules/visibility.rules');

// ============================================================
// 1. CRÉER UNE DEMANDE
// ============================================================
const createDemande = async (req, res, next) => {
    const userId = req.user.userId;
    const { type_demande, objet, description } = req.body;

    if (!type_demande || !objet) {
        return res.status(400).json({ 
            message: 'Le type de demande et l\'objet sont requis' 
        });
    }

    try {
        const etudiant = await userRepo.findEtudiantByUserId(userId);
        
        if (!etudiant) {
            return res.status(404).json({ 
                message: 'Étudiant non trouvé' 
            });
        }

        const reference = generateReference(type_demande);
        const nouvelleDemande = await demandeRepo.create({
            reference: reference,
            id_etudiant: etudiant.id_etudiant,
            type_demande: type_demande,
            objet: objet,
            description: description || '',
            statut: 'brouillon'
        });

        res.status(201).json({
            success: true,
            message: 'Demande créée avec succès',
            demande: nouvelleDemande
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// 2. RÉCUPÉRER LES DEMANDES VISIBLES (amélioré)
// ============================================================
const getMesDemandes = async (req, res, next) => {
    const userId = req.user.userId;
    const role = req.user.role;

    try {
        // ✅ Utilisation des règles de visibilité de M3
        const demandes = await visibilityRules.getDemandesVisibles(userId, role);

        res.json({
            success: true,
            demandes: demandes
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// 3. RÉCUPÉRER UNE DEMANDE PAR ID (amélioré)
// ============================================================
const getDemandeById = async (req, res, next) => {
    const demandeId = req.params.id;
    const userId = req.user.userId;
    const role = req.user.role;

    try {
        const demande = await demandeRepo.findById(demandeId);

        if (!demande) {
            return res.status(404).json({ 
                message: 'Demande non trouvée' 
            });
        }

        // ✅ Utilisation du service de permission de M3
        const peutVoir = await permissionService.peutVoir(demandeId, userId, role);
        
        if (!peutVoir) {
            return res.status(403).json({ 
                message: 'Vous n\'avez pas accès à cette demande' 
            });
        }

        res.json({
            success: true,
            demande: demande
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// 4. MODIFIER UN BROUILLON
// ============================================================
const updateBrouillon = async (req, res, next) => {
    const demandeId = req.params.id;
    const userId = req.user.userId;
    const { objet, description } = req.body;

    try {
        const etudiant = await userRepo.findEtudiantByUserId(userId);
        
        if (!etudiant) {
            return res.status(404).json({ 
                message: 'Étudiant non trouvé' 
            });
        }

        const demande = await demandeRepo.findById(demandeId);

        if (!demande) {
            return res.status(404).json({ 
                message: 'Demande non trouvée' 
            });
        }

        // ✅ Vérification que la demande appartient bien à l'étudiant
        if (demande.id_etudiant !== etudiant.id_etudiant) {
            return res.status(403).json({ 
                message: 'Vous n\'avez pas accès à cette demande' 
            });
        }

        if (demande.statut !== 'brouillon') {
            return res.status(400).json({ 
                message: 'Seules les demandes en brouillon peuvent être modifiées' 
            });
        }

        const demandeMaj = await demandeRepo.update(demandeId, {
            objet: objet || demande.objet,
            description: description || demande.description
        });

        res.json({
            success: true,
            message: 'Brouillon mis à jour',
            demande: demandeMaj
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// 5. SOUMETTRE UNE DEMANDE
// ============================================================
const soumettreDemande = async (req, res, next) => {
    const demandeId = req.params.id;
    const userId = req.user.userId;

    try {
        const etudiant = await userRepo.findEtudiantByUserId(userId);
        
        if (!etudiant) {
            return res.status(404).json({ 
                message: 'Étudiant non trouvé' 
            });
        }

        const demande = await demandeRepo.findById(demandeId);

        if (!demande) {
            return res.status(404).json({ 
                message: 'Demande non trouvée' 
            });
        }

        // ✅ Vérification que la demande appartient bien à l'étudiant
        if (demande.id_etudiant !== etudiant.id_etudiant) {
            return res.status(403).json({ 
                message: 'Vous n\'avez pas accès à cette demande' 
            });
        }

        if (demande.statut !== 'brouillon') {
            return res.status(400).json({ 
                message: 'Seules les demandes en brouillon peuvent être soumises' 
            });
        }

        const demandeSoumise = await demandeRepo.update(demandeId, {
            statut: 'soumise',
            date_soumission: new Date()
        });

        res.json({
            success: true,
            message: 'Demande soumise avec succès',
            demande: demandeSoumise
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDemande,
    getMesDemandes,
    getDemandeById,
    updateBrouillon,
    soumettreDemande
};