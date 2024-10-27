const mongoose = require("mongoose");

// Define the address sub-schema
const addressSchema = new mongoose.Schema({
    street: { type: String, required: false },
    barangay: { type: String, required: false },
    city: { type: String, required: false },
    zip: { type: String, required: false },
    country: { type: String, required: false },
});

// Define the user schema
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    birthdate: { type: Date, required: true },
    address: { type: addressSchema, required: false }, // Use the address sub-schema
    gender: { type: String, required: true },
    password: { type: String, required: true },
});

// Create the User model, specifying the collection name
const User = mongoose.model("User", userSchema, "users"); // Use the "users" collection

// Export the model
module.exports = User;
