const User = require("../models/user.model");
const Pet = require("../models/pet.model");
const authUtil = require("../util/authentication");
const bcrypt = require("bcrypt");
const Adoption = require("../models/adoptionForm.model");

async function getDashboard(req, res) {
    if (res.locals.isAuth && res.locals.isAdmin) {
        const user = new User();
        const userCount = await user.getCount();

        const pet = new Pet();
        const petCount = await pet.getCount();

        res.render("admin/dashboard", { userCount, petCount });
    } else if (res.locals.isAuth) {
        res.render("users/dashboard");
    } else {
        res.redirect("/login");
    }
}

async function getMyProfile(req, res) {
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

    if (!userData) {
        res.redirect("/login");
    }

    if (!userData.isAdmin) {
        const pet = new Pet();
        const petData = await pet.getMyPets(res.locals.uid);
        res.render("shared/profile", { userData, petData });
        return;
    }

    res.render("shared/profile", { userData, petData: null });
}

async function getEditProfile(req, res) {
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

    if (!userData) {
        res.redirect("/login");
    }

    res.render("shared/edit-profile", { userData });
}

async function updateProfile(req, res) {
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

    if (password && password !== confirmPassword) {
        console.log("Passwords do not match");
        res.render("shared/edit-profile", {
            error: "Passwords do not match.",
            userData: enteredData,
        });
        return;
    }

    let user = new User();
    const userData = await user.getUserDetails(res.locals.uid);

    if (!userData) {
        res.redirect("/login");
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

    const passwordIsRight = await bcrypt.compare(
        oldPassword,
        userData.password
    );

    if (oldPassword && !passwordIsRight) {
        console.log("Old password does not match");
        res.render("shared/edit-profile", {
            error: "Old password is incorrect.",
            userData: enteredData,
        });
        return;
    }

    if (password) {
        updatedUser.password = await bcrypt.hash(password, 12);
    }

    if (image) {
        updatedUser.image = image;
    }

    try {
        await user.updateUser(res.locals.uid, updatedUser);
        res.redirect("/my-profile");
    } catch (error) {
        res.render("shared/edit-profile", {
            error: error.message,
            userData: enteredData,
        });
    }
}

async function deleteProfile(req, res) {
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

    if (!userData) {
        res.redirect("/login");
    }

    const pet = new Pet();
    const adoptionForms = new Adoption();
    try {
        await pet.deleteMyPets(userData._id);
        await adoptionForms.deleteMyForms(userData._id);
        authUtil.destroyUserAuthSession(req);
        await user.deleteUser(userData._id);
    } catch (error) {
        console.log(error);
    }

    res.redirect("/login");
    return;
}

async function getUser(req, res) {
    const user = new User();
    const pet = new Pet();
    const userData = await user.getUserDetails(req.params.id);
    const petData = await pet.getMyPets(req.params.id);

    res.render("shared/user-profile", { userData, petData });
}

module.exports = {
    getDashboard,
    getMyProfile,
    getEditProfile,
    updateProfile,
    deleteProfile,
    getUser,
};
