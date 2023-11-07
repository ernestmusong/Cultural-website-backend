const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const User = model(
  "User",
  new Schema({
    title: String,
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    branch: String,
    socialGroup: String,
    password: String,
    role: String, 
  })
);

module.exports = User;
