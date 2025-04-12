const mongoose = require("mongoose");

const foodListingSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  foodName: String,
  quantity: String,
  expiryTime: Date,
  pickupTime: Date,
  location: {
    address: String,
    lat: Number,
    lng: Number
  },
  status: { type: String, enum: ["available", "requested", "accepted", "completed"], default: "available" },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null } // 👈 Add this

});

module.exports = mongoose.model("FoodListing", foodListingSchema);
