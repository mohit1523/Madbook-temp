const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  quote: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    required: true,
    unique: true,
  },
  emoji: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = new mongoose.model("User", userSchema);
