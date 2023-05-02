const Animal = require("../models/animal.model");
const pagination = require("../util/pagination");

async function getAnimals(req, res) {
    const currentPage = req.query.page;
    const animal = new Animal();
    const count = await animal.getCount();
    const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

    const animalData = await animal.getAllAnimals(startFrom, perPage);
    res.render("shared/animals", { animalData, pages, currentPage });
}

async function getAnimal(req, res) {
    const animal = new Animal();
    const animalData = await animal.getAnimalByBreed(req.params.breed);

    if (!animalData) {
        res.redirect("/info/animals");
        return;
    }

    res.render("shared/animal-details", { animalData });
}

async function getScan(req, res) {
    res.render("shared/scan");
}

async function postScan(req, res) {
    const animal = new Animal();
    const animalData = await animal.getAnimalByBreed(req.body.breed);

    if (!animalData) {
        res.redirect("/info/animals");
        return;
    }

    res.render("shared/animal-details", { animalData });
}

module.exports = {
    getAnimals,
    getAnimal,
    getScan,
    postScan,
};
