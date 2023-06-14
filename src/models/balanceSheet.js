import mongoose from "mongoose";

const balanceSheetSchema = new mongoose.Schema({
  totalProfit: Number,
  incomes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Income" }],
  //withdrawals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Withdrawal" }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  dateOpen: Date, 
  dateClose: Date, 
  closed: Boolean
})
module.exports = mongoose.model('BalanceSheet', balanceSheetSchema);
