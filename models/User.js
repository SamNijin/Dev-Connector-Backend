const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  lastUpdateDate: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = user = mongoose.model("users", userSchema);
