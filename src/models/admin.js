import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
	name: String,
  userName: String,
  email: String,
  password: String,
  imageProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  numberPhone: String, 
  enabled: Boolean,
  birthDate: Date,
  roles: Object,
  companies: Array
})
module.exports = mongoose.model('Admin', adminSchema);