const mongoose = require("mongoose");

// Define the driver schema
const driverSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User collection
    bike_model: { type: String, required: true },
    license_number: { type: String, required: true, unique: true },
    rating: { type: Number, default: 0 }, // Average rating
    active_status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    location: { 
        latitude: { type: Number, required: false },
        longitude: { type: Number, required: false },
    }, // Optional location
    total_rides: { type: Number, default: 0 },
});

// Create the Driver model
const Driver = mongoose.model("Driver", driverSchema, "drivers");

module.exports = Driver;
