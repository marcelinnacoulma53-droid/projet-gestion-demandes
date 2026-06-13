// Version temporaire
let personnels = [];

const personnelRepo = {
    create: async (data) => {
        const newId = personnels.length + 1;
        const newPersonnel = {
            id_personnel: newId,
            id_utilisateur: data.id_utilisateur,
            fonction: data.fonction,
            service: data.service
        };
        personnels.push(newPersonnel);
        return newPersonnel;
    }
};

module.exports = personnelRepo;