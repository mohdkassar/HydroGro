const SystemData = require("../models/systemData.models");
const User = require("../models/users.models");
const spawn = require("child_process").spawn;

exports.upload = (req, res) => {
  try {
    const pythonProcess = spawn("python3", ["../Algo.py", "0.jpg"]);
    pythonProcess.stdout.on("data", (data) => {
      console.log(data);
      return res.status(201).json({
        message: "File uploded successfully",
      });
    });
  } catch (error) {
    console.error(error);
  }
};
// Create and Save a new System Data
exports.create = (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    return res.status(400).send({
      message: "Name can not be empty",
    });
  }
  // Create new System Data
  const systemData = new SystemData({
    user_id: req.body.user_id,
    data: req.body.data,
  });
  // Save System Data in the database
  systemData
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

exports.getLatestSystemValues = (req, res) => {
  User.findOne({ systemID: req.params.userID })
    .then((user) => {
      if (!user) {
      }
      SystemData.find({ user_id: user.systemID })
        .sort({ created_at: -1 })
        .limit(1)
        .exec(function (err, docs) {
          docs[0].data[0].PlantName = user.tray1;
          docs[0].data[1].PlantName = user.tray2;
          res.send(docs);
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
