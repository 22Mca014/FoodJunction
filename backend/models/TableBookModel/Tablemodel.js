import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  count: { type: Number, required: true },
  available: { type: Map, of: Number, default: {} },
});

export default mongoose.model('Table', tableSchema);
