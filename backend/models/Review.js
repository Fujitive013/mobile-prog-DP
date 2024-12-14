const mongoose = require("mongoose");

// Define the review schema
const reviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    passengerName: { type: String, required: true },
    driver_name: { type: String, required: true },
    ride_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
});

// Create the Review model
const Review = mongoose.model("Review", reviewSchema, "reviews");

module.exports = Review;
