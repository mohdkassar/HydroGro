module.exports = (app) => {
  const systems = require("../controllers/systemData.controller.js");

  // Create a new Note
  app.post("/system_data", systems.create);
};
