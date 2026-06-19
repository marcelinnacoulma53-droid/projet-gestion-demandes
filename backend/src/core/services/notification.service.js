// ============================================================
// SERVICE NOTIFICATION (M3)
// Gère l'envoi des notifications
// ============================================================

const notificationRepo = require('../../db/repositories/notification.repo');
const userRepo = require('../../db/repositories/user.repo');

const notificationService = {
    /**
     * Notifier un utilisateur spécifique
     */
    notifierUtilisateur: async (id_utilisateur, message, id_demande) => {
        try {
            await notificationRepo.create({
                id_utilisateur,
                message,
                id_demande,
                lu: false
            });
            return { success: true };
        } catch (error) {
            console.error('Erreur notifierUtilisateur:', error);
            return { success: false };
        }
    },

    /**
     * Notifier tous les utilisateurs d'un rôle
     */
    notifierRole: async (role, message, id_demande) => {
        try {
            const utilisateurs = await userRepo.findByRole(role);
            for (const user of utilisateurs) {
                await notificationRepo.create({
                    id_utilisateur: user.id_utilisateur,
                    message,
                    id_demande,
                    lu: false
                });
            }
            return { success: true };
        } catch (error) {
            console.error('Erreur notifierRole:', error);
            return { success: false };
        }
    },

    /**
     * Récupérer les notifications d'un utilisateur
     */
    getNotificationsByUser: async (id_utilisateur) => {
        try {
            return await notificationRepo.findByUser(id_utilisateur);
        } catch (error) {
            console.error('Erreur getNotificationsByUser:', error);
            return [];
        }
    },

    /**
     * Marquer une notification comme lue
     */
    marquerCommeLu: async (id_notification, id_utilisateur) => {
        try {
            const notification = await notificationRepo.findById(id_notification);
            if (!notification || notification.id_utilisateur !== id_utilisateur) {
                throw new Error('Notification non trouvée');
            }
            return await notificationRepo.markAsLu(id_notification);
        } catch (error) {
            console.error('Erreur marquerCommeLu:', error);
            return null;
        }
    }
};

module.exports = notificationService;