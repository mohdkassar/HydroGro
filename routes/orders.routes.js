module.exports = (app) => {
  const orders = require("../controllers/orders.controller");

  app.get("/orders", orders.findAll);

  app.post("/orders", orders.create);
};
