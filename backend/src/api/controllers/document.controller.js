// ============================================================
// CONTRÔLEUR DES DOCUMENTS (FICHIERS JOINTS)
// Gère l'upload, le téléchargement et la suppression des fichiers
// ============================================================

const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Filtre pour n'accepter que certains types de fichiers
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé'), false);
    }
};

// Configuration multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Repositories M1
const documentRepo = require('../../db/repositories/document.repo');
const demandeRepo = require('../../db/repositories/demande.repo');
const etudiantRepo = require('../../db/repositories/etudiant.repo');

// Service M3
const notificationService = require('../../core/services/notification.service');

// ============================================================
// UPLOADER UN FICHIER
// POST /api/documents/upload/:demandeId
// ============================================================
const uploadFichier = async (req, res, next) => {
    const demandeId = req.params.demandeId;
    const userId = req.user.userId;

    try {
        // Vérifier que la demande existe
        const demande = await demandeRepo.findById(demandeId);
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }

        // Vérifier que l'utilisateur a le droit d'uploader
        if (req.user.role === 'etudiant') {
            const etudiant = await etudiantRepo.findByUserId(userId);
            if (!etudiant || demande.id_etudiant !== etudiant.id_etudiant) {
                return res.status(403).json({ message: 'Accès non autorisé' });
            }
        }

        // Vérifier qu'un fichier a été envoyé
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier envoyé' });
        }

        // Enregistrer les métadonnées en base
        const document = await documentRepo.create({
            id_demande: demandeId,
            nom_fichier: req.file.filename,
            nom_original: req.file.originalname,
            type_fichier: req.file.mimetype,
            taille: req.file.size,
            chemin_stockage: req.file.path
        });

        // Notifier l'étudiant (M3) — chercher son id_utilisateur
        const notifUser = await etudiantRepo.findById(demande.id_etudiant);
        const notifUserId = notifUser ? notifUser.id_utilisateur : userId;
        await notificationService.notifierUtilisateur(
            notifUserId,
            `Un fichier a été ajouté à votre demande ${demandeId}`,
            demandeId
        );

        res.status(201).json({
            success: true,
            message: 'Fichier uploadé avec succès',
            document: {
                id: document.id_document,
                nom_original: document.nom_original,
                taille: document.taille
            }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// TÉLÉCHARGER UN FICHIER
// GET /api/documents/:documentId
// ============================================================
const telechargerFichier = async (req, res, next) => {
    const documentId = req.params.documentId;

    try {
        const document = await documentRepo.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document non trouvé' });
        }

        // Vérifier les droits d'accès
        const demande = await demandeRepo.findById(document.id_demande);
        let isOwner = false;
        if (req.user.role === 'etudiant') {
            const etudiant = await etudiantRepo.findByUserId(req.user.userId);
            isOwner = etudiant && demande.id_etudiant === etudiant.id_etudiant;
        }
        const isStaff = ['secretaire', 'da', 'sp', 'admin', 'directrice', 'presidence', 'scolarite', 'professeur', 'enseignant'].includes(req.user.role);

        if (!isOwner && !isStaff) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Envoyer le fichier
        res.download(document.chemin_stockage, document.nom_original, (err) => {
            if (err) {
                console.error('Erreur téléchargement fichier:', err);
                if (!res.headersSent) {
                    return res.status(500).json({ message: 'Fichier introuvable sur le serveur' });
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// SUPPRIMER UN FICHIER
// DELETE /api/documents/:documentId
// ============================================================
const supprimerFichier = async (req, res, next) => {
    const documentId = req.params.documentId;
    const userId = req.user.userId;

    try {
        const document = await documentRepo.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document non trouvé' });
        }

        // Vérifier les droits de suppression
        const demande = await demandeRepo.findById(document.id_demande);
        let isOwner = false;
        if (req.user.role === 'etudiant') {
            const etudiant = await etudiantRepo.findByUserId(userId);
            isOwner = etudiant && demande.id_etudiant === etudiant.id_etudiant;
        }
        const isStaff = ['secretaire', 'da', 'sp', 'admin', 'directrice', 'presidence', 'scolarite', 'professeur', 'enseignant'].includes(req.user.role);

        if (!isOwner && !isStaff) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Supprimer le fichier du disque
        if (fs.existsSync(document.chemin_stockage)) {
            fs.unlinkSync(document.chemin_stockage);
        }

        // Supprimer l'entrée en base
        await documentRepo.delete(documentId);

        res.json({
            success: true,
            message: 'Fichier supprimé avec succès'
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// LISTER LES DOCUMENTS D'UNE DEMANDE
// GET /api/documents/demande/:demandeId
// ============================================================
const getDocumentsByDemande = async (req, res, next) => {
    const demandeId = req.params.demandeId;

    try {
        const documents = await documentRepo.findByDemande(demandeId);
        res.json({
            success: true,
            documents: documents
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    upload,
    uploadFichier,
    telechargerFichier,
    supprimerFichier,
    getDocumentsByDemande
};