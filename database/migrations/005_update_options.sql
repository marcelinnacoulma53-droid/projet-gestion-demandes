-- 005_update_options.sql
-- Remplace les anciennes options (GL, SR, SIC, CD, RSI, IOT, MI)
-- par les nouvelles options ESI (Troncs communs, Licences, Masters)

TRUNCATE TABLE options CASCADE;

INSERT INTO options (libelle) VALUES
('Tronc commun 1'),
('Tronc commun 2'),
('Ingénierie des Systèmes d''Information'),
('Ingénierie des Réseaux et Systèmes'),
('Systèmes d''Aide à la Décision'),
('Conception et Architecture des Réseaux'),
('Cybersécurité'),
('Sciences des Données'),
('Cybersécurité en Formation Continue'),
('Sciences des Données en Formation Continue');
