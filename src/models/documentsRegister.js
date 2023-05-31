import mongoose from "mongoose";

const documentsRegisterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  process: Boolean,
  approved: Boolean
})
module.exports = mongoose.model('DocumentsRegister', documentsRegisterSchema);