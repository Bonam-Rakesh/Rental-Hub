const Review = require("../models/Review");
const Listing = require("../models/Listing");

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      listing: req.params.listingId
    })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message
    });
  }
};

const createReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    if (!comment || !rating) {
      return res.status(400).json({
        message: "Comment and rating are required"
      });
    }

    const listing = await Listing.findById(req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    const existingReview = await Review.findOne({
      author: req.user,
      listing: req.params.listingId
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this listing"
      });
    }

    const review = await Review.create({
      comment,
      rating,
      author: req.user,
      listing: req.params.listingId
    });

    const populatedReview = await review.populate(
      "author",
      "username"
    );

    res.status(201).json({
      message: "Review created successfully",
      review: populatedReview
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create review",
      error: error.message
    });
  }
};
module.exports = {
  getReviews,
  createReview
};