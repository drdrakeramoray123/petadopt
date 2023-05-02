const express = require("express");
const router = express.Router();
const Pet = require("../controllers/pet.controller");

// * Find Pages
router.get("/find", Pet.getSearch);

router.get("/find/:type", Pet.getByType);
router.get("/find/breed/:breed", Pet.getByBreed);

// * Pet Recommendation
// router.get("/recommend", baseController.getRecommend);

router.get("/pet-details/:id", Pet.getPetDetails);
router.get("/pet-details/:id/adopt", Pet.getAdopt);
router.post("/pet-details/:id/adopt", Pet.adoptPet);

router.get("/wishlist/:id", Pet.addToWishlist);
router.get("/wishlist/:id/remove", Pet.removeFromWishlist);
router.get("/pet/:id/meet", Pet.getScheduleMeet);
router.post("/pet/:id/meet", Pet.scheduleMeet);

module.exports = router;
