const FoodListing = require("../models/FoodListing");

exports.createListing = async (req, res) => {
  try {
    const listing = new FoodListing(req.body);
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ error: "Error creating listing" });
  }
};

exports.getAvailableListings = async (req, res) => {
  try {
    const listings = await FoodListing.find({ status: "available" });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching listings" });
  }
};


exports.claimListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngoId } = req.body;

    const listing = await FoodListing.findById(id);

    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.status !== "available") {
      return res.status(400).json({ message: "This listing is not available to claim" });
    }

    listing.status = "claimed";
    listing.claimedBy = ngoId;
    await listing.save();

    res.status(200).json({ message: "Listing successfully claimed", listing });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
