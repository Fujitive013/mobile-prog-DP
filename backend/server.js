require("dotenv").config({ path: "../.env" });

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./models/User");
const Booking = require("./models/Booking"); // Import the Booking model
const jwt = require("jsonwebtoken");
const app = express();

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

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
    const {
        firstName,
        lastName,
        email,
        phone,
        birthDate,
        gender,
        password,
        user_role,
    } = req.body;

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
            user_role: "passenger",
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.log("Error creating user:", err);
        res.status(400).json({ error: "Error creating user." });
    }
});

// Get pending bookings
app.get("/bookings", async (req, res) => {
    const { status } = req.query;

    try {
        // Find bookings with pending status
        const pendingBookings = await Booking.find({
            status: status || "pending",
        });

        if (!pendingBookings || pendingBookings.length === 0) {
            return res.status(200).json([]); // Return empty array if no pending bookings
        }

        res.status(200).json(pendingBookings);
    } catch (error) {
        console.error("Error fetching pending bookings:", error);
        res.status(500).json({ error: "Error fetching pending bookings" });
    }
});

// Update booking status
app.put("/bookings/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ error: "Error updating booking" });
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
            user_role: user.user_role,
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

// Booking Route
app.post("/user/booking", async (req, res) => {
    const {
        user_id,
        passenger_name,
        payment_status,
        payment_method,
        fare,
        currentAddress,
        destination,
        latitude,
        longitude,
    } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const newBooking = new Booking({
            user_id: req.session.userId,
            passenger_name,
            status: "pending", // You can change the status as needed
            payment_status,
            payment_method,
            fare,
            currentAddress,
            destination,
            latitude,
            longitude,
        });

        await newBooking.save();
        res.status(201).json({
            message: "Booking created successfully",
            booking: newBooking,
        });
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(400).json({ error: "Error creating booking." });
    }
});

const startServer = (port) => {
    const server = app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${port}`);
    });
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.log(`Port ${port} is in use, trying next port...`);
            startServer(port + 1);
        } else {
            console.error("Server error:", err);
        }
    });
};

startServer(DEFAULT_PORT);
