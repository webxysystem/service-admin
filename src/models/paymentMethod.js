import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  title: String,
  user: String,
  password: String,
  amount: Number,
  enabled: Boolean,
  paymentTax: Number,
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  accountBusiness:
    { type: mongoose.Schema.Types.ObjectId, ref: 'AccountBusiness' },
  private: Boolean
})
module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
