const express = require('express');
const router = express.Router();
const professeurController = require('../controllers/professeur.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

router.get('/', authenticate, professeurController.getAllProfesseurs);

module.exports = router;
