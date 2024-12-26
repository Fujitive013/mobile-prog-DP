require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./models/User");
const Booking = require("./models/Booking"); // Import the Booking model
const Driver = require("./models/Driver");
const Ride = require("./models/Ride");
const Review = require("./models/Review");
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

// User Pending Status
app.get("/view/pendingStatus", async (req, res) => {
    const { status, userId, booking_id } = req.query;
    try {
        const pendingStatus = await Booking.find({
            status: status || "pending",
            user_id: userId,
            _id: booking_id,
        });

        if (!pendingStatus || pendingStatus.length === 0) {
            return res.status(200).json([]); // Return empty array if no active rides
        }

        res.status(200).json(pendingStatus);
    } catch (error) {
        console.error("Error fetching pending status:", error);
        res.status(500).json({ error: "Error fetching pending status" });
    }
});

// User Active Rides
app.get("/view/activeRides", async (req, res) => {
    const { status } = req.query;
    try {
        // Find bookings with active status
        const activeRides = await Ride.find({
            status: status || "active",
            user_id: req.session.userId,
        });

        if (!activeRides || activeRides.length === 0) {
            return res.status(200).json([]); // Return empty array if no active rides
        }

        res.status(200).json(activeRides);
    } catch (error) {
        console.error("Error fetching active rides:", error);
        res.status(500).json({ error: "Error fetching active rides" });
    }
});

// User Completed Rides
app.get("/view/completedRides", async (req, res) => {
    const { status } = req.query;
    try {
        // Find bookings with pending status
        const completedRides = await Ride.find({
            status: status || "completed",
            ride_rating: null,
            user_id: req.session.userId,
        });

        if (!completedRides || completedRides.length === 0) {
            return res.status(200).json([]); // Return empty array if no pending bookings
        }

        res.status(200).json(completedRides);
    } catch (error) {
        console.error("Error fetching completedRides:", error);
        res.status(500).json({ error: "Error fetching completedRides" });
    }
});

app.get("/driver/getCurrentLocation", async (req, res) => {
    try {
        const userId = req.session.userId; // Get user ID from session
        const ride = await Ride.findOne({ user_id: userId, status: "active" }); // Find active ride for the user

        if (!ride) {
            return res
                .status(404)
                .json({ message: "No active ride found for this user." });
        }

        res.status(200).json(ride.current_location); // Return the current location
    } catch (error) {
        console.error("Error fetching current location:", error);
        res.status(500).json({ error: "Error fetching current location" });
    }
});

app.get("/driver/completedRides", async (req, res) => {
    const { status } = req.query;
    try {
        // Find bookings with pending status
        const completedRides = await Ride.find({
            status: status || "completed",
            driver_id: req.session.userId,
        });

        if (!completedRides || completedRides.length === 0) {
            return res.status(200).json([]); // Return empty array if no pending bookings
        }

        res.status(200).json(completedRides);
    } catch (error) {
        console.error("Error fetching completedRides:", error);
        res.status(500).json({ error: "Error fetching completedRides" });
    }
});

// Get reviews for completed rides
app.post("/user/makeReviews", async (req, res) => {
    try {
        const {
            driver_id,
            driver_name,
            user_id,
            ride_id,
            rating,
            comment,
            created_at,
            passengerName,
        } = req.body;

        // Create a new review instance
        const newReview = new Review({
            driver_id,
            driver_name,
            passengerName,
            user_id: req.session.userId,
            ride_id,
            rating,
            comment,
            created_at,
        });

        // Save the review to the database
        const savedReview = await newReview.save();

        // Update the ride's rating
        const ride = await Ride.findById(ride_id);
        if (ride) {
            // Directly set the ride rating to the review's rating
            ride.ride_rating = rating; // This assumes that a ride can have only one rating per review
            await ride.save();
        }

        // Respond with the saved review
        res.status(201).json({
            message: "Review created successfully",
            review: savedReview,
        });
    } catch (error) {
        console.error("Error creating Review:", error);
        res.status(500).json({
            error: "An error occurred while creating the review",
        });
    }
});

app.get("/user/viewReviews", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Query the Ride collection for completed rides and their reviews
        const completedReviews = await Review.find({
            user_id: req.session.userId,
        });

        if (!completedReviews || completedReviews.length === 0) {
            console.log("No Reviews Found");
        }

        res.status(200).json(completedReviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Error fetching reviews" });
    }
});

app.get("/driver/viewReviews", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Query the Ride collection for completed rides and their reviews
        const completedReviews = await Review.find({
            driver_id: req.session.userId,
        });

        if (!completedReviews || completedReviews.length === 0) {
            console.log("No Reviews Found");
        }

        res.status(200).json(completedReviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Error fetching reviews" });
    }
});

app.get("/rides/current_location/:id", async (req, res) => {
    const { id } = req.params; // Extract userId from the request parameters
    try {
        // Find the ride associated with the specified user_id
        const ride = await Ride.findOne({ user_id: userId, status: "active" });

        if (!ride) {
            return res
                .status(404)
                .json({ message: "No active ride found for this user." });
        }

        // Return the current location of the ride
        res.status(200).json({ current_location: ride.current_location });
    } catch (error) {
        console.error("Error fetching current location:", error);
        res.status(500).json({ error: "Error fetching current location" });
    }
});

app.put("/rides/:id", async (req, res) => {
    const { id } = req.params;
    console.log("Request to update ride received:", id);

    try {
        // Check if the ride exists using booking_id instead of _id
        const ride = await Ride.findOneAndUpdate(
            { booking_id: id }, // Match by booking_id
            { status: "completed" },
            { new: true }
        );

        if (!ride) {
            console.error("Ride not found with booking_id:", id);
            return res.status(404).json({ error: "Ride not found" });
        }

        console.log("Ride updated successfully:", ride);
        res.status(200).json(ride);
    } catch (error) {
        console.error("Error updating ride status:", error.message);
        res.status(500).json({ error: "Error updating ride status" });
    }
});

app.post("/rides", async (req, res) => {
    try {
        const {
            driver_id,
            driver_name,
            passengerName,
            user_id,
            booking_id,
            pickup_location,
            destination,
            fare,
            status,
            created_at,
            updated_at,
            ride_rating,
            current_location,
        } = req.body;

        // Create a new ride instance
        const newRide = new Ride({
            driver_id: req.session.userId,
            driver_name,
            passengerName,
            user_id,
            booking_id,
            pickup_location,
            destination,
            fare,
            status,
            created_at,
            updated_at,
            ride_rating,
            current_location: {
                latitude: current_location.latitude,
                longitude: current_location.longitude,
            },
        });

        // Save the ride to the database
        const savedRide = await newRide.save();

        // Respond with the saved ride
        res.status(201).json({
            message: "Ride created successfully",
            ride: savedRide,
        });
    } catch (error) {
        console.error("Error creating ride:", error);
        res.status(500).json({
            error: "An error occurred while creating the ride",
        });
    }
});

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

app.get("/booking/pending/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        console.log("Querying pending bookings for user_id:", id);
        const bookings = await Booking.find({
            booking_id: id,
            status: "pending",
        });

        if (bookings.length === 0) {
            return res
                .status(404)
                .json({ message: "No pending bookings found for this user." });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching pending bookings:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
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

// Register as driver
app.post("/driver/register", async (req, res) => {
    const { bike_model, license_number, location } = req.body;

    try {
        const newDriver = new Driver({
            user_id: req.session.userId,
            bike_model,
            license_number,
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
        });

        await newDriver.save();

        // Update the user role
        const updatedUser = await User.findByIdAndUpdate(
            req.session.userId,
            { user_role: "driver" },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(201).json({
            success: true,
            message: "Successfully registered as driver",
        });
    } catch (error) {
        console.error("Error registering driver:", error);
        res.status(500).json({ error: "Error registering driver" });
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
            id: user._id,
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
