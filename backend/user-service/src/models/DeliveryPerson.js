// backend/user-service/src/models/DeliveryPerson.js
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const deliveryPersonSchema = new Schema({
  userId:        { type: Types.ObjectId, ref: 'User', required: true },
  name:          { type: String, required: true },
  address:       { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }
  },
  email:         { type: String, required: true, unique: true },
  phone:         { type: String },
  vehicleNumber: { type: String, unique: true },
  license:       { type: String, unique: true },
  gender:        { type: String, enum: ['Male','Female'], default: 'Male' },
  isAvailable:   { type: Boolean, default: true },
  status:        { 
    type: String, 
    enum: ['Pending','Active','Inactive'], 
    default: 'Pending' 
  },
}, { timestamps: true });

// enable geo‑queries
deliveryPersonSchema.index({ location: '2dsphere' });

export default model('DeliveryPerson', deliveryPersonSchema);
