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

module.exports = (app) => {
  const systems = require("../controllers/systemData.controller.js");

  // New System Values
  app.post("/system_data", systems.create);

  // Retrieve latest System Values
  app.get("/system_data/:userID", systems.getLatestSystemValues);

  app.post("/upload/:systemID", upload.single("image"), systems.upload);
};
