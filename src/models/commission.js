import mongoose from "mongoose";

const commisionSchema = new mongoose.Schema({
  amountIncome: Number,
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
})
module.exports = mongoose.model('Commission', commisionSchema);