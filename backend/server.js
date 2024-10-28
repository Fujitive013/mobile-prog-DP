require("dotenv").config({ path: ".env" });

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./models/User");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error: ", err));

// Session Middleware Setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret",
        resave: false,  
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoURI,
            collectionName: "sessions",
            ttl: 3600, // Session expiration time in seconds (1 hour)
            autoRemove: "native",
        }),
        cookie: { maxAge: 180 * 60 * 1000 }, // Session expiry in milliseconds
    })
);

// User Registration Route
const bcrypt = require("bcrypt");

app.post("/users", async (req, res) => {
    const { firstName, lastName, email, phone, birthDate, gender, password } =
        req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            birthdate: birthDate,
            gender,
            password: hashedPassword,
        });

        await newUser.save(); 
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.log("Error creating user:", err);
        res.status(400).json({ error: "Error creating user." });
    }
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        req.session.userId = user._id;
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            birthdate: user.birthdate,
            gender: user.gender,
        };
        req.session.createdAt = new Date();
        // Optionally generate a JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "default_jwt_secret",
            { expiresIn: "1h" }
        );

        res.json({
            token,
            message: "Login successful",
            user: req.session.user,
            createdAt: req.session.createdAt,
        });
    } catch (error) {
        console.error("Server error during login:", error);
        res.status(500).json({
            error: "Server error. Please try again later.",
        });
    }
});

// Profile
app.get("/user/details", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user: req.session.user });
});

// Logout
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to log out" });
        }
        res.clearCookie("connect.sid"); 
        res.json({ message: "Logged out successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://192.168.1.2:${PORT}`);
});
