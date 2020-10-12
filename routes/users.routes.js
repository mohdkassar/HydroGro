module.exports = (app) => {
  const users = require("../controllers/users.controller.js");

  // Create a new Note
  app.post("/users", users.create);

  // Retrieve all Notes
  app.get("/users", users.findAll);

  // Retrieve a single Note with noteId
  app.get("/users/:userID", users.findOne);

  // Update a Note with noteId
  app.put("/users/:userID", users.update);

  // Delete a Note with noteId
  app.delete("/users/:userID", users.delete);
};
