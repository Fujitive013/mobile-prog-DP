const mongoose = require("mongoose");

// Define the address sub-schema
const addressSchema = new mongoose.Schema({
    street: { type: String },
    barangay: { type: String },
    city: { type: String },
    zip: { type: String },
    country: { type: String },
});

// Define the user schema
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    birthdate: { type: Date, required: true },
    address: { type: addressSchema, required: false }, // Optional address
    gender: { type: String, required: true },
    password: { type: String, required: true }, // Should be hashed
    user_role: {
        type: String,
        enum: ["passenger", "driver"],
        required: true,
    }, // Role field added
    ratings_made: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
        default: [],
    }, // Array of reviews written by the user
    created_at: { type: Date, default: Date.now },
});

// Create the User model
const User = mongoose.model("User", userSchema, "users");

module.exports = User;
