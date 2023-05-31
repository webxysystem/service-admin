import mongoose from "mongoose";

const resetPassSchema = new mongoose.Schema({
  email: String,
  token: String
})
module.exports = mongoose.model('ResetPass', resetPassSchema);