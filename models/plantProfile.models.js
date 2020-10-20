var mongoose = require("mongoose");

var Schema = mongoose.Schema(
  {
    plant_name: {
      type: String,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z]+$/, "is invalid"],
      index: true,
    },
    EC1_min: Number,
    EC1_max: Number,
    EC2_min: Number,
    EC2_max: Number,
    EC3_min: Number,
    EC3_max: Number,
    pH_min: Number,
    pH_max: Number,
  },
  { timestamps: true, collection: "PlantProfile" }
);

module.exports = mongoose.model("PlantProfile", Schema);
