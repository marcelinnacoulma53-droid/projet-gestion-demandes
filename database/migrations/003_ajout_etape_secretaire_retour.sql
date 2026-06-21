-- ===========================================
-- Migration 003 : étape de retour vers la secrétaire
-- ===========================================
-- Date : 2026-06-21
-- Description : Ajoute l'étape Secretaire_Retour utilisée
--   par les circuits Dérogation et Duplicata quand le SP
--   renvoie le dossier à la secrétaire avant l'acteur suivant.
-- ===========================================

INSERT INTO etapes_workflow (libelle)
VALUES ('Secretaire_Retour')
ON CONFLICT (libelle) DO NOTHING;
