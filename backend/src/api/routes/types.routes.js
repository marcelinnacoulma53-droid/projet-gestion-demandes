const express = require('express');
const router = express.Router();

const typeDemandeController = require('../controllers/typeDemande.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { checkRole } = require('../../middlewares/role.middleware');

router.get('/', authenticate, checkRole(['administrateur']), typeDemandeController.getAll);
router.post('/', authenticate, checkRole(['administrateur']), typeDemandeController.create);
router.delete('/:id', authenticate, checkRole(['administrateur']), typeDemandeController.remove);

module.exports = router;