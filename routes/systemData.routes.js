const multer = require("multer");
const path = require("path");
var moment = require("moment"); // require

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
const upload = multer({ storage: storage, fileFilter: fileFilter });
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
  res.send(
    `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`
  );
});

module.exports = (app) => {
  const systems = require("../controllers/systemData.controller.js");

  // New System Values
  app.post("/system_data", systems.create);

  // Retrieve latest System Values
  app.get("/system_data/:userID", systems.getLatestSystemValues);

  app.post("/upload/:systemID", upload.single("image"), systems.upload);
};
