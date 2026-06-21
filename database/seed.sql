-- Données initiales des rôles

INSERT INTO roles (libelle)
VALUES
('Etudiant'),
('Secretaire'),
('DA'),
('Professeur'),
('SP'),
('Directrice'),
('Presidence'),
('Scolarite'),
('Administrateur')
ON CONFLICT (libelle) DO NOTHING;

-- Types de demandes disponibles

INSERT INTO types_demande (libelle, description)
VALUES
('Reclamation', 'Demande de contestation ou vérification concernant une note ou une évaluation'),
('Derogation', 'Demande exceptionnelle nécessitant une autorisation administrative'),
('Duplicata', 'Demande de reproduction d un document académique'),
('Attestation', 'Demande de délivrance d une attestation')
ON CONFLICT (libelle) DO NOTHING;

-- Statuts des demandes

INSERT INTO statuts (libelle)
VALUES
('Brouillon'),
('Soumise'),
('En cours de traitement'),
('Acceptee'),
('Rejetee'),
('Terminee')
ON CONFLICT (libelle) DO NOTHING;

-- Etapes du workflow

INSERT INTO etapes_workflow (libelle)
VALUES
('Secretaire'),
('SP'),
('DA'),
('DA_Final'),
('Professeur'),
('Directrice'),
('Presidence'),
('Scolarite')
ON CONFLICT (libelle) DO NOTHING;

-- Décisions possibles lors des traitements

INSERT INTO decisions (libelle)
VALUES
('VALIDE'),
('REJETE'),
('Transmis'),
('En attente')
ON CONFLICT (libelle) DO NOTHING;

-- Types de documents déposables

INSERT INTO types_document (libelle, description)
VALUES
('Justificatif', 'Document permettant de justifier une demande'),
('Releve de notes', 'Document contenant les notes de l etudiant'),
('Piece identite', 'Document officiel d identification'),
('Document administratif', 'Document administratif complementaire'),
('Autre', 'Autre type de document')
ON CONFLICT (libelle) DO NOTHING;

-- Types de documents académiques pour les duplicatas

INSERT INTO types_document_academique (libelle)
VALUES
('Diplome'),
('Releve de notes'),
('Attestation de reussite'),
('Certificat de scolarite')
ON CONFLICT (libelle) DO NOTHING;

-- Types d'attestations disponibles

INSERT INTO types_attestation (libelle)
VALUES
('Attestation provisoire Licence'),
('Attestation provisoire Master'),
('Attestation de scolarite')
ON CONFLICT (libelle) DO NOTHING;

-- Filières

INSERT INTO filieres (code, libelle)
VALUES
('INFO', 'Informatique'),
('MI', 'Mathématiques et Informatique'),
('RIT', 'Réseaux et Technologies Internet')
ON CONFLICT (code) DO NOTHING;

-- Niveaux

INSERT INTO niveaux (libelle)
VALUES
('L1'), ('L2'), ('L3'),
('M1'), ('M2')
ON CONFLICT (libelle) DO NOTHING;

-- Utilisateur administrateur (email: administrateur@esi.bf, mot de passe: Admin2026!)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, id_role, actif, premiere_connexion)
SELECT 'Admin', 'Système', 'administrateur@esi.bf',
       '$2b$10$c9Qly98ScC0J5x8fHeMG6.x34H6b4TkoDbhCzbM0Vv0BY2F7QK1Zq',
       id_role, true, true
FROM roles WHERE libelle = 'Administrateur'
ON CONFLICT (email) DO NOTHING;

-- Secrétaire de test (email: secretaire@esi.bf, mot de passe: secret123)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, id_role, actif, premiere_connexion)
SELECT 'Ouédraogo', 'Fatoumata', 'secretaire@esi.bf',
       '$2b$10$Gm2b/6Tl5tZzI8Vd6wiGrOVbuvCPV.wmmM4kSkT7abngrtk4OdrDm',
       id_role, true, true
FROM roles WHERE libelle = 'Secretaire'
ON CONFLICT (email) DO NOTHING;

-- Personnel associé à la secrétaire
INSERT INTO personnel_administratif (id_utilisateur, fonction, service)
SELECT id_utilisateur, 'Secrétaire', 'Scolarité'
FROM utilisateurs WHERE email = 'secretaire@esi.bf'
ON CONFLICT DO NOTHING;

-- Options (filières) disponibles

INSERT INTO options (libelle, description)
VALUES
('GL', 'Génie Logiciel'),
('SR', 'Sécurité des Réseaux'),
('SIC', 'Systèmes d Information et Communication'),
('CD', 'Concepteur Développeur'),
('RSI', 'Réseaux et Systèmes Informatiques'),
('IOT', 'Internet des Objets'),
('MI', 'Mathématiques pour l Informatique')
ON CONFLICT (libelle) DO NOTHING;

-- Motifs de réclamation

INSERT INTO motifs (libelle, description)
VALUES
('Comptabilité des notes sur la copie', 'Vérification de la comptabilité entre les notes portées sur la copie et celles enregistrées'),
('Rectification de note', 'Demande de correction d une note erronée'),
('Note non répertoriée', 'Note absente du relevé ou du procès-verbal'),
('Annulation de note', 'Demande d annulation d une note'),
('Rectification du nom', 'Correction d une erreur sur le nom dans les documents'),
('Rectification du n° matricule', 'Correction du numéro matricule sur les relevés'),
('Rectification du lieu de naissance', 'Correction du lieu de naissance sur les documents'),
('Rectification de la date de naissance', 'Correction de la date de naissance sur les documents'),
('Insertion du nom sur le PV', 'Ajout du nom sur le procès-verbal')
ON CONFLICT (libelle) DO NOTHING;
