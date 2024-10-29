import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  tableType: { type: String, required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.model('Booking', bookingSchema);
