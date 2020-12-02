const ordersModel = require("../models/orders.models");

exports.findAll = (req, res) => {
  ordersModel
    .find()
    .then((orders) => {
      // mqttClinet.publish(
      //   "test",
      //   JSON.stringify("count") //convert number to string
      // );
      res.send(orders);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving orders.",
      });
    });
};

// Create and Save a new Order
exports.create = (req, res) => {
  // Validate request
  if (!req.body.address) {
    return res.status(400).send({
      message: "Address can not be empty",
    });
  }
  // Create an Order
  const order = new ordersModel({
    city: req.body.city,
    address: req.body.address,
    order: req.body.order,
    user_id: req.body.systemID,
  });

  // Save order in the database
  order
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the order.",
      });
    });
};
