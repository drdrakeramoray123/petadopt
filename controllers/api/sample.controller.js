const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const db = require("../../data/database");

const Pet = require("../../models/pet.model");
const User = require("../../models/user.model");
const Contact = require("../../models/contact.model");

async function generateSampleData(req, res) {
    const users = [
        {
            firstName: "Admin",
            middleName: "A",
            lastName: "User",
            dob: new Date(Date.now()).toISOString().split('T')[0],
            email: "admin@email.com",
            phoneNumber: "0000000000",
            password: await bcrypt.hash("Admin123", 12),
            image: "public\\uploads\\admin.jpg",
            address: {
                street: "Street 0",
                city: "City 0",
                state: "State 0",
                country: "Country 0",
                postalCode: "000000"
            },
            isAdmin: true,
        },
        {
            firstName: "Test1",
            middleName: "T1",
            lastName: "User",
            dob: new Date(Date.now()).toISOString().split('T')[0],
            email: "test1@email.com",
            phoneNumber: "1111111111",
            password: await bcrypt.hash("Test123", 12),
            image: "public\\uploads\\test1.jpg",
            address: {
                street: "Street 1",
                city: "City 1",
                state: "State 1",
                country: "Country 1",
                postalCode: "111111"
            },
            isAdmin: false,
        },
        {
            firstName: "Test2",
            middleName: "T2",
            lastName: "User",
            dob: new Date(Date.now()).toISOString().split('T')[0],
            email: "test2@email.com",
            phoneNumber: "2222222222",
            password: await bcrypt.hash("Test123", 12),
            image: "public\\uploads\\test2.jpg",
            address: {
                street: "Street 2",
                city: "City 2",
                state: "State 2",
                country: "Country 2",
                postalCode: "222222"
            },
            isAdmin: false,
        },
        {
            firstName: "Test3",
            middleName: "T3",
            lastName: "User",
            dob: new Date(Date.now()).toISOString().split('T')[0],
            email: "test3@email.com",
            phoneNumber: "3333333333",
            password: await bcrypt.hash("Test123", 12),
            image: "public\\uploads\\test3.jpg",
            address: {
                street: "Street 3",
                city: "City 3",
                state: "State 3",
                country: "Country 3",
                postalCode: "333333"
            },
            isAdmin: false,
        },
    ]

    await db.getDb().collection("usersBk").remove();
    const result = await db.getDb().collection("usersBk").insertMany(users);
    
    let usersInserted = result.insertedIds;
    let userIds = [];

    for(let user in users) {
        userIds.push(ObjectId(usersInserted[user]).toString());
    }

    // Pets
    let pets = [
        {
            name: "Luna",
            age: "5",
            gender: 'male',
            type: 'cat',
            breed: null,
            size: 'small',
            coatLength: 'medium',
            trained: 'yes',
            health: 'vaccinations',
            characteristics: null,
            giveaway: 'true',
            price: '0',
            images: [ 'public\\uploads\\luna1.png', "public\\uploads\\luna2.png" ],
            uid: userIds[0],
            address: {
                street: 'Street 1',
                city: 'City 1 ',
                state: 'State 1',
                country: 'Country 1',
                postalCode: '111111'
            }
        },
    ]

    res.render("shared/sample");
}

module.exports = {
    generateSampleData,
}