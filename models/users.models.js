var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
let SALT = 10;
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
    password: {
      type: String,
      required: [true, "can't be blank"],
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

Schema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(SALT, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

Schema.methods.comparePassword = function (candidatePassword, checkpassword) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return checkpassword(err);
    checkpassword(null, isMatch);
  });
};
module.exports = mongoose.model("User", Schema);
