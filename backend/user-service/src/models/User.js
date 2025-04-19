import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, required: true, enum: ['admin','restaurant','delivery','customer'] },
  status:   { type: String, enum: ['Pending','Active','Inactive'], default: 'Pending' }
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = bcrypt.hash(this.password, 12);
  }
});

UserSchema.methods.matchPassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', UserSchema);
