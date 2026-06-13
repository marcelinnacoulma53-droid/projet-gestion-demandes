// ============================================================
// CONTRÔLEUR DES NOTIFICATIONS
// Gère la logique : récupérer, lire, supprimer les notifications
// ============================================================

// ⚠️ DÉPENDANCE VERS MEMBRE 1 ⚠️
// Ce fichier a besoin des repositories suivants fournis par Membre 1 :
// - notification.repo.js (gère les notifications en base de données)
// Emplacement : backend/src/db/repositories/notification.repo.js
//
// Quand Membre 1 aura livré ce repository, décommentez la ligne ci-dessous
// const notificationRepo = require('../../db/repositories/notification.repo');
// ============================================================

// ============================================================
// VERSION TEMPORAIRE (en attendant Membre 1 et Membre 3)
// À remplacer par les vrais appels quand les services seront disponibles
// ============================================================

/**
 * RÉCUPÉRER TOUTES LES NOTIFICATIONS DE L'UTILISATEUR CONNECTÉ
 * GET /api/notifications
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 1 ⚠️
 * Remplacer par : const notifications = await notificationRepo.findByUser(userId);
 */
const getMesNotifications = async (req, res, next) => {
    const userId = req.user.userId;

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 1 LIVRE notification.repo.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // const notifications = await notificationRepo.findByUser(userId);
        // res.json({
        //     success: true,
        //     notifications
        // });
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`📬 [TEMPORAIRE] Récupération des notifications pour l'utilisateur ${userId}`);
        res.json({
            success: true,
            notifications: [
                {
                    id_notification: 1,
                    message: "Bienvenue sur l'application",
                    date_notification: new Date().toISOString(),
                    lu: false,
                    id_demande: null
                },
                {
                    id_notification: 2,
                    message: "Votre demande d'attestation a été soumise",
                    date_notification: new Date().toISOString(),
                    lu: false,
                    id_demande: 1
                }
            ]
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

/**
 * MARQUER UNE NOTIFICATION COMME LUE
 * PUT /api/notifications/:id/lu
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 1 ⚠️
 * Remplacer par : await notificationRepo.markAsLu(notificationId);
 */
const marquerCommeLu = async (req, res, next) => {
    const notificationId = req.params.id;
    const userId = req.user.userId;

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 1 LIVRE notification.repo.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // // Vérifier que la notification appartient à l'utilisateur
        // const notification = await notificationRepo.findById(notificationId);
        // if (!notification) {
        //     return res.status(404).json({ message: 'Notification non trouvée' });
        // }
        // if (notification.id_utilisateur !== userId) {
        //     return res.status(403).json({ message: 'Accès non autorisé' });
        // }
        // 
        // await notificationRepo.markAsLu(notificationId);
        // res.json({
        //     success: true,
        //     message: 'Notification marquée comme lue'
        // });
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`👁️ [TEMPORAIRE] Marquage de la notification ${notificationId} comme lue`);
        res.json({
            success: true,
            message: `Notification ${notificationId} marquée comme lue (version temporaire)`
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

/**
 * MARQUER TOUTES LES NOTIFICATIONS COMME LUES
 * PUT /api/notifications/lire-tout
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 1 ⚠️
 * Remplacer par : await notificationRepo.markAllAsLu(userId);
 */
const toutMarquerCommeLu = async (req, res, next) => {
    const userId = req.user.userId;

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 1 LIVRE notification.repo.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // await notificationRepo.markAllAsLu(userId);
        // res.json({
        //     success: true,
        //     message: 'Toutes les notifications ont été marquées comme lues'
        // });
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`📖 [TEMPORAIRE] Marquage de toutes les notifications comme lues pour l'utilisateur ${userId}`);
        res.json({
            success: true,
            message: 'Toutes les notifications marquées comme lues (version temporaire)'
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

/**
 * SUPPRIMER UNE NOTIFICATION
 * DELETE /api/notifications/:id
 * 
 * ⚠️ À REMPLACER PAR MEMBRE 1 ⚠️
 * Remplacer par : await notificationRepo.delete(notificationId);
 */
const supprimerNotification = async (req, res, next) => {
    const notificationId = req.params.id;
    const userId = req.user.userId;

    try {
        // ============================================================
        // 🔄 À REMPLACER QUAND MEMBRE 1 LIVRE notification.repo.js
        // Décommentez ce bloc et supprimez le bloc temporaire ci-dessous
        // ============================================================
        // const notification = await notificationRepo.findById(notificationId);
        // if (!notification) {
        //     return res.status(404).json({ message: 'Notification non trouvée' });
        // }
        // if (notification.id_utilisateur !== userId) {
        //     return res.status(403).json({ message: 'Accès non autorisé' });
        // }
        // 
        // await notificationRepo.delete(notificationId);
        // res.json({
        //     success: true,
        //     message: 'Notification supprimée'
        // });
        // ============================================================

        // ⚠️ BLOC TEMPORAIRE (à supprimer) ⚠️
        console.log(`🗑️ [TEMPORAIRE] Suppression de la notification ${notificationId}`);
        res.json({
            success: true,
            message: `Notification ${notificationId} supprimée (version temporaire)`
        });
        // ⚠️ FIN BLOC TEMPORAIRE ⚠️

    } catch (error) {
        next(error);
    }
};

// ============================================================
// EXPORT
// ============================================================
module.exports = {
    getMesNotifications,
    marquerCommeLu,
    toutMarquerCommeLu,
    supprimerNotification
};