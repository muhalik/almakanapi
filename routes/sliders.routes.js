const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const sliderController = require('../controllers/sliders.controllers');

// get Requests
router.get("/", sliderController.getAll);

// post Requests
router.post("/add", sliderController.addSlider);

// put Requests

// delete Requests
router.delete("/:_id", sliderController.deleteSlider);

module.exports = router;


