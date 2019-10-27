const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location-controller");
const authorizeAdmin = require("../../_helpers/authorize");

router.post("/addLocation", locationController.addLocation);
router.get("/getLocation", locationController.getLocationById);
router.post("/updateLocation", locationController.updateLocationById);
router.delete("/removeLocation", locationController.removeLocationById);

module.exports = router;
