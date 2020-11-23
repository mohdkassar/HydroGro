const SystemData = require("../models/systemData.models");
const User = require("../models/users.models");
const spawn = require("child_process").spawn;
var moment = require("moment"); // require
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      req.params.systemID +
        "-" +
        moment().format("MM-DD-YYYY") +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var pythonFunction = (fileName, extention) => {
  console.log("File Name: " + fileName);
  return new Promise(function (success, nosuccess) {
    const { spawn } = require("child_process");
    const pythonProcess = spawn("python3", [
      "/home/ubuntu/HydroGrow/Algo.py",
      fileName + "-" + moment().format("MM-DD-YYYY") + extention,
    ]);
    pythonProcess.stdout.setEncoding("utf8");

    pythonProcess.stdout.on("data", function (data) {
      console.log("dataa");

      success(data);
    });
    pythonProcess.stderr.setEncoding("utf8");

    pythonProcess.stderr.on("data", (data) => {
      console.log("err");
      nosuccess(data);
    });

    console.log("PROCESS PID: " + pythonProcess.pid);
  });
};

exports.upload = (req, res) => {
  try {
    const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
      "image"
    );
    console.log(req.file);

    upload(req, res, function (err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were any

      if (req.fileValidationError) {
        return res.send(req.fileValidationError);
      } else if (!req.file) {
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }

      // Display uploaded image for user validation
      var extention = path.extname(req.files.image.name);
      var fileName =
        req.params.systemID + "-" + moment().format("MM-DD-YYYY") + extention;
      console.log(fileName);

      pythonFunction(req.params.systemID, extention).then((response) => {
        var pixelCount = response.split(" ");
        for (var i = 0; i < pixelCount.length; i++) {
          console.log(pixelCount[i]);
          console.log("-----");
        }
        const systemData = new SystemData({
          user_id: req.params.systemID,
          dataType: "Image Upload",
          data: {
            pixelCount: pixelCount,
            filePath: fileName,
          },
        });
        // Save System Data in the database
        systemData
          .save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the user.",
            });
          });
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
      SystemData.find({ user_id: user.systemID, dataType: "Sensor Reading" })
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
