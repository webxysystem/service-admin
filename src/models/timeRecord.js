import mongoose from "mongoose";

const timeRecordSchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
	day: String,
  seconds: Number,
  lastInteraction: Date
})
module.exports = mongoose.model('TimeRecord', timeRecordSchema);