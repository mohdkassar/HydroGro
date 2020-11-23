module.exports = (app) => {
  const systems = require("../controllers/systemData.controller.js");

  // New System Values
  app.post("/system_data", systems.create);

  // Retrieve latest System Values
  app.get("/system_data/:userID", systems.getLatestSystemValues);

  app.post("/upload/:systemID", systems.upload);
};
