const Listing = require("../models/Listing");

const getListings = async (req, res) => {
  try {
    const {
      location,
      category,
      minPrice,
      maxPrice
    } = req.query;

    const filter = {};

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i"
      };
    }

    if (category) {
      filter.category = {
        $regex: category,
        $options: "i"
      };
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const listings = await Listing.find(filter)
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch listings",
      error: error.message
    });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner", "username email");

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch listing",
      error: error.message
    });
  }
};

const createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      owner: req.user
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create listing",
      error: error.message
    });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }
    if (listing.owner.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You can only update your own listings"
      });
    }

    Object.assign(listing, req.body);

    const updatedListing = await listing.save();

    res.status(200).json({
      message: "Listing updated successfully",
      listing: updatedListing
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update listing",
      error: error.message
    });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }
    if (listing.owner.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You can only delete your own listings"
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      message: "Listing deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete listing",
      error: error.message
    });
  }
};
module.exports = {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing
};