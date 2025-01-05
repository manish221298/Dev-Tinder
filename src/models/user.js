const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: [4, "Minimum 4 letters required"],
    max: 8,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  skills: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
