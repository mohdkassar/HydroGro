var mongoose = require("mongoose");

var Schema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    name: String,
    image: String,
    systemID: {
      type: Number,
      unique: true,
      required: [true, "can't be blank"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", Schema);
