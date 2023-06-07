import mongoose from "mongoose";

const accountMasterSchema = new mongoose.Schema({
  business: String,
  amountOrganization: Number,
  amountAdmin: Number,
  balance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'balanceSheet' }],
  accountBusiness: [{ type: mongoose.Schema.Types.ObjectId, ref: 'balanceSheet' }],
  computerSecurityFee: Number,
  enabled: Boolean
})
module.exports = mongoose.model('AccountMaster', accountMasterSchema);