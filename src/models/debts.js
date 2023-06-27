import mongoose from "mongoose";

const debtsSchema = new mongoose.Schema({
  amount: Number,
  weeklyDiscount: Number,
  payments: Array,
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  moderator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  isActive: Boolean,
},{ timestamps: true })
module.exports = mongoose.model('Debts', debtsSchema); 