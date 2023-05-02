const multer = require("multer");

const storageConfigAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/avatars");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const storageConfigPets = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/pets");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const storageConfigAnimals = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/animals");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const uploadAvatar = multer({
    storage: storageConfigAvatar,
});

const uploadAnimals = multer({
    storage: storageConfigAnimals,
});

const uploadPets = multer({
    storage: storageConfigPets,
});

module.exports = {
    uploadAvatar,
    uploadAnimals,
    uploadPets,
};
