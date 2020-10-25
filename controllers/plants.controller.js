const plantProfileModels = require("../models/plantProfile.models");

exports.systemSetup = (req, res) => {};

exports.findAll = (req, res) => {
  plantProfileModels
    .find()
    .then((users) => {
      // mqttClinet.publish(
      //   "test",
      //   JSON.stringify("count") //convert number to string
      // );
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a single user using ID
exports.findOne = (req, res) => {
  plantProfileModels
    .findOne({ plant_name: req.params.plantName })
    .then((profile) => {
      if (!profile) {
        return res.status(404).send({
          message: "User not found with name " + req.params.plantName,
        });
      }
      res.send(profile);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with name " + req.params.plantName,
        });
      }
      return res.status(500).send({
        message: "User not found with name " + req.params.plantName,
      });
    });
};
