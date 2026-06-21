const db = require('../connection');


// =======================================
// Trouver un utilisateur par email
// Retour : id_utilisateur, email, mot_de_passe, actif, id_role
// =======================================
async function findByEmail(email) {

    const result = await db.query(
        `
        SELECT 
            id_utilisateur,
            email,
            mot_de_passe,
            actif,
            id_role
        FROM utilisateurs
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0] || null;
}


// =======================================
// Trouver un utilisateur avec son rôle
// =======================================
async function findByEmailWithRole(email) {

    const result = await db.query(
        `
        SELECT 
            u.id_utilisateur,
            u.email,
            u.nom,
            u.prenom,
            u.mot_de_passe,
            u.actif,
            u.id_role,
            u.premiere_connexion,
            r.libelle AS role_libelle
        FROM utilisateurs u
        LEFT JOIN roles r
            ON u.id_role = r.id_role
        WHERE u.email = $1
        `,
        [email]
    );

    return result.rows[0] || null;
}

// =======================================
// Trouver un utilisateur par EMAIL ou MATRICULE, avec son rôle
// Utilisé pour le login (étudiants peuvent utiliser l'un ou l'autre)
// =======================================
async function findByIdentifiantWithRole(identifiant) {

    const result = await db.query(
        `
        SELECT 
            u.id_utilisateur,
            u.email,
            u.nom,
            u.prenom,
            u.mot_de_passe,
            u.actif,
            u.id_role,
            u.premiere_connexion,
            r.libelle AS role_libelle
        FROM utilisateurs u
        LEFT JOIN roles r
            ON u.id_role = r.id_role
        LEFT JOIN etudiants e
            ON e.id_utilisateur = u.id_utilisateur
        WHERE u.email = $1 OR e.matricule = $1
        `,
        [identifiant]
    );

    return result.rows[0] || null;
}

// =======================================
// Trouver un utilisateur par ID
// =======================================
async function findById(id) {

    const result = await db.query(
        `
        SELECT
            id_utilisateur,
            nom,
            prenom,
            email,
            telephone
        FROM utilisateurs
        WHERE id_utilisateur = $1
        `,
        [id]
    );

    return result.rows[0] || null;
}


// =======================================
// Créer un utilisateur
// =======================================
async function create(userData) {
    const { nom, prenom, email, mot_de_passe, id_role, premiere_connexion } = userData;
    
    const result = await db.query(
        `
        INSERT INTO utilisateurs
        (nom, prenom, email, mot_de_passe, id_role, premiere_connexion)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_utilisateur, nom, prenom, email
        `,
        [nom, prenom, email, mot_de_passe, id_role, premiere_connexion !== undefined ? premiere_connexion : true]
    );
    return result.rows[0];
}


// =======================================
// Trouver l'étudiant lié à un utilisateur
// =======================================
async function findEtudiantByUserId(id_utilisateur) {

    const result = await db.query(
        `
        SELECT
            id_etudiant,
            id_utilisateur,
            matricule
        FROM etudiants
        WHERE id_utilisateur = $1
        `,
        [id_utilisateur]
    );


    return result.rows[0] || null;
}

// =======================================
// Mettre à jour un utilisateur
// =======================================
async function update(id_utilisateur, updates) {
    const { email, mot_de_passe, premiere_connexion, nom } = updates;
    
    let query = 'UPDATE utilisateurs SET ';
    const params = [];
    let paramIndex = 1;
    
    if (email !== undefined) {
        query += `email = $${paramIndex}, `;
        params.push(email);
        paramIndex++;
    }
    if (mot_de_passe !== undefined) {
        query += `mot_de_passe = $${paramIndex}, `;
        params.push(mot_de_passe);
        paramIndex++;
    }
    if (premiere_connexion !== undefined) {
        query += `premiere_connexion = $${paramIndex}, `;
        params.push(premiere_connexion);
        paramIndex++;
    }
    if (nom !== undefined) {
        query += `nom = $${paramIndex}, `;
        params.push(nom);
        paramIndex++;
    }
    
    // Enlever la dernière virgule et espace
    query = query.slice(0, -2);
    query += ` WHERE id_utilisateur = $${paramIndex} RETURNING id_utilisateur, email`;
    params.push(id_utilisateur);
    
    const result = await db.query(query, params);  // ← db au lieu de pool
    return result.rows[0] || null;
}

// =======================================
// Trouver les utilisateurs par libellé de rôle
// =======================================
async function findByRole(roleLibelle) {
    const result = await db.query(
        `
        SELECT
            u.id_utilisateur,
            u.nom,
            u.prenom,
            u.email
        FROM utilisateurs u
        LEFT JOIN roles r ON u.id_role = r.id_role
        WHERE LOWER(r.libelle) = LOWER($1)
        `,
        [roleLibelle]
    );

    return result.rows;
}

// Export du repository
module.exports = {
    findByEmail,
    findByEmailWithRole,
    findByIdentifiantWithRole,   // ✅ ajouté
    findById,
    create,
    findEtudiantByUserId,
    update,
    findByRole
};
