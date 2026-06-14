const db = require('../connection');


// =======================================
// Trouver les notifications d'un utilisateur
// =======================================
async function findByUser(id_utilisateur) {

    const result = await db.query(
        `
        SELECT
            id_notification,
            message,
            date_notification,
            lu,
            id_demande
        FROM notifications
        WHERE id_utilisateur = $1
        ORDER BY date_notification DESC
        `,
        [id_utilisateur]
    );


    return result.rows;
}



// =======================================
// Trouver une notification par ID
// =======================================
async function findById(id_notification) {

    const result = await db.query(
        `
        SELECT
            id_notification,
            id_utilisateur,
            message,
            lu
        FROM notifications
        WHERE id_notification = $1
        `,
        [id_notification]
    );


    return result.rows[0] || null;
}



// =======================================
// Créer une notification
// =======================================
async function create(notificationData) {

    const {
        id_utilisateur,
        message,
        id_demande
    } = notificationData;


    const result = await db.query(
        `
        INSERT INTO notifications
        (
            id_utilisateur,
            message,
            id_demande
        )
        VALUES ($1,$2,$3)
        RETURNING
            id_notification,
            message
        `,
        [
            id_utilisateur,
            message,
            id_demande
        ]
    );


    return result.rows[0];
}



// =======================================
// Marquer une notification comme lue
// =======================================
async function markAsLu(id_notification) {

    const result = await db.query(
        `
        UPDATE notifications
        SET lu = true
        WHERE id_notification = $1
        RETURNING id_notification
        `,
        [id_notification]
    );


    if (result.rowCount === 0) {
        return null;
    }


    return {
        success: true
    };
}



// =======================================
// Marquer toutes les notifications d'un utilisateur
// comme lues
// =======================================
async function markAllAsLu(id_utilisateur) {

    await db.query(
        `
        UPDATE notifications
        SET lu = true
        WHERE id_utilisateur = $1
        `,
        [id_utilisateur]
    );


    return {
        success: true
    };
}



// =======================================
// Supprimer une notification
// =======================================
async function deleteNotification(id_notification) {

    const result = await db.query(
        `
        DELETE FROM notifications
        WHERE id_notification = $1
        `,
        [id_notification]
    );


    return result.rowCount > 0;
}



module.exports = {
    findByUser,
    findById,
    create,
    markAsLu,
    markAllAsLu,
    delete: deleteNotification
};
