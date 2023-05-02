const fs = require("fs");
const Pet = require("../models/pet.model");
const User = require("../models/user.model");
const Adoption = require("../models/adoptionForm.model");
const pagination = require("../util/pagination");
const { getSentiment } = require("../util/sentiment-analysis");

async function getSearch(req, res) {
    const currentPage = req.query.page;
    const city = req.query.city;
    const pet = new Pet();

    if (city) {
        const count = await pet.getCountByCity(city);
        const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

        const petData = await pet.getAllPetsByCity(city, startFrom, perPage);
        res.render("users/search", { petData, pages, currentPage, city });
        return;
    }

    const count = await pet.getCount();
    const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

    const petData = await pet.getAllPetsAvailable(startFrom, perPage);
    res.render("users/search", { petData, pages, currentPage, city });
}

async function getByType(req, res) {
    const type = req.params.type;
    const city = req.query.city;
    const currentPage = req.query.page;
    const pet = new Pet();
    const count = await pet.getCountByType(type);
    const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

    const petData = await pet.getAllPetsByType(type, startFrom, perPage);
    res.render("users/search", { petData, pages, currentPage, city });
}

async function getByBreed(req, res) {
    const breed = req.params.breed;
    const city = req.query.city;
    const currentPage = req.query.page;
    const pet = new Pet();
    const count = await pet.getCountByBreed(breed);
    const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

    const petData = await pet.getAllPetsByBreed(breed, startFrom, perPage);
    res.render("users/search", { petData, pages, currentPage, city });
}

async function getPetProfiles(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    const currentPage = req.query.page;

    const pet = new Pet();
    const count = await pet.getCount();

    const { startFrom, perPage, pages } = pagination(count, currentPage, 4);

    if (!res.locals.isAdmin) {
        const petData = await pet.getMyPets(res.locals.uid);

        res.render("shared/pets", {
            pets: petData,
            pages: pages,
            currentPage,
            isAdmin: false,
        });
        return;
    }

    const petData = await pet.getAllPets(startFrom, perPage);
    res.render("shared/pets", {
        pets: petData,
        pages: pages,
        currentPage,
        isAdmin: true,
    });
}

async function getPetAdd(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    const user = new User();
    const userData = await user.getUserDetails(res.locals.uid);

    if (!userData.address) {
        res.redirect("/edit-profile");
        return;
    }

    res.render("users/add-pet");
}

async function getPetEdit(req, res) {
    const petId = req.params.id;

    const pet = new Pet();
    const petData = await pet.getPetById(petId);

    if (!petData) {
        res.redirect("/pet-profile");
        return;
    }

    if (petData.uid !== res.locals.uid && !res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    res.render("users/edit-pet", { petData });
}

async function addPet(req, res) {
    let {
        name,
        age,
        gender,
        type,
        breed,
        size,
        color,
        coatLength,
        trained,
        health,
        characteristics,
        giveaway,
        price,
        description,
    } = req.body;
    characteristics = characteristics ? characteristics : [];
    const uploadedImages = req.files;
    const userId = res.locals.uid;

    const user = new User();
    const userData = await user.getUserDetails(userId);

    if (!userData) {
        res.redirect("/login");
        return;
    }

    const images = [];
    for (let image of uploadedImages) {
        images.push(image.path);
    }

    const petData = {
        name,
        age,
        gender,
        type,
        breed,
        size,
        color,
        coatLength,
        trained,
        health,
        characteristics,
        giveaway,
        price,
        images,
        uid: userId,
        address: {
            street: userData.address.street,
            city: userData.address.city,
            state: userData.address.state,
            country: userData.address.country,
            postalCode: userData.address.postalCode,
        },
        description,
    };
    petData.isHidden = false;

    try {
        const pet = new Pet(petData);
        pet.addPet(petData);
    } catch (err) {
        console.log(err);
    }

    if (!res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    res.redirect("/pets");
}

async function updatePet(req, res) {
    const petId = req.params.id;
    let {
        name,
        age,
        gender,
        type,
        breed,
        size,
        color,
        coatLength,
        trained,
        health,
        characteristics,
        giveaway,
        price,
        description,
        street,
        city,
        state,
        country,
        postal,
    } = req.body;
    characteristics = characteristics != null ? characteristics : [];

    const uploadedImages = req.files;
    const userId = res.locals.uid;

    const pet = new Pet();
    const petData = await pet.getPetById(petId);

    if (!petData) {
        res.redirect("/pet-profile");
        return;
    }

    if (petData.uid !== userId && !res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    const images = [];
    for (let image of uploadedImages) {
        images.push(image.path);
    }

    const updatePet = {
        name,
        age,
        gender,
        type,
        breed,
        size,
        color,
        coatLength,
        trained,
        health,
        characteristics,
        giveaway,
        price,
        description,
        address: {
            street: street,
            city: city,
            state: state,
            country: country,
            postalCode: postal,
        },
    };

    if (images.length > 0) {
        updatePet.images = images;
    }

    try {
        pet.updatePet(petData._id, updatePet);
    } catch (err) {
        console.log(err);
    }

    if (!res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    res.redirect("/pets");
}

async function deletePet(req, res) {
    const petId = req.params.id;

    const pet = new Pet();
    const petData = await pet.getPetById(petId);

    if (!petData) {
        res.redirect("/pet-profile");
        return;
    }

    if (petData.uid !== res.locals.uid && !res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    const petDetails = await pet.getPetById(petId);

    for (let image of petDetails.images) {
        fs.unlink(image, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    pet.deletePet(petId);

    if (!res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    res.redirect("/pets");
}

async function getPetDetails(req, res) {
    const petId = req.params.id;

    const pet = new Pet();
    const petData = await pet.getPetById(petId);

    if (!petData) {
        res.redirect("/pet-profile");
        return;
    }

    const similarPets = await pet.getSimilarCharacteristics(
        petData._id,
        petData.characteristics
    );

    let isWishlisted;

    if (res.locals.uid) {
        const user = new User();
        const userData = await user.getUserDetails(res.locals.uid);
        isWishlisted = userData?.wishlist?.includes(petData._id.toString())
            ? true
            : false;
    }

    res.render("users/pet-details", {
        isWishlisted: isWishlisted,
        petData: petData,
        similarPets: similarPets,
    });
}

async function getWishlist(req, res) {
    const userId = res.locals.uid;
    const currentPage = req.query.page;

    const user = new User();
    const userData = await user.getUserDetails(userId);
    console.log(userData)

    if (!userData) {
        res.redirect("/login");
    }

    const pet = new Pet();
    const wishlistPets = [];

    for (let petId of userData.wishlist) {
        const petProfile = await pet.getPetById(petId);
        wishlistPets.push(petProfile);
    }

    const count = wishlistPets.length;
    const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

    res.render("users/wishlist", {
        wishlist: wishlistPets,
        pages,
        currentPage,
    });
}

async function addToWishlist(req, res) {
    const petId = req.params.id;
    const userId = res.locals.uid;

    if (!userId) {
        return res.redirect("/login");
    }

    const user = new User();
    const userData = await user.getUserDetails(userId);

    if (!userData.wishlist) {
        userData.wishlist = [petId];
    } else {
        if (userData.wishlist.includes(petId)) {
            userData.wishlist.splice(userData.wishlist.indexOf(petId), 1);
        } else {
            userData.wishlist.push(petId);
        }
    }

    user.updateUser(userId, userData);

    return res.redirect("/wishlist");
}

async function removeFromWishlist(req, res) {
    const petId = req.params.id;
    const userId = res.locals.uid;

    if (!userId) {
        return res.redirect("/login");
    }

    const user = new User();
    const userData = await user.getUserDetails(userId);

    const index = userData.wishlist.indexOf(petId);
    userData.wishlist.splice(index, 1);

    user.updateUser(userId, userData);

    return res.redirect("/wishlist");
}

async function getApplication(req, res) {
    const userId = res.locals.uid;
    if (!userId) {
        return res.redirect("/");
    }

    const formId = req.params.id;
    const adoptionForm = new Adoption();
    const application = await adoptionForm.getFormById(formId);

    if (!application) {
        res.redirect("/dashboard");
    }

    res.render("users/application", {
        petData: [],
        application: application,
    });
}

async function deleteApplication(req, res) {
    const formId = req.params.id;
    const userId = res.locals.uid;

    const adoptionForm = new Adoption();
    const application = await adoptionForm.getFormById(formId);

    if (!application) {
        return res.redirect("/applications/sent");
    }

    if (
        application.adopterId !== userId &&
        application.ownerId !== userId &&
        !res.locals.isAdmin
    ) {
        return res.redirect("/applications/sent");
    }

    await adoptionForm.deleteApplication(formId);
    if (!res.locals.isAdmin && application.adopterId === userId) {
        res.redirect("/applications/sent");
        return;
    }

    if (!res.locals.isAdmin && application.ownerId === userId) {
        res.redirect("/applications/received");
        return;
    }
    res.redirect("/applications");
    return;
}

async function acceptApplication(req, res) {
    const formId = req.params.id;
    const userId = res.locals.uid;
    const adoptionForm = new Adoption();
    const application = await adoptionForm.getFormById(formId);

    if (!application) {
        res.redirect("/applications/received");
    }

    if (application.ownerId !== userId && !res.locals.isAdmin) {
        res.redirect("/applications/received");
    }

    const pet = new Pet();
    const petData = await pet.getPetById(application.petId);

    if (!petData) {
        res.redirect("/applications/received");
    }

    // const user = new User();
    // const userData = await user.getUserDetails(application.userId);

    // if (!userData) {
    //     res.redirect("/applications/received");
    // }

    adoptionForm.acceptApplication(formId);

    // Change Pet profile to hidden
    // Change pet status to adopted
    // Change Pet owner to adopter
    await pet.updatePet(application.petId, {
        isHidden: true,
        status: "adopted",
        oldOwner: application.ownerId,
        uid: application.adopterId,
    });

    // Send email to user
    // const email = new Email();
    // email.sendAcceptedEmail(userData.email, petData.name);

    if (!res.locals.isAdmin) {
        res.redirect("/applications/received");
        return;
    }
    res.redirect("/applications");
}

async function rejectApplication(req, res) {
    const formId = req.params.id;
    const userId = res.locals.uid;
    const adoptionForm = new Adoption();
    const application = await adoptionForm.getFormById(formId);

    if (!application) {
        res.redirect("/applications/received");
    }

    if (application.ownerId !== userId && !res.locals.isAdmin) {
        res.redirect("/applications/received");
    }

    // const pet = new Pet();
    // const petData = await pet.getPetById(application.petId);

    // if (!petData) {
    //     res.redirect("/applications/received");
    // }

    // const user = new User();
    // const userData = await user.getUserDetails(application.userId);

    // if (!userData) {
    //     res.redirect("/applications/received");
    // }

    adoptionForm.rejectApplication(formId);

    // Send email to user
    // const email = new Email();
    // email.sendRejectedEmail(userData.email, petData.name);

    if (!res.locals.isAdmin) {
        res.redirect("/applications/received");
        return;
    }
    res.redirect("/applications");
}

async function getSentApplications(req, res) {
    const userId = res.locals.uid;
    const currentPage = req.query.page;

    const user = new User();
    const userData = await user.getUserDetails(userId);

    if (!userData) {
        res.redirect("/login");
    }

    const adoptionForm = new Adoption();
    const applications = await adoptionForm.getMySubmittedForms(userId);

    const pet = new Pet();
    for (let application of applications) {
        const owner = await user.getUserDetails(application.ownerId);
        application.owner = owner;
        const petDetails = await pet.getPetById(application.petId);
        application.pet = petDetails;
    }
    const count = applications.length;
    const { startFrom, perPage, pages } = pagination(count, currentPage, 2);

    res.render("users/applications-sent", {
        applications: applications,
        pages,
        currentPage,
    });
}

async function getReceivedApplications(req, res) {
    const userId = res.locals.uid;
    const currentPage = req.query.page;

    const user = new User();
    const userData = await user.getUserDetails(userId);

    if (!userData) {
        res.redirect("/login");
    }

    const adoptionForm = new Adoption();
    const applications = await adoptionForm.getMyReceivedForms(userId);

    const count = applications.length;
    const { startFrom, perPage, pages } = pagination(count, currentPage, 2);

    const pet = new Pet();
    for (let application of applications) {
        const owner = await user.getUserDetails(application.ownerId);
        application.owner = owner;
        const petDetails = await pet.getPetById(application.petId);
        application.pet = petDetails;
    }
    res.render("users/applications-received", {
        applications: applications,
        pages,
        currentPage,
    });
}

async function getAdopt(req, res) {
    const petId = req.params.id;
    const userId = res.locals.uid;

    if (!userId) {
        return res.redirect("/login");
    }

    // Fetch Pet Details
    const pet = new Pet();
    const petData = await pet.getPetById(petId);

    // Fetch Adopter Information
    const user = new User();
    const userData = await user.getUserDetails(userId);

    // Populate data on Adoption Form
    res.render("users/adoption-form", { petData, userData });
}

async function adoptPet(req, res) {
    const userId = res.locals.uid;
    const petId = req.params.id;

    const user = new User();
    const userData = await user.getUserDetails(userId);

    if (!userData) {
        res.redirect("/login");
        return;
    }

    // Store adoption form data on database
    const form = req.body;
    form.adopterId = userId;
    form.adoptionDate = new Date();
    form.userStatus = "Pending";
    form.petId = petId;
    const pet = new Pet();
    const { uid: ownerId, adoptionForms } = await pet.getPetById(petId);
    form.ownerId = ownerId;

    const aboutYou = form.aboutYou;
    const adoptReasonBrief = form.adoptReasonBrief;

    // Auto verify the form submitted
    form.score =
        (getSentiment(aboutYou).analysis4 +
            getSentiment(adoptReasonBrief).analysis4) /
        2;

    if (form.score < 0.5) {
        form.autoStatus = "Rejected";
    } else {
        form.autoStatus = "Approved";
    }

    const adoption = new Adoption();
    const formId = await adoption.createForm(form);

    // Show the form on owner's dashboard
    if (form.autoStatus === "Approved") {
        const pet = new Pet();
        const petData = await pet.getPetById(form.petId);
        if (!adoptionForms || adoptionForms.length === 0) {
            adoptionForms = [formId];
        } else {
            adoptionForms.push(formId);
        }
        pet.updatePet(form.petId, petData);
    }

    res.redirect("/applications/sent");
}

async function getScheduleMeet(req, res) {
    // Get Adopter details
    // Show the time when owner is available
}

async function scheduleMeet(req, res) {
    // Get Adopter details
    // Show the time when owner is available
    // Send the data to owner for confirmation
}

module.exports = {
    getSearch,
    getByType,
    getByBreed,
    getPetProfiles,
    getPetDetails,
    getPetAdd,
    addPet,
    getPetEdit,
    updatePet,
    deletePet,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getApplication,
    deleteApplication,
    acceptApplication,
    rejectApplication,
    getSentApplications,
    getReceivedApplications,
    getAdopt,
    adoptPet,
    getScheduleMeet,
    scheduleMeet,
};
