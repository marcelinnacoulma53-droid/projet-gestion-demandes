-- ===========================================
-- Migration 002 : Ajout des utilisateurs de test
-- ===========================================
-- Date : 2026-06-21
-- Description : Ajoute les comptes DA et Professeur
--   pour permettre de tester le circuit complet.
--   Mot de passe pour tous les comptes : secret123
-- ===========================================

-- 1. Création du compte DA (Directeur Adjoint)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, id_role, actif, premiere_connexion)
SELECT 'Kaboré', 'Moussa', 'da@esi.bf',
       '$2b$10$Gm2b/6Tl5tZzI8Vd6wiGrOVbuvCPV.wmmM4kSkT7abngrtk4OdrDm',
       id_role, true, true
FROM roles WHERE libelle = 'DA'
ON CONFLICT (email) DO NOTHING;

-- Personnel associé au DA
INSERT INTO personnel_administratif (id_utilisateur, fonction, service)
SELECT id_utilisateur, 'Directeur Adjoint', 'Direction'
FROM utilisateurs WHERE email = 'da@esi.bf'
ON CONFLICT DO NOTHING;

-- 2. Création du compte Professeur
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, id_role, actif, premiere_connexion)
SELECT 'Traoré', 'Aminata', 'professeur@esi.bf',
       '$2b$10$Gm2b/6Tl5tZzI8Vd6wiGrOVbuvCPV.wmmM4kSkT7abngrtk4OdrDm',
       id_role, true, true
FROM roles WHERE libelle = 'Professeur'
ON CONFLICT (email) DO NOTHING;

-- Fiche professeur associée
INSERT INTO professeurs (id_utilisateur, grade, specialite)
SELECT id_utilisateur, 'Maître de Conférences', 'Informatique'
FROM utilisateurs WHERE email = 'professeur@esi.bf'
ON CONFLICT (id_utilisateur) DO NOTHING;
