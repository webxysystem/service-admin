import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  amount: Number,
  frozenAmount: Number,
  commissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commission' }],
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  enabled: Boolean
})
module.exports = mongoose.model('Account', accountSchema); 