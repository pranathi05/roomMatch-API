import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('OTP', OTPSchema);
