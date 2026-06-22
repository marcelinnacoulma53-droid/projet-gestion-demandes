-- 006_update_filieres_attestations.sql
-- Met à jour les filières et types d'attestation

-- Filières : remplacer par une seule filière "Informatique"
TRUNCATE TABLE filieres CASCADE;
INSERT INTO filieres (code, libelle) VALUES ('INFO', 'Informatique');

-- Types d'attestation : remplacer par les nouvelles valeurs
TRUNCATE TABLE types_attestation CASCADE;
INSERT INTO types_attestation (libelle) VALUES
('Attestation provisoire'),
('Attestation d''inscription');
