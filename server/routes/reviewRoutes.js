const express = require("express");
const {
  getReviews,
  createReview
} = require("../controllers/reviewController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:listingId", getReviews);
router.post("/:listingId", protect, createReview);
module.exports = router;