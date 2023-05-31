import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  items: Array,
  total: Number,
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
  isSend: Boolean,
  isArrived: Boolean,
  isReceived: Boolean,
  isClientAccording: Boolean,
  active: Boolean,
  comments: Array,
  address: String
})
module.exports = mongoose.model('Billing', billingSchema);