import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
  lastAmount: Number,
  totalProfit: Number,
  amount: Number,
  commissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Commission" }], // {transactionId, amountIncome}
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  date: String, // example 11/02/2023,
  closed: Boolean
})
module.exports = mongoose.model('Income', commissionSchema);
