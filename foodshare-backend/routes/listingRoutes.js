const express = require("express");
const router = express.Router();
const { createListing, getAvailableListings } = require("../controllers/listingController");
const { claimListing } = require("../controllers/listingController");

router.put("/claim/:id", claimListing);
router.post("/", createListing);
router.get("/", getAvailableListings);

module.exports = router;
