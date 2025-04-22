// backend/user-service/src/models/Customer.js
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const customerSchema = new Schema({
  userId:              { type: Types.ObjectId, ref: 'User', required: true },
  name:                { type: String, required: true },
  address:             { type: String },
  phone:               { type: String },
  email:               { type: String, required: true, unique: true },
  favoriteRestaurants: [{ type: Types.ObjectId, ref: 'Restaurant' }],
  orderHistory: [{
    orderId:     { type: Types.ObjectId, ref: 'Order' },
    date:        { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
  }],
  status:              { type: String, enum: ['Active','Inactive'], default: 'Active' },
}, { timestamps: true });

export default model('Customer', customerSchema);
