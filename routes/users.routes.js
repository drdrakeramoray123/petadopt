const express = require("express");
const router = express.Router();
const { uploadAvatar, uploadPets } = require("../util/uploader");

const userController = require("../controllers/user.controller");
const petController = require("../controllers/pet.controller");

router.get("/dashboard", userController.getDashboard);
router.get("/my-profile", userController.getMyProfile);
router.get("/edit-profile", userController.getEditProfile);
router.post(
    "/edit-profile",
    uploadAvatar.single("images"),
    userController.updateProfile
);
router.get("/profile/delete", userController.deleteProfile);

router.get("/user/:id", userController.getUser);

router.get("/pet-profile", petController.getPetProfiles);
router.get("/pet-profile/add", petController.getPetAdd);
router.post(
    "/pet-profile/add",
    uploadPets.array("images"),
    petController.addPet
);

router.get("/pet-profile/edit/:id", petController.getPetEdit);
router.post(
    "/pet-profile/edit/:id",
    uploadPets.array("images"),
    petController.updatePet
);
router.get("/pet-profile/delete/:id", petController.deletePet);

router.get("/wishlist", petController.getWishlist);

router.get("/applications/sent", petController.getSentApplications);
router.get("/applications/received", petController.getReceivedApplications);
router.get("/application/:id/approve", petController.acceptApplication);
router.get("/application/:id/reject", petController.rejectApplication);
router.get("/application/:id/delete", petController.deleteApplication);
router.get("/application/:id", petController.getApplication);

module.exports = router;
