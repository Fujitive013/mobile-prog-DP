const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    passenger_name: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
    payment_status: { type: String, required: true },
    payment_method: { type: String, required: true },
    fare: { type: Number, required: true },
    currentAddress: { type: String, required: true },
    destination: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
