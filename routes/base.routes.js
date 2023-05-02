const express = require("express");
const router = express.Router();

const baseController = require("../controllers/base.controller");

// * Base Pages
router.get("/", baseController.getHome);
router.get("/about", baseController.getAbout);
router.get("/contact", baseController.getContact);
router.post("/contact", baseController.postContact);

// TODO: Remove this function
router.get("/adoption-form", baseController.getAdoptForm);

module.exports = router;
