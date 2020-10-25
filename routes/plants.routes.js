module.exports = (app) => {
  const plants = require("../controllers/plants.controller.js");

  // Retrieve all plant profiles
  app.get("/plants", plants.findAll);

  // Retrieve a single plant profile with plantID
  app.get("/plants/:plantName", plants.findOne);
};
