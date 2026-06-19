// ============================================================
// CONTRÔLEUR DES NOTIFICATIONS
// Gère la logique : récupérer, lire, supprimer les notifications
// ============================================================

// ✅ REPOSITORY MEMBRE 1 - notification.repo.js
const notificationRepo = require('../../db/repositories/notification.repo');

// ============================================================
// RÉCUPÉRER TOUTES LES NOTIFICATIONS DE L'UTILISATEUR CONNECTÉ
// GET /api/notifications
// ============================================================
const getMesNotifications = async (req, res, next) => {
    const userId = req.user.userId;

    try {
        // ✅ Appel au repository de M1
        const notifications = await notificationRepo.findByUser(userId);
        
        res.json({
            success: true,
            notifications
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// MARQUER UNE NOTIFICATION COMME LUE
// PUT /api/notifications/:id/lu
// ============================================================
const marquerCommeLu = async (req, res, next) => {
    const notificationId = req.params.id;
    const userId = req.user.userId;

    try {
        // ✅ Vérifier que la notification existe
        const notification = await notificationRepo.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }

        // ✅ Vérifier que la notification appartient à l'utilisateur
        if (notification.id_utilisateur !== userId) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // ✅ Marquer comme lue
        await notificationRepo.markAsLu(notificationId);

        res.json({
            success: true,
            message: 'Notification marquée comme lue'
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// MARQUER TOUTES LES NOTIFICATIONS COMME LUES
// PUT /api/notifications/lire-tout
// ============================================================
const toutMarquerCommeLu = async (req, res, next) => {
    const userId = req.user.userId;

    try {
        // ✅ Appel au repository de M1
        await notificationRepo.markAllAsLu(userId);

        res.json({
            success: true,
            message: 'Toutes les notifications ont été marquées comme lues'
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// SUPPRIMER UNE NOTIFICATION
// DELETE /api/notifications/:id
// ============================================================
const supprimerNotification = async (req, res, next) => {
    const notificationId = req.params.id;
    const userId = req.user.userId;

    try {
        // ✅ Vérifier que la notification existe
        const notification = await notificationRepo.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }

        // ✅ Vérifier que la notification appartient à l'utilisateur
        if (notification.id_utilisateur !== userId) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // ✅ Supprimer la notification
        await notificationRepo.delete(notificationId);

        res.json({
            success: true,
            message: 'Notification supprimée avec succès'
        });

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