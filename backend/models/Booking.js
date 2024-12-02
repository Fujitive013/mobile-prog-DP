const mongoose = require("mongoose");

// Define the booking schema
const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ride_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    booking_time: { type: Date, default: Date.now },
    payment_status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    payment_method: { type: String, enum: ["cash", "card"], default: "cash" },
});

// Create the Booking model
const Booking = mongoose.model("Booking", bookingSchema, "bookings");

module.exports = Booking;
