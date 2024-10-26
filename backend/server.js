const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User"); // Ensure you have a User model
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection string
const mongoURI =
    "mongodb+srv://human:indra123@cluster0.5jmta.mongodb.net/motodachiDB";

// Connect to MongoDB
mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error: ", err));

// User Registration Route
app.post("/users", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password }); // Store password directly (not secure)
        await newUser.save(); // Save user to database
        res.status(201).json({ message: "User created successfully" }); // Respond with a success message
    } catch (err) {
        res.status(400).json({ error: "Error creating user." }); // Handle errors without exposing sensitive info
    }
});

// User Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check if the provided password matches (direct comparison)
        if (user.password !== password) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
            expiresIn: "1h",
        });

        // Send the token back to the client
        res.json({ token });
    } catch (error) {
        res.status(500).json({
            error: "Server error. Please try again later.",
        }); // Generic error message
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://192.168.18.10:${PORT}`);
});
