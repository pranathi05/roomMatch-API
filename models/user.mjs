import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    preferences: {
      age: Number,
      gender: String,
      residence: String,
      rent: {
        from: Number,
        to: Number,
      },
      guestsAllowed: Boolean,
      smokingAllowed: Boolean,
      joining: Number,
      idealLocation: String,
      isStudent: Boolean,
      sleepTime: String,
      mealStatus: Boolean,
      url : String
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('users', userSchema);
