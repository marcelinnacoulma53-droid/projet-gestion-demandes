-- Ajout de la colonne pieces_justificatives dans demandes
ALTER TABLE demandes ADD COLUMN IF NOT EXISTS pieces_justificatives TEXT DEFAULT '';
