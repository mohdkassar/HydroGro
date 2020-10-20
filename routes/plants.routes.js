module.exports = (app) => {
  const plants = require("../controllers/plants.controller.js");

  // Retrieve all Notes
  app.get("/plants", plants.findAll);

  // Retrieve a single Note with noteId
  app.get("/plants/:plantID", plants.findOne);
};
