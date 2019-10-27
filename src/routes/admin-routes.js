const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const authorizeAdmin = require("../../_helpers/authorize");

router.get(
  "/getPaginatedUsers",
  authorizeAdmin,
  userController.getPaginatedUsers
);

module.exports = router;
