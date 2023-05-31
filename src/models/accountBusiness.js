import mongoose from "mongoose";

const accountBusinessSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  platformCommission: Number,
  enabled: Boolean
})
module.exports = mongoose.model('AccountBusiness', accountBusinessSchema);