const { ObjectId } = require("mongodb");
const db = require("../data/database");

class Contact {
    constructor(name, email, message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }

    async save() {
        await db.getDb().collection("contacts").insertOne({
            name: this.name,
            email: this.email,
            message: this.message,
            sentAt: new Date().toISOString(),
        });
    }

    async getCount() {
        return await db.getDb().collection("contacts").countDocuments();
    }

    async getAll(startFrom, perPage) {
        const messages = await db
            .getDb()
            .collection("contacts")
            .find({})
            .skip(startFrom)
            .limit(perPage)
            .toArray();

        return messages;
    }

    async getById(id) {
        const message = await db
            .getDb()
            .collection("contacts")
            .findOne({ _id: ObjectId(id) });

        return message;
    }

    async delete(id) {
        await db
            .getDb()
            .collection("contacts")
            .deleteOne({ _id: ObjectId(id) });
    }
}

module.exports = Contact;
