import mongoose from "mongoose";

const requestPaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
  amount: Number,
  accountNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  identificatorWallet: String,
  verify: Boolean,
  approved: Boolean,
  createdAt: Date
})
module.exports = mongoose.model('RequestPayment', requestPaymentSchema);