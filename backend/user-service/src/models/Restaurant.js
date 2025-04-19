// backend/user-service/src/models/Restaurant.js
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantName:  { type: String },
  restaurantOwner: { type: String, required: true },
  address:         { type: String },
  phone:           { type: String },
  email:           { type: String, required: true, unique: true },
  category:        { type: String },
  items: [
    {
      name:        { type: String, required: true },
      price:       { type: Number, required: true },
      description: { type: String },
      isAvailable: { type: Boolean, default: true },
    }
  ],
  status:          { type: String, enum: ["Active", "Inactive", "Pending"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
