import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   type: {
      type: String,
      enum: ['simple', 'advanced', 'premium', 'admin'],
      default: 'simple'
   },
   isConfirmed: {
      type: Boolean,
      default: false
   }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
