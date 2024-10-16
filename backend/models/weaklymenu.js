import mongoose from 'mongoose';

// Define the schema for the weekly menu
const weeklyMenuSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  breakfast: {
    type: String,
    required: true,
  },
  lunch: {
    type: String,
    required: true,
  },
  dinner: {
    type: String,
    required: true,
  }
});

// Create the model from the schema
const WeeklyMenu = mongoose.model('WeeklyMenu', weeklyMenuSchema);

export default WeeklyMenu;
