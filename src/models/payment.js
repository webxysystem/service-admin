import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: Number,
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Commission' },
  commissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commission' }],
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
});

module.exports = mongoose.model('Payment', paymentSchema);