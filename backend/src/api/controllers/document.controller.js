// ============================================================
// CONTRÔLEUR DES DOCUMENTS (FICHIERS JOINTS)
// Gère l'upload, le téléchargement et la suppression des fichiers
// ============================================================

// J'importe les modules nécessaires pour la gestion des fichiers
// fs : file system (pour lire, écrire, supprimer des fichiers sur le disque)
const fs = require('fs');
const path = require('path');

// multer : middleware pour traiter les fichiers uploadés
// Il sera utilisé directement dans la route, pas dans le contrôleur
const multer = require('multer');

// Configuration de multer (où stocker les fichiers, comment les nommer)
// destination : dossier où les fichiers seront sauvegardés
// filename : nom du fichier sur le serveur (timestamp + nom original)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Dossier 'uploads/' à la racine du projet backend
        const uploadDir = path.join(__dirname, '../../../uploads');
        
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nom unique : timestamp + nom original
        // Exemple : 1705300000000-monfichier.pdf
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Filtre pour n'accepter que certains types de fichiers
const fileFilter = (req, file, cb) => {
    // Extensions autorisées
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB maximum
    fileFilter: fileFilter
});

// ⚠️ DÉPENDANCE VERS MEMBRE 1 ⚠️
// Ce fichier a besoin des repositories suivants fournis par Membre 1 :
// - document.repo.js (gère les documents en base de données)
// - demande.repo.js (pour vérifier que la demande existe)
// Emplacement : backend/src/db/repositories/
//
// Quand Membre 1 aura livré ces repositories, décommentez les lignes ci-dessous
// const documentRepo = require('../../db/repositories/document.repo');
// const demandeRepo = require('../../db/repositories/demande.repo');
// ============================================================

// ⚠️ DÉPENDANCE VERS MEMBRE 3 ⚠️
// Ce fichier a besoin du service suivant fourni par Membre 3 :
// - notification.service.js (pour notifier l'upload)
// Emplacement : backend/src/core/services/notification.service.js
//
// Quand Membre 3 aura livré ce service, décommentez la ligne ci-dessous
// const notificationService = require('../../core/services/notification.service');
// ============================================================

// ============================================================
// VERSION TEMPORAIRE (en attendant Membre 1)
// À remplacer par les vrais appels quand les repositories seront disponibles
// ============================================================

/**
 * UPLOADER UN FICHIER
 * POST /api/documents/upload/:demandeId
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 1 ⚠️
 * Remplacer par :
 * - const demande = await demandeRepo.findById(demandeId);
 * - const document = await documentRepo.create({ ... });
 */
const uploadFichier = async (req, res, next) => {
    const demandeId = req.params.demandeId;
    const userId = req.user.userId;

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 1 LIVRE document.repo.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // // Vérifier que la demande existe
        // const demande = await demandeRepo.findById(demandeId);
        // if (!demande) {
        //     return res.status(404).json({ message: 'Demande non trouvée' });
        // }
        // 
        // // Vérifier que l'utilisateur a le droit d'uploader pour cette demande
        // if (demande.id_etudiant !== userId && req.user.role === 'etudiant') {
        //     return res.status(403).json({ message: 'Accès non autorisé' });
        // }
        // 
        // // Vérifier qu'un fichier a été envoyé
        // if (!req.file) {
        //     return res.status(400).json({ message: 'Aucun fichier envoyé' });
        // }
        // 
        // // Enregistrer les métadonnées en base
        // const document = await documentRepo.create({
        //     id_demande: demandeId,
        //     nom_fichier: req.file.filename,
        //     nom_original: req.file.originalname,
        //     type_fichier: req.file.mimetype,
        //     taille: req.file.size,
        //     chemin_stockage: req.file.path
        // });
        // 
        // // Notifier l'utilisateur (optionnel)
        // await notificationService.notifierUtilisateur(
        //     demande.id_etudiant,
        //     `Un fichier a été ajouté à votre demande ${demandeId}`,
        //     demandeId
        // );
        // 
        // res.status(201).json({
        //     success: true,
        //     message: 'Fichier uploadé avec succès',
        //     document: {
        //         id: document.id_document,
        //         nom_original: document.nom_original,
        //         taille: document.taille
        //     }
        // });
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`📤 [TEMPORAIRE] Upload fichier pour demande ${demandeId} par utilisateur ${userId}`);
        
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier envoyé' });
        }
        
        console.log(`   Fichier reçu : ${req.file.originalname} (${req.file.size} bytes)`);
        
        res.status(201).json({
            success: true,
            message: '📎 Fichier uploadé avec succès (version temporaire)',
            fichier: {
                nom_original: req.file.originalname,
                taille: req.file.size,
                type: req.file.mimetype
            }
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

/**
 * TÉLÉCHARGER UN FICHIER
 * GET /api/documents/:documentId
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 1 ⚠️
 * Remplacer par : const document = await documentRepo.findById(documentId);
 */
const telechargerFichier = async (req, res, next) => {
    const documentId = req.params.documentId;

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 1 LIVRE document.repo.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // const document = await documentRepo.findById(documentId);
        // if (!document) {
        //     return res.status(404).json({ message: 'Document non trouvé' });
        // }
        // 
        // // Vérifier les droits d'accès (l'utilisateur peut-il voir ce fichier ?)
        // const demande = await demandeRepo.findById(document.id_demande);
        // const isOwner = demande.id_etudiant === req.user.userId;
        // const isStaff = ['secretaire', 'da', 'sp', 'admin'].includes(req.user.role);
        // 
        // if (!isOwner && !isStaff) {
        //     return res.status(403).json({ message: 'Accès non autorisé' });
        // }
        // 
        // // Envoyer le fichier
        // res.download(document.chemin_stockage, document.nom_original);
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`📥 [TEMPORAIRE] Téléchargement du document ${documentId}`);
        res.json({
            success: true,
            message: `📁 Téléchargement du document ${documentId} (version temporaire)`,
            note: "Le vrai téléchargement sera disponible quand Membre 1 aura livré document.repo.js"
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

/**
 * SUPPRIMER UN FICHIER
 * DELETE /api/documents/:documentId
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 1 ⚠️
 * Remplacer par :
 * - const document = await documentRepo.findById(documentId);
 * - fs.unlinkSync(document.chemin_stockage);
 * - await documentRepo.delete(documentId);
 */
const supprimerFichier = async (req, res, next) => {
    const documentId = req.params.documentId;
    const userId = req.user.userId;

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 1 LIVRE document.repo.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // const document = await documentRepo.findById(documentId);
        // if (!document) {
        //     return res.status(404).json({ message: 'Document non trouvé' });
        // }
        // 
        // // Vérifier les droits de suppression
        // const demande = await demandeRepo.findById(document.id_demande);
        // const isOwner = demande.id_etudiant === userId;
        // const isStaff = ['secretaire', 'da', 'admin'].includes(req.user.role);
        // 
        // if (!isOwner && !isStaff) {
        //     return res.status(403).json({ message: 'Accès non autorisé' });
        // }
        // 
        // // Supprimer le fichier du disque
        // if (fs.existsSync(document.chemin_stockage)) {
        //     fs.unlinkSync(document.chemin_stockage);
        // }
        // 
        // // Supprimer l'entrée en base
        // await documentRepo.delete(documentId);
        // 
        // res.json({
        //     success: true,
        //     message: 'Fichier supprimé avec succès'
        // });
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`🗑️ [TEMPORAIRE] Suppression du document ${documentId} par utilisateur ${userId}`);
        res.json({
            success: true,
            message: `🗑️ Document ${documentId} supprimé (version temporaire)`
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

// Export du middleware upload pour l'utiliser dans les routes
// Note : upload.single('fichier') sera utilisé directement dans routes
module.exports = {
    upload,              // ← Export du middleware multer
    uploadFichier,       // ← Le contrôleur
    telechargerFichier,
    supprimerFichier
};