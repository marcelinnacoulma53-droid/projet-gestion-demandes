const typeDemandeRepo = require('../../db/repositories/type_demande.repo');

const getAll = async (req, res, next) => {
    try {
        const types = await typeDemandeRepo.findAll();
        res.json({ success: true, types });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    const { libelle } = req.body;
    if (!libelle) {
        return res.status(400).json({ message: 'Le libellé est requis' });
    }
    try {
        const type = await typeDemandeRepo.create(libelle);
        res.status(201).json({ success: true, type });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleted = await typeDemandeRepo.deleteType(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Type de demande non trouvé' });
        }
        res.json({ success: true, message: 'Type de demande supprimé' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, create, remove };