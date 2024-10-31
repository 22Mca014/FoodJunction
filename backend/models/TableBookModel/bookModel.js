import mongoose from 'mongoose';

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  date: { type: String, required: true },
  tableType: { type: String, required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.model('Booking', bookingSchema);