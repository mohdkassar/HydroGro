const SystemData = require("../models/systemData.models");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    return res.status(400).send({
      message: "Name can not be empty",
    });
  }

  // Create a Note
  const systemData = new SystemData({
    user_id: req.body.user_id,
    data: req.body.data,
  });

  // Save Note in the database
  systemData.save();
  // .then((data) => {
  //   res.send(data);
  // })
  // .catch((err) => {
  //   res.status(500).send({
  //     message: err.message || "Some error occurred while creating the user.",
  //   });
  // });
};
