const db = require('../connection');

async function findAll() {
    const result = await db.query(
        `SELECT id_type_demande AS id, libelle FROM types_demande ORDER BY id_type_demande`
    );
    return result.rows;
}

async function create(libelle) {
    const result = await db.query(
        `INSERT INTO types_demande (libelle) VALUES ($1) RETURNING id_type_demande AS id, libelle`,
        [libelle]
    );
    return result.rows[0];
}

async function deleteType(id) {
    const result = await db.query(
        `DELETE FROM types_demande WHERE id_type_demande = $1 RETURNING id_type_demande`,
        [id]
    );
    return result.rows[0] || null;
}

module.exports = { findAll, create, deleteType };