--===========================================
--BASE DE DONNEES : GESTIONS DES DEMANDES
--===========================================

--===========================================
--1.TABLES DE REFERENCE 
--===========================================

-- Table des rôles des utilisateurs
CREATE TABLE roles (
    id_role SERIAL PRIMARY KEY,
    libelle VARCHAR(50) UNIQUE NOT NULL
);

-- Table des filières universitaires
CREATE TABLE filieres (
    id_filiere SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL
);

-- Table des niveaux d'étude
CREATE TABLE niveaux (
    id_niveau SERIAL PRIMARY KEY,
    libelle VARCHAR(20) UNIQUE NOT NULL
);

-- Table des matières enseignées
CREATE TABLE matieres (
    id_matiere SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL
);

-- Table des semestres universitaires
CREATE TABLE semestres (
    id_semestre SERIAL PRIMARY KEY,
    libelle VARCHAR(10) UNIQUE NOT NULL
);

-- Table des statuts des demandes
CREATE TABLE statuts (
    id_statut SERIAL PRIMARY KEY,
    libelle VARCHAR(30) UNIQUE NOT NULL
);

-- Table des étapes du workflow
CREATE TABLE etapes_workflow (
    id_etape SERIAL PRIMARY KEY,
    libelle VARCHAR(50) UNIQUE NOT NULL
);

-- Table des types de demandes
CREATE TABLE types_demande (
    id_type_demande SERIAL PRIMARY KEY,
    libelle VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Table des types de documents
CREATE TABLE types_document (
    id_type_document SERIAL PRIMARY KEY,
    libelle VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Table des types de documents académiques
CREATE TABLE types_document_academique (
    id_type_document_academique SERIAL PRIMARY KEY,
    libelle VARCHAR(100) UNIQUE NOT NULL
);

-- Table des types d'attestation
CREATE TABLE types_attestation (
    id_type_attestation SERIAL PRIMARY KEY,
    libelle VARCHAR(50) UNIQUE NOT NULL
);

-- Table des décisions de traitement
CREATE TABLE decisions (
    id_decision SERIAL PRIMARY KEY,
    libelle VARCHAR(50) UNIQUE NOT NULL
);

-- Table des utilisateurs du système
CREATE TABLE utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    telephone VARCHAR(30),
    actif BOOLEAN DEFAULT TRUE,
    premiere_connexion BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_role INT REFERENCES roles(id_role)
);

-- Table des étudiants
CREATE TABLE etudiants (
    id_etudiant SERIAL PRIMARY KEY,
    id_utilisateur INT UNIQUE REFERENCES utilisateurs(id_utilisateur),
    matricule VARCHAR(50) UNIQUE NOT NULL,
    id_filiere INT REFERENCES filieres(id_filiere),
    id_niveau INT REFERENCES niveaux(id_niveau)
);

-- Table des professeurs
CREATE TABLE professeurs (
    id_professeur SERIAL PRIMARY KEY,
    id_utilisateur INT UNIQUE REFERENCES utilisateurs(id_utilisateur),
    grade VARCHAR(100),
    specialite VARCHAR(100)
);

-- Table du personnel administratif
CREATE TABLE personnel_administratif (
    id_personnel SERIAL PRIMARY KEY,
    id_utilisateur INT UNIQUE REFERENCES utilisateurs(id_utilisateur),
    fonction VARCHAR(50),
    service VARCHAR(100)
);

-- Table centrale des demandes
CREATE TABLE demandes (
    id_demande SERIAL PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    objet VARCHAR(255),
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_soumission TIMESTAMP,

    id_etudiant INT REFERENCES etudiants(id_etudiant),
    id_type_demande INT REFERENCES types_demande(id_type_demande),
    id_statut INT REFERENCES statuts(id_statut),
    id_etape_courante INT REFERENCES etapes_workflow(id_etape)
);

-- Table des documents liés aux demandes
CREATE TABLE documents (
    id_document SERIAL PRIMARY KEY,
    nom_fichier VARCHAR(255),
    nom_original VARCHAR(255),
    type_fichier VARCHAR(50),
    taille INT,
    chemin_stockage TEXT,
    date_depot TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    id_demande INT REFERENCES demandes(id_demande),
    id_type_document INT REFERENCES types_document(id_type_document)
);

-- Table des réclamations
CREATE TABLE reclamations (
    id_reclamation SERIAL PRIMARY KEY,
    id_demande INT UNIQUE REFERENCES demandes(id_demande),
    id_matiere INT REFERENCES matieres(id_matiere),
    id_semestre INT REFERENCES semestres(id_semestre),
    id_professeur INT REFERENCES professeurs(id_professeur),
    description_reclamation TEXT NOT NULL
);

-- Table des dérogations
CREATE TABLE derogations (
    id_derogation SERIAL PRIMARY KEY,
    id_demande INT UNIQUE REFERENCES demandes(id_demande),
    motif TEXT NOT NULL,
    annee_academique VARCHAR(20)
);

-- Table des duplicatas
CREATE TABLE duplicatas (
    id_duplicata SERIAL PRIMARY KEY,
    id_demande INT UNIQUE REFERENCES demandes(id_demande),
    id_type_document_academique INT REFERENCES types_document_academique(id_type_document_academique),
    nombre_exemplaires INT DEFAULT 1
);

-- Table des attestations
CREATE TABLE attestations (
    id_attestation SERIAL PRIMARY KEY,
    id_demande INT UNIQUE REFERENCES demandes(id_demande),
    id_type_attestation INT REFERENCES types_attestation(id_type_attestation)
);

-- Table de suivi du workflow (traitements)
CREATE TABLE traitements (
    id_traitement SERIAL PRIMARY KEY,
    date_traitement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commentaire TEXT,

    id_demande INT REFERENCES demandes(id_demande),
    id_utilisateur INT REFERENCES utilisateurs(id_utilisateur),
    id_decision INT REFERENCES decisions(id_decision),

    ancienne_etape INT REFERENCES etapes_workflow(id_etape),
    nouvelle_etape INT REFERENCES etapes_workflow(id_etape)
);

-- Table des notifications
CREATE TABLE notifications (
    id_notification SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    date_notification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lu BOOLEAN DEFAULT FALSE,

    id_utilisateur INT REFERENCES utilisateurs(id_utilisateur),
    id_demande INT REFERENCES demandes(id_demande)
);
