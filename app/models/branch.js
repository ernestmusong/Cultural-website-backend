const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BranchShema = new Schema ({
  name: String,
})

const Branch = model('Branch', BranchShema);

module.exports = Branch;
