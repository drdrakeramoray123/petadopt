const Contact = require("../models/contact.model");
const User = require("../models/user.model");
const Pet = require("../models/pet.model");
const Animal = require("../models/animal.model");
const db = require("../data/database");
const bcrypt = require("bcrypt");
const pagination = require("../util/pagination");
const Adoption = require("../models/adoptionForm.model");
const Pets = require("../models/pet.model");

async function getAllMessages(req, res) {
    const currentPage = req.query.page;

    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let messages;
    let totalPages;
    try {
        const contact = new Contact();
        const count = await contact.getCount();
        const { startFrom, perPage, pages } = pagination(count, currentPage, 6);

        messages = await contact.getAll(startFrom, perPage);
        totalPages = pages;
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/messages", { messages, pages: totalPages, currentPage });
}

async function getMessage(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let message;
    try {
        const contact = new Contact();
        message = await contact.getById(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/message", { message });
}

async function deleteMessage(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    try {
        const contact = new Contact();
        await contact.delete(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/messages");
}

async function getAllUsers(req, res) {
    const currentPage = req.query.page;

    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let users;
    let totalPages;
    try {
        const user = new User();
        const count = await user.getCount();
        const { startFrom, perPage, pages } = pagination(count, currentPage, 5);

        users = await user.getAllUsers(startFrom, perPage);
        totalPages = pages;
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/users", { users, pages: totalPages, currentPage });
}

async function getUserDetails(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let userData;
    try {
        const userId = req.params.id;
        const user = new User();
        userData = await user.getUserDetails(userId);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/user", { userData });
}

async function updateUserDetails(req, res) {
    const userId = req.params.id;
    const {
        firstName,
        middleName,
        lastName,
        dob,
        email,
        phoneNumber,
        oldPassword,
        password,
        confirmPassword,
        street,
        city,
        state,
        country,
        postal,
    } = req.body;
    const uploadedImage = req.file;
    let image = null;

    const enteredData = {
        firstName,
        middleName,
        lastName,
        dob,
        email,
        phoneNumber,
        oldPassword,
        password,
        confirmPassword,
        address: {
            street,
            city,
            state,
            country,
            postalCode: postal,
        },
    };

    if (uploadedImage) {
        image = uploadedImage.path;
    }
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let user = new User();

    if (password && password !== confirmPassword) {
        console.log("Passwords do not match");
        res.render("admin/user", {
            error: "Passwords do not match.",
            userData: enteredData,
        });
        return;
    }

    const updatedUser = {
        firstName,
        middleName,
        lastName,
        dob,
        email,
        phoneNumber,
        address: {
            street,
            city,
            state,
            country,
            postalCode: postal,
        },
    };

    if (image) {
        updatedUser.image = image;
    }

    if (password) {
        updatedUser.password = await bcrypt.hash(password, 12);
    }

    try {
        await user.updateUser(userId, updatedUser);
        res.redirect("/users");
        return;
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }
}

async function deleteUser(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    try {
        const pet = new Pet();
        const adoption = new Adoption();
        await adoption.deleteMyForms(req.params.id);
        await pet.deleteMyPets(req.params.id);
        await db
            .getDb()
            .collection("sessions")
            .deleteOne({ "session.uid": req.params.id });
        const user = new User();
        await user.deleteUser(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/users");
}

async function getAllAnimals(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    const currentPage = req.query.page;
    let animalData;
    let totalPages;
    try {
        const animal = new Animal();
        const count = await animal.getCount();
        const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

        animalData = await animal.getAllAnimals(startFrom, perPage);
        totalPages = pages;
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/animals", {
        animalData: animalData,
        pages: totalPages,
        currentPage,
    });
}

async function getAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let animal;
    try {
        const animalObj = new Animal();
        animal = await animalObj.getAnimal(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("shared/animal-details", { animalData: animal });
}

function getAddAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    res.render("admin/add-animal");
}

async function addAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    const {
        breedName,
        isMixBreed,
        animalOrigin,
        type,
        category,
        size,
        shredding_lvl,
        drolling_lvl,
        coat_grooming_frequency,
        coat_type,
        coat_length,
        color,
        playfulness,
        vocality,
        heat_sensitivity,
        training,
        energy_lvl,
        barking_lvl,
        exercise_needs,
        friendliness_to_dog,
        friendliness_to_children,
        affectionate_with_family,
        openness_to_stranger,
        watch_or_protective,
        adaptability_lvl,
        avg_life,
        avg_height,
        avg_weight,
        description,
        health,
        caring_health,
        caring_grooming,
        caring_exercise,
        caring_training,
        caring_nutrition,
    } = req.body;

    const uploadedImages = req.files;
    const images = [];
    for (let image of uploadedImages) {
        images.push(image.path);
    }

    const animal = {
        type,
        breedName,
        isMixBreed,
        category,
        animalOrigin,
        size,
        color,
        qualities: {
            playfulness,
            vocality,
            heat_sensitivity,
            training,
            energy_lvl,
            barking_lvl,
            exercise_needs,
            friendliness_to_dog,
            friendliness_to_children,
            affectionate_with_family,
            openness_to_stranger,
            watch_or_protective,
            adaptability_lvl,
        },
        physical: {
            shredding_lvl,
            drolling_lvl,
            coat_grooming_frequency,
            coat_type,
            coat_length,
        },
        avg_life,
        avg_height,
        avg_weight,
        description,
        images,
        health,
        caring: {
            health: caring_health,
            grooming: caring_grooming,
            exercise: caring_exercise,
            training: caring_training,
            nutrition: caring_nutrition,
        },
    };

    try {
        const animalObj = new Animal();
        await animalObj.addAnimal(animal);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/animals");
}

async function getUpdateAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let animal;
    try {
        const animalObj = new Animal();
        animal = await animalObj.getAnimal(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/edit-animal", { animalData: animal });
}

async function updateAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    const {
        breedName,
        isMixBreed,
        animalOrigin,
        type,
        category,
        size,
        shredding_lvl,
        drolling_lvl,
        coat_grooming_frequency,
        coat_type,
        coat_length,
        color,
        playfulness,
        vocality,
        heat_sensitivity,
        training,
        energy_lvl,
        barking_lvl,
        exercise_needs,
        friendliness_to_dog,
        friendliness_to_children,
        affectionate_with_family,
        openness_to_stranger,
        watch_or_protective,
        adaptability_lvl,
        avg_life,
        avg_height,
        avg_weight,
        description,
        health,
        caring_health,
        caring_grooming,
        caring_exercise,
        caring_training,
        caring_nutrition,
    } = req.body;

    const uploadedImages = req.files;

    const images = [];
    for (let image of uploadedImages) {
        images.push(image.path);
    }

    const animal = {
        type,
        breedName,
        isMixBreed,
        category,
        animalOrigin,
        size,
        color,
        qualities: {
            playfulness,
            vocality,
            heat_sensitivity,
            training,
            energy_lvl,
            barking_lvl,
            exercise_needs,
            friendliness_to_dog,
            friendliness_to_children,
            affectionate_with_family,
            openness_to_stranger,
            watch_or_protective,
            adaptability_lvl,
        },
        physical: {
            shredding_lvl,
            drolling_lvl,
            coat_grooming_frequency,
            coat_type,
            coat_length,
        },
        avg_life,
        avg_height,
        avg_weight,
        description,
        images,
        health,
        caring: {
            health: caring_health,
            grooming: caring_grooming,
            exercise: caring_exercise,
            training: caring_training,
            nutrition: caring_nutrition,
        },
    };

    if (images.length > 0) {
        animal.images = images;
    }

    try {
        const animalObj = new Animal();
        await animalObj.updateAnimal(req.params.id, animal);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/animals");
}

async function deleteAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    try {
        const animalObj = new Animal();
        await animalObj.deleteAnimal(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/animals");
}

async function getApplications(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    const currentPage = req.query.page || 1;
    let totalPages;
    let applications;
    try {
        const applicationObj = new Adoption();
        const count = await applicationObj.getCount();
        const { startFrom, perPage, pages } = pagination(count, currentPage, 3);
        totalPages = pages;
        applications = await applicationObj.getAllForms(startFrom, perPage);
        const user = new User();
        const pet = new Pet();
        for (let application of applications) {
            const owner = await user.getUserDetails(application.ownerId);
            application.owner = owner;
            const petDetails = await pet.getPetById(application.petId);
            application.pet = petDetails;
        }
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/applications", {
        applications,
        pages: totalPages,
        currentPage,
    });
}

async function getAdopted(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    const currentPage = req.query.page || 1;
    let totalPages;
    let adoptions;
    try {
        const pets = new Pets();
        const count = await pets.getAdoptedCount();
        const { startFrom, perPage, pages } = pagination(count, currentPage, 3);
        totalPages = pages;
        adoptions = await pets.getAdoptedPets(startFrom, perPage);
        const user = new User();
        for (let adoption of adoptions) {
            const oldOwner = await user.getUserDetails(adoption.oldOwner);
            adoption.oldOwner = oldOwner;
        }
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/adoption", {
        adoptions,
        pages: totalPages,
        currentPage,
    });
}

module.exports = {
    getAllMessages,
    getMessage,
    deleteMessage,
    getAllUsers,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    getAllAnimals,
    getAnimal,
    getAddAnimal,
    addAnimal,
    getUpdateAnimal,
    updateAnimal,
    deleteAnimal,
    getApplications,
    getAdopted,
};
