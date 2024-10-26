require("dotenv").config({ path: "../.env" });

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // For storing session in MongoDB
const User = require("./models/User");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection string from environment variable
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error: ", err));

// Session Middleware Setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret", // Use session secret from .env
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoURI,
            collectionName: "sessions",
        }),

        cookie: { maxAge: 180 * 60 * 1000 }, // Session expiry in milliseconds
    })
);

// User Registration Route
app.post("/users", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password }); // Store password directly (not secure)
        await newUser.save(); // Save user to database
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(400).json({ error: "Error creating user." });
    }
});

// User Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Store user ID in session
        req.session.userId = user._id; // Start a session for the user

        // Optionally generate a JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "default_jwt_secret",
            {
                expiresIn: "1h",
            }
        );

        res.json({ token, message: "Login successful" }); // Send token and message
    } catch (error) {
        res.status(500).json({
            error: "Server error. Please try again later.",
        });
    }
});

// Logout Route
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to log out" });
        }
        res.clearCookie("connect.sid"); // Clear the session cookie
        res.json({ message: "Logged out successfully" });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://192.168.18.10:${PORT}`);
});
