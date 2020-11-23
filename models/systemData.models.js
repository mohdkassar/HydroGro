var mongoose = require("mongoose");

var Schema = mongoose.Schema(
  {
    user_id: String,
    dataType: String,
    data: {},
  },
  { timestamps: { createdAt: "created_at" }, collection: "SystemDetails" }
);

module.exports = mongoose.model("SystemDetails", Schema);
