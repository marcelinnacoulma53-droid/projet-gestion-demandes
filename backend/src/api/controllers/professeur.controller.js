const professeurRepo = require('../../db/repositories/professeur.repo');

const getAllProfesseurs = async (req, res, next) => {
    try {
        const professeurs = await professeurRepo.findAll();
        res.json({ success: true, professeurs });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllProfesseurs };
