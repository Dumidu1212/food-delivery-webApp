// backend/user-service/src/models/Admin.js
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const adminSchema = new Schema({
  userId: { 
    type: Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name:    { type: String, required: true },
  email:   { type: String, required: true, unique: true },
  phone:   { type: String, unique: true },
  status:  { 
    type: String, 
    enum: ['Active','Inactive'], 
    default: 'Active' 
  },
}, { timestamps: true });

export default model('Admin', adminSchema);
