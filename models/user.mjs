import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    preferences: {
      gender: String,
      hometown: String,
      currentcity: String,
      needroommate: Boolean,
      otherbranch: Boolean,
      workex	: Number,
      distuni: Number,
      apttype: String,
      rentbudget: Number,
      alcohol: Boolean,
      foodpref: String,
      smoking: Boolean,
      culskills : String,
      lookingforroommate: Boolean,
      dept: String,
      hall: Boolean,
      maxppr: Number
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('users', userSchema);
