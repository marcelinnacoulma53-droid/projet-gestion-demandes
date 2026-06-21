const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const { authenticate } = require('../../middlewares/auth.middleware');

router.get('/matieres', authenticate, async (req, res, next) => {
    try {
        const result = await db.query('SELECT id_matiere, code, libelle FROM matieres ORDER BY libelle ASC');
        res.json({ success: true, matieres: result.rows });
    } catch (error) {
        next(error);
    }
});

router.get('/semestres', authenticate, async (req, res, next) => {
    try {
        const result = await db.query('SELECT id_semestre, libelle FROM semestres ORDER BY libelle ASC');
        res.json({ success: true, semestres: result.rows });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
