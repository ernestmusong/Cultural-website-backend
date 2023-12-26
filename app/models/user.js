const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const User = model(
  "User",
  new Schema({
    title: String,
    firstName: String,
    lastName: String,
    username: {type: String, unique:true, required:true},
    email: String,
    branch: String,
    password: String,
    role: String, 
  })
);

module.exports = User;
