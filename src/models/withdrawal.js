import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
  amount: Number,
  reason: String,
  reviewBy: String,
  approvedBy:String,
  date: String // example 11/02/2023
})
module.exports = mongoose.model('Withdrawal', withdrawalSchema);
