// backend/user-service/src/models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:    { type: String, required: true },
  email:   { type: String, required: true, unique: true },
  phone:   { type: String, unique: true },
  status:  { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
