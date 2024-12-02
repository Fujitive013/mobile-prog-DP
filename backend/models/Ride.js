const mongoose = require("mongoose");

// Define the ride schema
const rideSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, // Reference to the User
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    }, // Reference to the Driver
    pickup_location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    destination: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active",
    },
    fare: { type: Number, required: true },
    ride_type: {
        type: String,
        enum: ["standard", "premium"],
        default: "standard",
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    ride_rating: { type: Number, default: null }, // Reference rating from Review schema
});

// Create the Ride model
const Ride = mongoose.model("Ride", rideSchema, "rides");

module.exports = Ride;
