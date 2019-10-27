const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: function(req, res, next) {
    userModel.create(
      {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        createdAt: new Date()
      },
      function(err, userInfo) {
        if (err) {
          res.status(404).send({
            status: "failed",
            message: "Duplicate email"
          });
        } else {
          const token = jwt.sign(
            { id: userInfo._id, role: userInfo.role },
            req.app.get("secretKey"),
            { expiresIn: "720h" }
          );
          res.json({
            status: "success",
            message: "user created",
            data: {
              user: {
                id: userInfo._id,
                email: userInfo.email,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                createdAt: userInfo.createdAt,
                role: userInfo.role
              },
              token: token
            }
          });
        }
      }
    );
  },

  login: function(req, res, next) {
    userModel.findOne({ email: req.body.email }, function(err, userInfo) {
      if (!userInfo) {
        res.status(404).send({
          status: "failed",
          message: "Inavalid email "
        });
      } else {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign(
            { id: userInfo._id, role: userInfo.role },
            req.app.get("secretKey"),
            { expiresIn: "720h" }
          );
          res.json({
            status: "success",
            message: "user found",
            data: {
              user: {
                _id: userInfo._id,
                email: userInfo.email,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                createdAt: userInfo.createdAt,
                role: userInfo.role
              },
              token: token
            }
          });
        } else {
          res.status(404).send({
            status: "failed",
            message: "Invalid password"
          });
        }
      }
    });
  },

  getPaginatedUsers: function(req, res) {
    let pageNo = parseInt(req.query.pageNo);
    let size = parseInt(req.query.size);
    let query = {};

    if (pageNo < 0 || pageNo === 0) {
      return res.status(404).send({
        status: "failed",
        message: "Invalid page number, should start with 1"
      });
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;

    userModel.find({}, {}, query, function(err, result) {
      if (err) {
        return res.status(404).send({
          status: "failed",
          message: "Couldn't send entries"
        });
      } else res.json({ status: "success", data: result });
    });
  }
};
