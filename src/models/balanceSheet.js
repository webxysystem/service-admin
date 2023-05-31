import mongoose from "mongoose";

const balanceSheetSchema = new mongoose.Schema({
  lastAmount: Number,
  totalProfit: Number,
  amount: Number,
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "AccountBusiness" }], // {account, amount}
  clientAmoutTotalAvailable: Number, // - tax
  clientAmoutTotalFrozen: Number, // - tax
  incomes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Income" }],
  withdrawals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Withdrawal" }],
  date: String, // example 02/2023
  closed: Boolean
})
module.exports = mongoose.model('BalanceSheet', balanceSheetSchema);

/** 
  balance correcto --> accounts.amount++ == amount + clientAmoutTotalAvailable  + clientAmoutTotalFrozen  - withdrawals.amount++;
 */