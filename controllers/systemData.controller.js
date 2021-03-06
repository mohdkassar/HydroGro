const SystemData = require("../models/systemData.models");
const User = require("../models/users.models");
const spawn = require("child_process").spawn;
var moment = require("moment"); // require
const path = require("path");
const multer = require("multer");
const s3Controller = require("./s3Controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    //console.log(file);
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

//IMAGE PROCESSING PYTHON ALGORITHM
var pythonFunction = (imageURL) => {
  //console.log("IMAGE URL: " + imageURL);
  return new Promise(function (success, nosuccess) {
    const { spawn } = require("child_process");
    const pythonProcess = spawn("python3", [
      "/home/ubuntu/HydroGrow/Algo.py",
      imageURL,
    ]);
    pythonProcess.stdout.setEncoding("utf8");

    pythonProcess.stdout.on("data", function (data) {
      //console.log("data");

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

//UPLOAD IMAGE FUNCTION
exports.upload = (req, res) => {
  try {
    var s3Storage = multer.memoryStorage();
    var s3Upload = multer({ storage: s3Storage });

    s3Upload.single("image")(req, res, function (err) {
      //var extention = path.extname(req.file.originalname);
      var fileName = req.params.systemID + "-" + moment().format("MM-DD-YYYY");
      //console.log("FILE NAME: " + fileName);
      //UPLOAD TO S3
      s3Controller.uploadFile(req.file, fileName, function (s3Uploaded) {
        pythonFunction(s3Uploaded.Location).then((response) => {
          var response = response.replace(/(\r\n|\n|\r)/gm, "");
          var pixelCount = response.split(" ");
          let growthStage1 =
            Math.max(pixelCount[0], pixelCount[2], pixelCount[4]) / 1800;
          let growthStage2 =
            Math.max(pixelCount[1], pixelCount[3], pixelCount[5]) / 1800;

          if (growthStage1 > 1800 || growthStage2 > 1800) {
            console.log("System SetUp");
            console.log("----------------------------------");
            User.findOne({ systemID: req.params.userID })
              .then((user) => {
                if (!user) {
                  return res.status(404).send({
                    message: "User not found with id " + req.params.userID,
                  });
                }
                plantProfileModels
                  .findOne({ plant_name: user.tray1 })
                  .then((profile1) => {
                    if (!profile1) {
                      return res.status(404).send({
                        message: "Plant not found with name " + req.body.tray1,
                      });
                    }
                    plantProfileModels
                      .findOne({ plant_name: user.tray2 })
                      .then((profile2) => {
                        if (!profile2) {
                          return res.status(404).send({
                            message:
                              "Plant not found with name " + req.body.tray2,
                          });
                        }
                        var mqttMessage =
                          "1/" +
                          profile1.EC2_min +
                          "/" +
                          profile1.EC2_max +
                          "/" +
                          profile2.EC2_min +
                          "/" +
                          profile2.EC2_max +
                          "/" +
                          profile1.pH_min +
                          "/" +
                          profile1.pH_max +
                          "/" +
                          profile2.pH_min +
                          "/" +
                          profile2.pH_max;

                        mqttClinet.publish(
                          user.systemID,
                          JSON.stringify(mqttMessage) //convert number to string
                        );

                        console.log(mqttMessage);
                      })
                      .catch((err) => {
                        if (err.kind === "ObjectId") {
                          return res.status(404).send({
                            message:
                              "User not found with name " + req.body.tray2,
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
          }

          const systemData = new SystemData({
            user_id: req.params.systemID,
            dataType: "Image Upload",
            data: {
              pixelCount: {
                tray11: pixelCount[0],
                tray12: pixelCount[2],
                tray13: pixelCount[4],
                tray21: pixelCount[1],
                tray22: pixelCount[3],
                tray23: pixelCount[5],
              },
              growthStage1: growthStage1,
              growthStage2: growthStage2,
              filePath: s3Uploaded.Location,
            },
          });
          // Save System Data in the database
          systemData
            .save()
            .then((data) => {
              console.log(data);
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
          //console.log("DOCS");
          //console.log(docs);
          SystemData.find({ user_id: user.systemID, dataType: "Image Upload" })
            .sort({ created_at: -1 })
            .limit(1)
            .exec(function (err, imageDocs) {
              SystemData.find({
                user_id: user.systemID,
                dataType: "System Information",
              })
                .sort({ created_at: -1 })
                .limit(1)
                .exec(function (err, systemInfo) {
                  docs[0].data[0]["PlantName"] = user.tray1;
                  docs[0].data[1]["PlantName"] = user.tray2;
                  //console.log("IMAGEDOCS");
                  //console.log(imageDocs);
                  if (imageDocs[0] != null) {
                    docs[0].data[0]["filePath"] = imageDocs[0].data.filePath;
                    docs[0].data[1]["filePath"] = imageDocs[0].data.filePath;
                    //console.log(imageDocs[0].data.filePath);
                  }
                  //console.log("System Information");
                  //console.log(systemInfo);
                  var dataToSend = {
                    user_id: docs[0].user_id,
                    data: docs[0].data,
                  };
                  if (systemInfo[0] != null) {
                    dataToSend["System Status"] = systemInfo[0].data.status;
                    dataToSend["Solution 1"] = systemInfo[0].data.solution1;
                    dataToSend["Solution 2"] = systemInfo[0].data.solution2;
                    dataToSend["Solution 3"] = systemInfo[0].data.solution3;
                  }
                  res.send(dataToSend);
                });
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
