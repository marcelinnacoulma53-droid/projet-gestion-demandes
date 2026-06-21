-- ===========================================
-- Migration 001 : Ajout des nouvelles colonnes
-- ===========================================
-- Date : 2026-06-21
-- Description : Ajoute les colonnes manquantes
--   pour les tables options, motifs, demande_motifs
--   et les nouveaux champs dans les tables existantes.
-- ===========================================

-- 1. Tables de référence

CREATE TABLE IF NOT EXISTS options (
    id_option SERIAL PRIMARY KEY,
    libelle VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS motifs (
    id_motif SERIAL PRIMARY KEY,
    libelle VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS demande_motifs (
    id_demande INT REFERENCES demandes(id_demande),
    id_motif INT REFERENCES motifs(id_motif),
    PRIMARY KEY (id_demande, id_motif)
);

-- 2. Nouvelles colonnes dans les tables existantes

ALTER TABLE etudiants
    ADD COLUMN IF NOT EXISTS id_option INT REFERENCES options(id_option);

ALTER TABLE demandes
    ADD COLUMN IF NOT EXISTS annee_universitaire VARCHAR(20),
    ADD COLUMN IF NOT EXISTS correspondant VARCHAR(100);

ALTER TABLE reclamations
    ADD COLUMN IF NOT EXISTS session VARCHAR(20);

ALTER TABLE attestations
    ADD COLUMN IF NOT EXISTS nombre_exemplaires INT DEFAULT 1;

ALTER TABLE duplicatas
    ADD COLUMN IF NOT EXISTS nombre_exemplaires INT DEFAULT 1;
