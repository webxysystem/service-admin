import mongoose from "mongoose";

const manualPaySchema = new mongoose.Schema({
  userName: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userIdentification: String,
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
  currency: String,
  amount: Number,
  capture: String,
  verify: Boolean,
  approved: Boolean,
  createdAt: Date
})
module.exports = mongoose.model('ManualPay', manualPaySchema); 