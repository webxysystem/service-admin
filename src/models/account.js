import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  amount: Number,
  frozenAmount: Number,
  commissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commission' }],
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  lastPayment: String,
  enabled: Boolean
})
module.exports = mongoose.model('Account', accountSchema); 