import mongoose from "mongoose";


// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  subscriptionType: {
    type: String,
    enum: ['7 days', '30 days'],  // Only allow these values
    required: true,
  },
  subscriptionPayment: {
    type: Number,
    required: true,
  },
  subscriptionStartDate: {
    type: Date,
    required: true,
  },
  subscriptionEndDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],  // Default to 'pending' before confirmation
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Subscription model
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;