const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["donor", "ngo", "admin"], default: "donor" },
  address: String,
  phone: String,
  isVerified: { type: Boolean, default: false },
  documents: [String] // For NGOs
});

module.exports = mongoose.model("User", userSchema);
