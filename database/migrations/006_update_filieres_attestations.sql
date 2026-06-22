-- 006_update_filieres_attestations.sql
-- Met à jour les filières, types d'attestation et types de documents académiques

-- Filières : remplacer par une seule filière "Informatique"
TRUNCATE TABLE filieres CASCADE;
INSERT INTO filieres (code, libelle) VALUES ('INFO', 'Informatique');

-- Types d'attestation : remplacer par les nouvelles valeurs
TRUNCATE TABLE types_attestation CASCADE;
INSERT INTO types_attestation (libelle) VALUES
('Attestation provisoire'),
('Attestation d''inscription');

-- Types de documents académiques : remplacer "Attestation de reussite" par "Attestation provisoire"
TRUNCATE TABLE types_document_academique CASCADE;
INSERT INTO types_document_academique (libelle) VALUES
('Diplome'),
('Releve de notes'),
('Attestation provisoire'),
('Certificat de scolarite');

-- Ajout du semestre S5
INSERT INTO semestres (libelle) VALUES ('S5') ON CONFLICT (libelle) DO NOTHING;
