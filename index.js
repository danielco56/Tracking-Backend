const express = require("express");
const logger = require("morgan");
const users = require("./src/routes/user-routes");
const admin = require("./src/routes/admin-routes");
const location = require("./src/routes/location-routes");
const bodyParser = require("body-parser");
const mongoose = require("./src/config/database"); //database configuration
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.set("secretKey", "trackingbackend"); // jwt secret token

// connection to mongodb
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
app.use(logger('combined'))
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.get("/", function(req, res) {
  res.json({ message: "Server is up" });
});
app.use(cors({ origin: "http://localhost:8000" }));
// public routes
app.use("/api/auth", users);
// private routes
app.use("/api/location", validateUser, location);
app.use("/api/admin", validateUser, admin);

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  console.log(err);
  next(err);
});
// handle errors
app.use(function(err, req, res, next) {
  if (err.status === 404) res.status(404).json({ message: "Not found" });
  else
    res.status(500).json({
      message: "Something looks wrong, please try again !",
      error: err
    });
});

function validateUser(req, res, next) {
  jwt.verify(req.headers["authentication"], req.app.get("secretKey"), function(
    err,
    decoded
  ) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      req.body._id = decoded.id;
      req.body.role = decoded.role;
      next();
    }
  });
}

app.listen(3000, function() {
  console.log("Node server listening on port 3000");
});
