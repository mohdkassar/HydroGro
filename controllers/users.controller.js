const User = require("../models/users.models");
const mqttClinet = require("../mqtt/client");
const plantProfileModels = require("../models/plantProfile.models");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({
      message: "Name can not be empty",
    });
  }
  // Create a User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    systemID: req.body.systemID,
    username: req.body.username,
    password: req.body.password,
  });

  // Save User in the database
  user
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user.",
      });
    });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.find()
    .then((users) => {
      mqttClinet.publish(
        "test",
        JSON.stringify({
          message: "data",
          SystemID: users[0]._id,
          Data: {
            EC: "0.4",
            pH: "6.8",
          },
        }) //convert number to string
      );
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.signin = (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (!user)
      res.status(400).json({ message: "Login failed, user not found" });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch)
        return res.status(400).json({
          message: "Wrong Password",
        });
      res.status(200).json({ SystemID: user.systemID });
    });
  });
};

exports.setup = (req, res) => {
  User.findOne({ systemID: req.params.userID })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userID,
        });
      }
      plantProfileModels
        .findOne({ plant_name: req.body.tray1 })
        .then((profile1) => {
          if (!profile1) {
            return res.status(404).send({
              message: "Plant not found with name " + req.body.tray1,
            });
          }
          plantProfileModels
            .findOne({ plant_name: req.body.tray2 })
            .then((profile2) => {
              if (!profile2) {
                return res.status(404).send({
                  message: "Plant not found with name " + req.body.tray2,
                });
              }
              var mqttMessage = {
                message: "SystemSetup",
                SystemID: user.systemID,
                Data: [
                  {
                    Tray1: {
                      EC1_min: profile1.EC1_min,
                      EC1_max: profile1.EC1_max,
                      EC2_min: profile1.EC2_min,
                      EC2_max: profile1.EC2_max,
                      EC3_min: profile1.EC3_min,
                      EC3_max: profile1.EC3_max,
                      pH_min: profile1.pH_min,
                      pH_max: profile1.pH_max,
                    },
                  },
                  {
                    Tray2: {
                      EC1_min: profile2.EC1_min,
                      EC1_max: profile2.EC1_max,
                      EC2_min: profile2.EC2_min,
                      EC2_max: profile2.EC2_max,
                      EC3_min: profile2.EC3_min,
                      EC3_max: profile2.EC3_max,
                      pH_min: profile2.pH_min,
                      pH_max: profile2.pH_max,
                    },
                  },
                ],
              };
              mqttClinet.publish(
                user.systemID,
                JSON.stringify(mqttMessage) //convert number to string
              );
              res.status(200).json(mqttMessage);
            })
            .catch((err) => {
              if (err.kind === "ObjectId") {
                return res.status(404).send({
                  message: "User not found with name " + req.body.tray2,
                });
              }
              return res.status(500).send({
                message: "User not found with name " + req.body.tray2,
              });
            });
        })
        .catch((err) => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({
              message: "User not found with name " + req.body.tray1,
            });
          }
          return res.status(500).send({
            message: "User not found with name " + req.body.tray1,
          });
        });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.userID,
        });
      }
      return res.status(500).send({
        message: "User not found with id " + req.params.userID,
      });
    });
};

// Find a single user using ID
exports.findOne = (req, res) => {
  User.findOne({ systemID: req.params.userID })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userID,
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.userID,
        });
      }
      return res.status(500).send({
        message: "User not found with id " + req.params.userID,
      });
    });
};

// Update a User identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.name) {
    return res.status(400).send({
      message: "User name can not be empty",
    });
  }

  // Find user and update it with the request body
  User.findByIdAndUpdate(
    req.params.userID,
    {
      name: req.body.name,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userID,
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.userID,
        });
      }
      return res.status(500).send({
        message: "User not found with id " + req.params.userID,
      });
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.userID)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userID,
        });
      }
      res.send({ message: "Note deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "User not found with id " + req.params.userID,
        });
      }
      return res.status(500).send({
        message: "User not found with id " + req.params.userID,
      });
    });
};
