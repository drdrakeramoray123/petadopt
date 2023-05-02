const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const client = await MongoClient.connect(
        process.env.MONGO_URI || "mongodb://localhost:27017"
    );

    database = client.db(process.env.DB_NAME || "adopt-me");
}

function getDb() {
    if (!database) {
        throw new Error("You must connect to database first!");
    }

    return database;
}

module.exports = {
    connectToDatabase,
    getDb,
};
