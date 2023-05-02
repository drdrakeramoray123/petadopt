const { ObjectId } = require("mongodb");
const db = require("../data/database");

class Pets {
    constructor(
        name,
        age,
        gender,
        type,
        breed,
        size,
        coatLength,
        houseTrained,
        health,
        characteristics,
        sellOrDonate,
        price,
        image
    ) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.type = type;
        this.breed = breed;
        this.size = size;
        this.coatLength = coatLength;
        this.houseTrained = houseTrained;
        this.health = health;
        this.characteristics = characteristics;
        this.sellOrDonate = sellOrDonate;
        this.price = price;
        this.image = image;
    }

    async getCount() {
        const collection = await db.getDb().collection("pets");
        return await collection.countDocuments();
    }

    async getAdoptedCount() {
        const collection = await db
            .getDb()
            .collection("pets")
            .find({ status: "adopted" })
            .toArray();
        return await collection.length;
    }

    async getCountByType(type) {
        const collection = await db
            .getDb()
            .collection("pets")
            .find({ type: type });
        return await collection.count();
    }

    async getCountByBreed(breed) {
        const collection = await db
            .getDb()
            .collection("pets")
            .find({ breed: breed });
        return await collection.count();
    }

    async getCountByCity(city) {
        const collection = await db
            .getDb()
            .collection("pets")
            .find({ "address.city": city });
        return await collection.count();
    }

    getAllPets(startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({})
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getAllPetsAvailable(startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ isHidden: { $ne: true } })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getAdoptedPets(startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ status: "adopted" })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getMyPets(uid) {
        return db.getDb().collection("pets").find({ uid: uid }).toArray();
    }

    getPetById(pid) {
        return db
            .getDb()
            .collection("pets")
            .findOne({ _id: ObjectId(pid) });
    }

    addPet(pet) {
        return db.getDb().collection("pets").insertOne(pet);
    }

    deletePet(pid) {
        return db
            .getDb()
            .collection("pets")
            .deleteOne({ _id: ObjectId(pid) });
    }

    updatePet(pid, pet) {
        return db
            .getDb()
            .collection("pets")
            .updateOne({ _id: ObjectId(pid) }, { $set: pet });
    }

    getAllPetsByType(type, startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ type: type })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getAllPetsByBreed(breed, startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ breed: breed })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getAllPetsByCity(city, startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ "address.city": city })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    deleteMyPets(uid) {
        return db.getDb().collection("pets").deleteMany({ uid: uid });
    }

    getAllPetsByPrice(price, startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ price: price })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getAllPetsByGender(gender, startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ gender: gender })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getSimilarCharacteristics(currentId, characteristics) {
        if (characteristics.length === 0) {
            return db
                .getDb()
                .collection("pets")
                .find({ _id: { $ne: ObjectId(currentId) } })
                .sort({ _id: -1 })
                .limit(3)
                .toArray();
        }

        return db
            .getDb()
            .collection("pets")
            .find(
                {
                    $and: [
                        { characteristics: { $in: characteristics } },
                        { _id: { $ne: ObjectId(currentId) } },
                    ],
                },
                { $orderby: { characteristics: -1 } }
            )
            .limit(3)
            .toArray();
    }
}

module.exports = Pets;
