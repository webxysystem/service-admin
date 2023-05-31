import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: String,
  email: {type: String, required: true, unique: true},
  password: String,
  numberPhone: String,
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  moderator: Boolean,
  enabled: Boolean,
})
module.exports = mongoose.model('User', userSchema);