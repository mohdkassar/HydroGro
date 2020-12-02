var mongoose = require("mongoose");

var Schema = mongoose.Schema(
  {
    user_id: String,
    city: String,
    address: String,
    order: {},
  },
  { timestamps: { createdAt: "created_at" }, collection: "Orders" }
);

module.exports = mongoose.model("Orders", Schema);
