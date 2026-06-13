// Version temporaire
let professeurs = [];

const professeurRepo = {
    create: async (data) => {
        const newId = professeurs.length + 1;
        const newProfesseur = {
            id_professeur: newId,
            id_utilisateur: data.id_utilisateur,
            grade: data.grade,
            specialite: data.specialite
        };
        professeurs.push(newProfesseur);
        return newProfesseur;
    }
};

module.exports = professeurRepo;