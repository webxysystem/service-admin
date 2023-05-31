import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
  moderator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  amount: Number,
  client: String,
  service: String,
  channel: String,
  voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  type: Object,
  createdAt: Date
});
module.exports = mongoose.model("Transaction", transactionSchema);
