// backend/user-service/src/models/Customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  userId:              { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:                { type: String, required: true },
  address:             { type: String },
  phone:               { type: String, sparse: true },
  email:               { type: String, required: true, unique: true },
  favoriteRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
  orderHistory: [
    {
      orderId:     { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      date:        { type: Date, default: Date.now },
      totalAmount: { type: Number, required: true },
    }
  ],
  status:              { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
