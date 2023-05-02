const express = require("express");
const router = express.Router();
const Sample = require("../../controllers/api/sample.controller");

router.get("/sample", Sample.generateSampleData);

module.exports = router;