import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
	name: String,
  email: String,
  moderatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  enabled: Boolean,
})
module.exports = mongoose.model('Model', modelSchema);