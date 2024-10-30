import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['couple', 'family'] },
  capacity: { type: Number, required: true },
  count: { type: Number, required: true },
  available: { type: Map, of: Number, default: {} },
  date: { type: Date, required: true } // New field for daily tracking
});

export default mongoose.model('Table', tableSchema);
