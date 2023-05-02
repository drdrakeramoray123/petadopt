const express = require("express");
const animalController = require("../controllers/animal.controller");
const router = express.Router();

// * Animal Information
router.get("/info/animals", animalController.getAnimals);
router.get("/info/animal/:breed", animalController.getAnimal);
// router.get("/info/species/:species", animalController.getSpeciesInfo);

// * Animal Recognition
router.get("/scan", animalController.getScan);
router.post("/scan", animalController.postScan);

module.exports = router;
