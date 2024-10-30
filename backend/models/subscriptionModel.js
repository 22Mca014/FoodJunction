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
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Validates a 10-digit phone number
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{5,6}$/.test(v); // Validates 5 or 6-digit pincode
      },
      message: props => `${props.value} is not a valid pincode!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Subscription model
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
