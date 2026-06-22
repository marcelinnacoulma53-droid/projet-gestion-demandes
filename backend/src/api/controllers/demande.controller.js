// ============================================================
// CONTRÔLEUR DES DEMANDES (avec intégration M3)
// ============================================================

const demandeRepo = require('../../db/repositories/demande.repo');
const { generateReference } = require('../../utils/generateReference');
const userRepo = require('../../db/repositories/user.repo');

// ✅ IMPORT DES SERVICES DE MEMBRE 3
const permissionService = require('../../core/services/permission.service');
const visibilityRules = require('../../core/rules/visibility.rules'); 
const workflowRules = require('../../core/rules/workflow.rules');
const notificationService = require('../../core/services/notification.service');
// ============================================================
// 1. CRÉER UNE DEMANDE
// ============================================================

const db = require('../../db/connection');

const createDemande = async (req, res, next) => {
    const userId = req.user.userId;
    const {
        type_demande, objet, description, statut,
        annee_universitaire, correspondant,
        // Réclamation
        id_matiere, id_semestre, id_professeur, session,
        description_reclamation, motif_ids, motif_labels, motif_autres,
        // Dérogation
        motif,
        // Duplicata
        id_type_document_academique, nombre_exemplaires,
        // Attestation
        id_type_attestation
    } = req.body;

    if (!type_demande || !objet) {
        return res.status(400).json({ 
            message: 'Le type de demande et l\'objet sont requis' 
        });
    }

    try {
        const etudiant = await userRepo.findEtudiantByUserId(userId);
        if (!etudiant) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }

        // Résoudre le type de demande
        const typeInfo = await db.query(
            'SELECT id_type_demande FROM types_demande WHERE libelle ILIKE $1',
            [type_demande]
        );
        if (typeInfo.rows.length === 0) {
            return res.status(400).json({ message: 'Type de demande invalide : ' + type_demande });
        }
        const id_type_demande = typeInfo.rows[0].id_type_demande;

        // Statut
        const statutLibelle = (statut && statut !== 'brouillon') ? 'Soumise' : 'Brouillon';
        const statutInfo = await db.query(
            'SELECT id_statut FROM statuts WHERE libelle = $1',
            [statutLibelle]
        );
        const id_statut = statutInfo.rows[0]?.id_statut;

        const premiereEtape = workflowRules.getFirstStep(type_demande.toLowerCase());
        const id_etape_courante = await demandeRepo.getEtapeId(premiereEtape);

        // Mettre à jour le téléphone si fourni
        const telephone = req.body.telephone;
        if (telephone) {
            await db.query('UPDATE utilisateurs SET telephone = $1 WHERE id_utilisateur = $2', [telephone, userId]);
        }

        const reference = generateReference(type_demande);
        const nouvelleDemande = await demandeRepo.create({
            reference: reference,
            id_etudiant: etudiant.id_etudiant,
            id_type_demande: id_type_demande,
            objet: objet,
            description: description || '',
            id_statut: id_statut,
            id_etape_courante: id_etape_courante,
            annee_universitaire: annee_universitaire || null,
            correspondant: correspondant || null
        });

        const demandeId = nouvelleDemande.id_demande;

        // ✅ Résoudre les libellés → IDs
        const typeCle = type_demande.toLowerCase();

        if (typeCle === 'reclamation') {
            // Résoudre id_matiere (string → ID)
            let resolvedMatiere = parseInt(id_matiere, 10);
            if (isNaN(resolvedMatiere) && id_matiere && typeof id_matiere === 'string') {
                const row = await db.query(
                    'SELECT id_matiere FROM matieres WHERE libelle ILIKE $1 LIMIT 1',
                    [id_matiere]
                );
                resolvedMatiere = row.rows[0]?.id_matiere || null;
            }

            // Résoudre id_semestre (string → ID)
            let resolvedSemestre = parseInt(id_semestre, 10);
            if (isNaN(resolvedSemestre) && id_semestre && typeof id_semestre === 'string') {
                const row = await db.query(
                    'SELECT id_semestre FROM semestres WHERE libelle ILIKE $1 LIMIT 1',
                    [id_semestre]
                );
                resolvedSemestre = row.rows[0]?.id_semestre || null;
            }

            await demandeRepo.createReclamation(demandeId, {
                id_matiere: resolvedMatiere,
                id_semestre: resolvedSemestre,
                id_professeur: id_professeur || null,
                session: session || null,
                description_reclamation: description_reclamation || description || ''
            });

            // Résoudre motif_labels → motif_ids
            let resolvedMotifIds = motif_ids || [];
            if (motif_labels && motif_labels.length > 0) {
                const motifRows = await db.query(
                    'SELECT id_motif FROM motifs WHERE libelle = ANY($1)',
                    [motif_labels]
                );
                const found = motifRows.rows.map(r => r.id_motif);
                resolvedMotifIds = [...new Set([...resolvedMotifIds, ...found])];
            }

            // Inclure motif_autres dans la description
            if (motif_autres) {
                await demandeRepo.update(demandeId, {
                    description: (description || '') + '\nAutre motif : ' + motif_autres
                });
            }

            if (resolvedMotifIds.length > 0) {
                await demandeRepo.ajouterMotifs(demandeId, resolvedMotifIds);
            }

        } else if (typeCle === 'derogation') {
            await demandeRepo.createDerogation(demandeId, {
                motif: motif || description || '',
                annee_academique: annee_universitaire || null
            });

        } else if (typeCle === 'duplicata') {
            // Résoudre id_type_document_academique (string → ID)
            let resolvedDoc = parseInt(id_type_document_academique, 10);
            if (isNaN(resolvedDoc) && id_type_document_academique && typeof id_type_document_academique === 'string') {
                const row = await db.query(
                    'SELECT id_type_document_academique FROM types_document_academique WHERE libelle ILIKE $1 LIMIT 1',
                    [id_type_document_academique]
                );
                resolvedDoc = row.rows[0]?.id_type_document_academique || null;
            }

            await demandeRepo.createDuplicata(demandeId, {
                id_type_document_academique: resolvedDoc,
                nombre_exemplaires: nombre_exemplaires || 1
            });

        } else if (typeCle === 'attestation') {
            // Résoudre id_type_attestation (string → ID)
            let resolvedAtt = parseInt(id_type_attestation, 10);
            if (isNaN(resolvedAtt) && id_type_attestation && typeof id_type_attestation === 'string') {
                const row = await db.query(
                    'SELECT id_type_attestation FROM types_attestation WHERE libelle ILIKE $1 LIMIT 1',
                    [id_type_attestation]
                );
                resolvedAtt = row.rows[0]?.id_type_attestation || null;
            }

            await demandeRepo.createAttestation(demandeId, {
                id_type_attestation: resolvedAtt,
                nombre_exemplaires: nombre_exemplaires || 1
            });
        }

        // Si statut = soumise, on met à jour date_soumission
        if (statutLibelle === 'Soumise') {
            await demandeRepo.update(demandeId, { date_soumission: new Date() });
        }

        // Recharger la demande complète avec les jointures
        const demandeComplete = await demandeRepo.findById(demandeId);

        res.status(201).json({
            success: true,
            message: 'Demande créée avec succès',
            demande: demandeComplete || nouvelleDemande
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

        const id_statut_soumise = await demandeRepo.getStatutId('Soumise');

        const demandeSoumise = await demandeRepo.update(demandeId, {
            id_statut: id_statut_soumise,
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

// ============================================================
// 6. DEMANDER UN COMPLÉMENT (staff → étudiant)
// ============================================================
const demanderComplement = async (req, res, next) => {
    const demandeId = req.params.id;
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Le message est requis.' });
    }

    try {
        const demande = await demandeRepo.findById(demandeId);
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée.' });
        }

        const permission = await permissionService.peutVoir(demandeId, userId, req.user.role);
        if (!permission) {
            return res.status(403).json({ message: 'Accès refusé.' });
        }

        const id_decision = await demandeRepo.getDecisionId('A_COMPLETER');
        const id_ancienne_etape = demande.id_etape_courante
            ? await demandeRepo.getEtapeId(demande.etape_courante)
            : null;

        const traitement = await db.query(
            `INSERT INTO traitements (id_demande, id_utilisateur, id_decision, commentaire, ancienne_etape, date_traitement)
             VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [demandeId, userId, id_decision, message, id_ancienne_etape]
        );

        // Notifier l'étudiant
        const notificationMessage = `📝 Complément demandé pour votre demande ${demande.reference || '#' + demandeId} : ${message}`;
        await notificationService.notifierUtilisateur(demande.id_etudiant, notificationMessage, demandeId);

        res.json({ success: true, message: 'Demande de complément envoyée à l\'étudiant.' });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// 7. RENVOYER UN COMPLÉMENT (étudiant → staff)
// ============================================================
const renvoyerComplement = async (req, res, next) => {
    const demandeId = req.params.id;
    const userId = req.user.userId;

    try {
        const demande = await demandeRepo.findById(demandeId);
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée.' });
        }

        const id_decision = await demandeRepo.getDecisionId('COMPLEMENT_RENVOYE');

        await db.query(
            `INSERT INTO traitements (id_demande, id_utilisateur, id_decision, commentaire, date_traitement)
             VALUES ($1, $2, $3, $4, NOW())`,
            [demandeId, userId, id_decision, "Documents complémentaires ajoutés par l'étudiant."]
        );

        res.json({ success: true, message: 'Documents complémentaires envoyés.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDemande,
    getMesDemandes,
    getDemandeById,
    updateBrouillon,
    soumettreDemande,
    demanderComplement,
    renvoyerComplement
};