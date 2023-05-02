const { ObjectId } = require("mongodb");
const db = require("../data/database");

class Animal {
    async getCount() {
        return await db.getDb().collection("animals").countDocuments();
    }

    async getAllAnimals(startFrom, perPage) {
        return db
            .getDb()
            .collection("animals")
            .find({})
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    async getAnimal(id) {
        let animal = await db
            .getDb()
            .collection("animals")
            .findOne({ _id: ObjectId(id) });
        return animal;
    }

    async addAnimal(animal) {
        let result = await db.getDb().collection("animals").insertOne(animal);
        return result;
    }

    async updateAnimal(id, animal) {
        let result = await db
            .getDb()
            .collection("animals")
            .updateOne({ _id: ObjectId(id) }, { $set: animal });
        return result;
    }

    async deleteAnimal(id) {
        let result = await db
            .getDb()
            .collection("animals")
            .deleteOne({ _id: ObjectId(id) });
        return result;
    }

    async getAnimalByName(name) {
        let animal = await db
            .getDb()
            .collection("animals")
            .findOne({ name: name });
        return animal;
    }

    async getAnimalByBreed(breed) {
        let animal = await db
            .getDb()
            .collection("animals")
            .findOne({ breedName: breed });
        return animal;
    }

    async getAnimalBySpecies(species) {
        let animal = await db
            .getDb()
            .collection("animals")
            .findOne({ species: species });
        return animal;
    }
}

module.exports = Animal;
