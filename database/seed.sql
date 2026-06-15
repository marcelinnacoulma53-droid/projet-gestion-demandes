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
('Professeur'),
('Directrice'),
('Presidence'),
('Scolarite')
ON CONFLICT (libelle) DO NOTHING;

-- Décisions possibles lors des traitements

INSERT INTO decisions (libelle)
VALUES
('Acceptee'),
('Rejetee'),
('Transmise'),
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
