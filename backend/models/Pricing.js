const mongoose = require("mongoose");

// Define the pricing schema
const pricingSchema = new mongoose.Schema({
    base_fare: { type: Number, required: true },
    per_kilometer: { type: Number, required: true },
    per_minute: { type: Number, required: true },
    additional_charges: { type: Number, default: 0 }, // For any surge pricing, etc.
    effective_from: { type: Date, required: true }, // Date when this pricing is effective
});

// Create the Pricing model
const Pricing = mongoose.model("Pricing", pricingSchema, "pricing");

module.exports = Pricing;
