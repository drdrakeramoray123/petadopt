const express = require("express");
const router = express.Router();
const { uploadAnimals, uploadAvatar } = require("../util/uploader");

const AdminController = require("../controllers/admin.controller");
const PetController = require("../controllers/pet.controller");

router.get("/messages", AdminController.getAllMessages);
router.get("/message/:id", AdminController.getMessage);
router.get("/message/delete/:id", AdminController.deleteMessage);

router.get("/users", AdminController.getAllUsers);
router.get("/user/:id/edit", AdminController.getUserDetails);
router.post(
    "/user/:id/edit",
    uploadAvatar.single("images"),
    AdminController.updateUserDetails
);
router.get("/user/delete/:id", AdminController.deleteUser);

router.get("/pets", PetController.getPetProfiles);

router.get("/animals", AdminController.getAllAnimals);
router.get("/animal/add", AdminController.getAddAnimal);
router.post(
    "/animal/add",
    uploadAnimals.array("images"),
    AdminController.addAnimal
);
router.get("/animal/:id", AdminController.getAnimal);
router.get("/animal/:id/edit", AdminController.getUpdateAnimal);
router.post(
    "/animal/:id/edit",
    uploadAnimals.array("images"),
    AdminController.updateAnimal
);
router.get("/animal/:id/delete", AdminController.deleteAnimal);

router.get("/applications", AdminController.getApplications);
router.get("/adoptions", AdminController.getAdopted);

module.exports = router;
