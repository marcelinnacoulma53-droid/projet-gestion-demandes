// ============================================================
// CONTRÔLEUR D'AUTHENTIFICATION
// Gère l'inscription, la connexion et le profil utilisateur
// ============================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/env');
const authConfig = require('../../config/auth');

// ✅ VRAI appel (plus de simulation) - Repositories fournis par Membre 1
const userRepo = require('../../db/repositories/user.repo');
const etudiantRepo = require('../../db/repositories/etudiant.repo');
const roleRepo = require('../../db/repositories/role.repo');
const professeurRepo = require('../../db/repositories/professeur.repo');
const personnelRepo = require('../../db/repositories/personnel.repo');

// ============================================================
// 1. INSCRIPTION ÉTUDIANT
// POST /api/auth/register
// ============================================================
const register = async (req, res) => {
    console.log(`📥 Requête reçue : ${req.method} ${req.url}`);
    const { nom, prenom, matricule, email, mot_de_passe } = req.body;

    if (!nom || !prenom || !matricule || !email || !mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
        // ✅ VRAI appel (plus de simulation) - Vérifie si l'email existe déjà
        const emailExistant = await userRepo.findByEmail(email);
        if (emailExistant) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }

        // ✅ VRAI appel (plus de simulation) - Vérifie si le matricule existe déjà
        const matriculeExistant = await etudiantRepo.findByMatricule(matricule);
        if (matriculeExistant) {
            return res.status(409).json({ message: 'Ce matricule est déjà utilisé' });
        }

        // ✅ VRAI appel (plus de simulation) - Récupère l'id du rôle 'etudiant'
        const roleEtudiant = await roleRepo.findByLibelle('etudiant');
        
        // ✅ Hachage du mot de passe
        const motDePasseHash = await bcrypt.hash(mot_de_passe, authConfig.bcryptRounds);

        // ✅ VRAI appel (plus de simulation) - Crée l'utilisateur dans la table utilisateurs
        const newUser = await userRepo.create({
            nom, prenom, email,
            mot_de_passe: motDePasseHash,
            id_role: roleEtudiant.id_role,
            premiere_connexion: false
        });

        // ✅ VRAI appel (plus de simulation) - Crée l'étudiant dans la table etudiants
        await etudiantRepo.create({
            id_utilisateur: newUser.id_utilisateur,
            matricule: matricule
        });

        // ✅ Génération du token JWT
        const token = jwt.sign(
            { userId: newUser.id_utilisateur, role: 'etudiant' },
            authConfig.jwtSecret,
            { expiresIn: authConfig.jwtExpire }
        );

        // ✅ Réponse au frontend
        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser.id_utilisateur,
                nom: newUser.nom,
                prenom: newUser.prenom,
                email: newUser.email,
                role: 'etudiant'
            }
        });

    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

// ============================================================
// 2. CONNEXION (Étudiants + Staff)
// POST /api/auth/login
// ============================================================
const login = async (req, res) => {
    console.log(`📥 Requête reçue : ${req.method} ${req.url}`);
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
        // ✅ VRAI appel (plus de simulation) - Cherche l'utilisateur par email avec son rôle
        // APRÈS
        const user = await userRepo.findByIdentifiantWithRole(email);

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // ✅ Vérifie si le compte est actif
        if (!user.actif) {
            return res.status(401).json({ message: 'Compte désactivé' });
        }

        // ✅ Vérification du mot de passe
        const motDePasseValide = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!motDePasseValide) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // ✅ Génération du token JWT
        const token = jwt.sign(
            { 
                userId: user.id_utilisateur, 
                role: user.role_libelle.toLowerCase()
            },
            authConfig.jwtSecret,
            { expiresIn: authConfig.jwtExpire }
        );

        // ✅ Vérifier si c'est la première connexion (pour le personnel)
        if (user.premiere_connexion === true) {
            return res.json({
                success: true,
                premiere_connexion: true,
                token: token,
                user: {
                    id: user.id_utilisateur,
                    email: user.email,
                    role: user.role_libelle
                }
            });
        }

        // ✅ Réponse au frontend (connexion normale)
        res.json({
            success: true,
            token,
            user: {
                id: user.id_utilisateur,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role_libelle.toLowerCase(), 
                premiere_connexion: user.premiere_connexion
            }
        });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

// ============================================================
// 3. PROFIL CONNECTÉ
// GET /api/auth/me
// ============================================================
const getMe = async (req, res) => {
    try {
        // ✅ L'ID utilisateur vient du middleware authenticate
        const userId = req.user.userId;

        // ✅ VRAI appel (plus de simulation) - Cherche l'utilisateur par ID
        const user = await userRepo.findById(userId);

        // ✅ Réponse au frontend
        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Erreur getMe:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

// ============================================================
// 4. (OPTIONNEL) DÉCONNEXION
// POST /api/auth/logout
// ============================================================
const logout = async (req, res) => {
    // Avec JWT, la déconnexion est gérée côté frontend (suppression du token)
    res.json({ message: 'Déconnexion réussie' });
};
// ============================================================
// 4. CRÉATION D'UN COMPTE STAFF (PAR L'ADMIN)
// POST /api/auth/admin/staff
// Nécessite le rôle 'admin'
// ============================================================
const createStaff = async (req, res, next) => {
    // Récupération des données envoyées
    const { nom, prenom, email, mot_de_passe, role, fonction, service } = req.body;

    // Vérification des champs obligatoires
    if (!nom || !prenom || !email || !mot_de_passe || !role) {
        return res.status(400).json({ 
            message: 'Champs requis : nom, prenom, email, mot_de_passe, role' 
        });
    }

    // Liste des rôles staff autorisés
    const rolesStaff = ['secretaire', 'sp', 'da', 'professeur', 'directrice', 'presidence', 'scolarite'];
    
    if (!rolesStaff.includes(role)) {
        return res.status(400).json({ 
            message: `Rôle invalide. Rôles autorisés : ${rolesStaff.join(', ')}` 
        });
    }

    try {
        // Vérifier si l'email existe déjà
        const emailExistant = await userRepo.findByEmail(email);
        if (emailExistant) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }

        // Récupérer l'id_role à partir du libellé
        const roleInfo = await roleRepo.findByLibelle(role);
        if (!roleInfo) {
            return res.status(400).json({ message: 'Rôle non trouvé dans la base' });
        }

        // Hacher le mot de passe
        const motDePasseHash = await bcrypt.hash(mot_de_passe, authConfig.bcryptRounds);

        // Créer l'utilisateur
        const newUser = await userRepo.create({
            nom,
            prenom,
            email,
            mot_de_passe: motDePasseHash,
            id_role: roleInfo.id_role,
            premiere_connexion: true   // ← AJOUTER CETTE LIGNE
        });

        // Selon le rôle, insérer dans la table spécifique
        if (role === 'professeur') {
            // Pour un professeur
            await professeurRepo.create({
                id_utilisateur: newUser.id_utilisateur,
                grade: req.body.grade || null,
                specialite: req.body.specialite || null
            });
        } else {
            // Pour le personnel administratif
            await personnelRepo.create({
                id_utilisateur: newUser.id_utilisateur,
                fonction: fonction || role,
                service: service || null
            });
        }

        // Réponse de succès
        res.status(201).json({
            success: true,
            message: `Compte ${role} créé avec succès`,
            user: {
                id: newUser.id_utilisateur,
                nom: newUser.nom,
                prenom: newUser.prenom,
                email: newUser.email,
                role: role
            }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// 5. CHANGER LES IDENTIFIANTS (première connexion)
// POST /api/auth/changer-identifiants
// ============================================================
const changerIdentifiants = async (req, res, next) => {
    const userId = req.user.userId;
    const { nouveau_email, nouveau_mot_de_passe, confirmation_mot_de_passe, nom } = req.body;

    if (!nouveau_email || !nouveau_mot_de_passe || !confirmation_mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (nouveau_mot_de_passe !== confirmation_mot_de_passe) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        // Vérifier si le nouvel email n'existe pas déjà (pour un autre utilisateur)
        const emailExistant = await userRepo.findByEmail(nouveau_email);
        if (emailExistant && emailExistant.id_utilisateur !== userId) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }

        // Hacher le nouveau mot de passe
        const motDePasseHash = await bcrypt.hash(nouveau_mot_de_passe, authConfig.bcryptRounds);

        // Mettre à jour l'utilisateur
        await userRepo.update(userId, {
            email: nouveau_email,
            mot_de_passe: motDePasseHash,
            premiere_connexion: false,
            nom: nom || undefined
        });

        // Récupérer le rôle pour le nouveau token
        const roleResult = await userRepo.findByEmailWithRole(nouveau_email);
        
        // APRÈS (corrigé) :
        const newToken = jwt.sign(
            { userId: userId, role: (roleResult?.role_libelle || 'staff').toLowerCase() },  // ✅
            authConfig.jwtSecret,
            { expiresIn: authConfig.jwtExpire }
        );

        res.json({
            success: true,
            message: 'Identifiants mis à jour avec succès',
            token: newToken,
            user: {
                id: userId,
                email: nouveau_email,
                nom: roleResult?.nom || nom || '',
                prenom: roleResult?.prenom || '',
                role: (roleResult?.role_libelle || 'staff').toLowerCase()   // ✅
            }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// 7. LISTER TOUS LES UTILISATEURS (admin uniquement)
// GET /api/auth/users
// ============================================================
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userRepo.findAll();
        res.json({ success: true, users });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// 8. SUPPRIMER UN UTILISATEUR (admin uniquement)
// DELETE /api/auth/users/:id
// ============================================================
const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleted = await userRepo.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe, logout, createStaff, changerIdentifiants, getAllUsers, deleteUser };