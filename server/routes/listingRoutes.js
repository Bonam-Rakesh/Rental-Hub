const express = require("express");
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing
} = require("../controllers/listingController");

const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListing);

router.post("/", protect, createListing);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);

module.exports = router;