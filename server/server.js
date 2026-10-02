const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const tls = require("tls");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const secureContext = tls.createSecureContext({
  minVersion: "TLSv1.2",
  maxVersion: "TLSv1.2"
});

mongoose
  .connect(process.env.MONGODB_URI, {
    tls: true,
    secureContext
  })
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

const listingRoutes = require("./routes/listingRoutes");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/listings", listingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Rental Hub API 🚀"
  });
});

app.listen(PORT, () => {
  console.log(`Rental Hub server running on http://localhost:${PORT}`);
});