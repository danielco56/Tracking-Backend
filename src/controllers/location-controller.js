const locationModel = require("../models/location");

module.exports = {
  addLocation: function(req, res, err) {
    locationModel.create(
      {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        createdAt: new Date(),
        userId: req.body._id
      },
      function(err, location) {
        if (err) {
          res.status(404).send({
            status: "failed"
          });
        } else {
          res.json({
            status: "success",
            message: "location added",
            data: {
              location: {
                id: location._id,
                latitude: location.latitude,
                longitude: location.longitude,
                createdAt: location.createdAt,
                userId: location.userId
              }
            }
          });
        }
      }
    );
  },
  getLocationById: function(req, res) {
    locationModel.findById(req.body.id, function(err, location) {
      if (err || !location) {
        res.status(404).send({
          status: "failed",
          message: "Location not found"
        });
      } else {
        res.json({
          status: "success",
          data: {
            location
          }
        });
      }
    });
  },
  updateLocationById: function(req, res) {
    locationModel.findByIdAndUpdate(
      req.body.id,
      {
        latitude: req.body.latitude,
        longitude: req.body.longitude
      },
      { new: true },
      function(err, location) {
        if (err || !location) {
          res.status(404).send({
            status: "failed",
            message: "Location not found"
          });
        } else {
          res.json({
            status: "success",
            message: "Location was updated",
            data: {
              location
            }
          });
        }
      }
    );
  },
  removeLocationById: function(req, res) {
    locationModel.findByIdAndRemove(req.body.id, function(err) {
      if (err) {
        res.status(404).send({
          status: "failed",
          message: "Couldn't delete this location"
        });
      } else {
        res.json({
          status: "success",
          message: "Location was deleted"
        });
      }
    });
  }
};
