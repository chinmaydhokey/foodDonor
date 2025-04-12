const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
  .catch((err) => console.error(err));
