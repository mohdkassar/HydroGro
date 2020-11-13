module.exports = (app) => {
  const users = require("../controllers/users.controller.js");

  // Create a new User
  app.post("/users", users.create);

  // Retrieve all Users
  app.get("/users", users.findAll);

  // Retrieve a single User with userID
  app.get("/users/:userID", users.findOne);

  // User login
  app.post("/users/login", users.signin);

  // System SetUp
  app.post("/users/system_setup/:userID", users.setup);

  // Update a User with userID
  app.put("/users/:userID", users.update);

  // Delete a User with userID
  app.delete("/users/:userID", users.delete);
};
