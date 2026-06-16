// ============================================================
// SERVICE NOTIFICATION (M3)
// Gère l'envoi des notifications
// ============================================================

const notificationService = {
    notifierUtilisateur: async (id_utilisateur, message, id_demande) => {
        console.log(`📧 Notification à l'utilisateur ${id_utilisateur}: ${message}`);
        return { success: true };
    },

    notifierRole: async (role, message, id_demande) => {
        console.log(`📧 Notification au rôle ${role}: ${message}`);
        return { success: true };
    }
};

module.exports = notificationService;