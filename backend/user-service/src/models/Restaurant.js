// backend/user-service/src/models/Restaurant.js
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const restaurantSchema = new Schema({
  userId:         { type: Types.ObjectId, ref: 'User', required: true },
  restaurantName: { type: String },
  restaurantOwner:{ type: String },
  address:        { type: String },
  phone:          { type: String },
  email:          { type: String, required: true, unique: true },
  category:       { type: String },
  items: [{
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
  }],
  status:         { 
    type: String, 
    enum: ['Pending','Active','Inactive'], 
    default: 'Pending' 
  },
}, { timestamps: true });

export default model('Restaurant', restaurantSchema);
