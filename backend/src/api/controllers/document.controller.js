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
        if (demande.id_etudiant !== userId && req.user.role === 'etudiant') {
            return res.status(403).json({ message: 'Accès non autorisé' });
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

        // Notifier l'utilisateur (M3)
        await notificationService.notifierUtilisateur(
            demande.id_etudiant,
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
        const isOwner = demande.id_etudiant === req.user.userId;
        const isStaff = ['secretaire', 'da', 'sp', 'admin'].includes(req.user.role);

        if (!isOwner && !isStaff) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Envoyer le fichier
        res.download(document.chemin_stockage, document.nom_original);

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
        const isOwner = demande.id_etudiant === userId;
        const isStaff = ['secretaire', 'da', 'admin'].includes(req.user.role);

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

module.exports = {
    upload,
    uploadFichier,
    telechargerFichier,
    supprimerFichier
};