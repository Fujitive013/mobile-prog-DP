import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Switch,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeRider = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [completedRidesCount, setCompletedRidesCount] = useState(0);
    const [rides, setRides] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [userName, setUserName] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const storedName = await AsyncStorage.getItem("userName");
                if (storedName) {
                    setUserName(storedName);
                } else {
                    console.error("Username not found in AsyncStorage");
                }
            } catch (error) {
                console.error(
                    "Error fetching userName from AsyncStorage:",
                    error
                );
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.1.3:5000/driver/viewReviews"
                );
                setReviews(response.data);

                // Calculate the average rating
                if (response.data.length > 0) {
                    const totalRating = response.data.reduce(
                        (sum, review) => sum + review.rating,
                        0
                    );
                    const avgRating = totalRating / response.data.length;
                    setAverageRating(avgRating);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        const fetchRides = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.1.3:5000/driver/completedRides"
                );

                const rides = response.data;
                setRides(rides);
                setCompletedRidesCount(rides.length); // Count completed rides

                // Calculate the total earnings and average rating
                if (rides.length > 0) {
                    const totalEarnings = rides.reduce(
                        (sum, ride) => sum + ride.fare,
                        0
                    );
                    setTotalEarnings(totalEarnings);
                }
            } catch (error) {
                console.error("Error fetching rides:", error);
            }
        };

        fetchRides();
        fetchReviews();
        fetchUserName();
        fetchPendingBookings();

        // Poll for new bookings every 3 seconds
        const pollInterval = setInterval(() => {
            fetchPendingBookings();
        }, 3000);

        return () => clearInterval(pollInterval); // Cleanup on component unmount
    }, []);

    const fetchPendingBookings = async () => {
        try {
            const response = await axios.get(
                "http://192.168.1.3:5000/bookings?status=pending"
            );
            const formattedRequests = response.data.map((booking) => ({
                id: booking._id,
                userId: booking.user_id,
                passengerName: booking.passenger_name,
                pickupLocation: booking.currentAddress,
                destination: booking.destination,
                fare: booking.fare,
                timeRequested: "Just now",
                status: booking.status,
                payment_status: booking.payment_status,
                payment_method: booking.payment_method,
                latitude: booking.latitude,
                longitude: booking.longitude,
            }));

            setPendingRequests((prev) => {
                const prevIds = new Set(prev.map((r) => r.id));
                const newIds = new Set(formattedRequests.map((r) => r.id));
                if (
                    prevIds.size !== newIds.size ||
                    !Array.from(prevIds).every((id) => newIds.has(id))
                ) {
                    return formattedRequests;
                }
                return prev;
            });
        } catch (error) {
            console.error("Error fetching pending bookings:", error);
        }
    };

    const acceptRide = (request) => {
        try {
            navigation.navigate("DashboardDriver", {
                screen: "Book",
                params: {
                    rideDetails: {
                        driver_name: userName,
                        user_id: request.userId,
                        bookingId: request.id,
                        pickupLocation: request.pickupLocation,
                        destination: request.destination,
                        passengerName: request.passengerName,
                        fare: request.fare,
                        latitude: request.latitude,
                        longitude: request.longitude,
                    },
                },
            });
        } catch (error) {
            console.error("Error accepting ride:", error);
        }
    };

    const toggleOnlineStatus = () => {
        setIsOnline(!isOnline);
    };
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>
                        Hello, {userName || "Rider"}!
                    </Text>
                    <Text style={styles.subGreeting}>
                        Ready to hit the road?
                    </Text>
                </View>
                <View style={styles.onlineToggle}>
                    <Text
                        style={[
                            styles.statusText,
                            isOnline ? styles.onlineText : styles.offlineText,
                        ]}
                    >
                        {isOnline ? "Online" : "Offline"}
                    </Text>
                    <Switch
                        value={isOnline}
                        onValueChange={toggleOnlineStatus}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isOnline ? "#3498DB" : "#f4f3f4"}
                    />
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Icon name="bicycle" size={24} color="#3498DB" />
                    <Text style={styles.statValue}>{completedRidesCount}</Text>
                    <Text style={styles.statLabel}>Trips</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="cash" size={24} color="#2ecc71" />
                    <Text style={styles.statValue}>₱{totalEarnings}</Text>
                    <Text style={styles.statLabel}>Earnings</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="star" size={24} color="#f1c40f" />
                    <Text style={styles.statValue}>{averageRating}</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>New Ride Requests</Text>
                {pendingRequests.map((request) => (
                    <View key={request.id} style={styles.requestCard}>
                        <View style={styles.requestHeader}>
                            <View style={styles.passengerInfo}>
                                <Icon
                                    name="person-circle"
                                    size={24}
                                    color="#3498DB"
                                />
                                <Text style={styles.passengerName}>
                                    {request.passengerName}
                                </Text>
                            </View>
                            <Text style={styles.timeRequested}>
                                {request.timeRequested}
                            </Text>
                        </View>
                        <View style={styles.routeInfo}>
                            <View style={styles.locationRow}>
                                <Icon
                                    name="location"
                                    size={16}
                                    color="#e74c3c"
                                />
                                <Text style={styles.locationText}>
                                    {request.pickupLocation}
                                </Text>
                            </View>
                            <View style={styles.locationRow}>
                                <Icon
                                    name="location"
                                    size={16}
                                    color="#2ecc71"
                                />
                                <Text style={styles.locationText}>
                                    {request.destination}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.requestFooter}>
                            <Text style={styles.fareText}>₱{request.fare}</Text>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.declineButton}>
                                    <Text style={styles.declineButtonText}>
                                        Decline
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={() => acceptRide(request)}
                                >
                                    <Text style={styles.acceptButtonText}>
                                        Accept
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2c3e50",
    },
    subGreeting: {
        fontSize: 16,
        color: "#7f8c8d",
    },
    onlineToggle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statusText: {
        fontWeight: "bold",
    },
    onlineText: {
        color: "#2ecc71",
    },
    offlineText: {
        color: "#e74c3c",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    statCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 5,
        elevation: 2,
    },
    statValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2c3e50",
        marginTop: 5,
    },
    statLabel: {
        fontSize: 12,
        color: "#7f8c8d",
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#2c3e50",
    },
    requestCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    requestHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    passengerInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    passengerName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
    },
    timeRequested: {
        fontSize: 12,
        color: "#7f8c8d",
    },
    routeInfo: {
        marginBottom: 10,
        gap: 5,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    locationText: {
        fontSize: 14,
        color: "#2c3e50",
    },
    requestFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    fareText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2ecc71",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 10,
    },
    acceptButton: {
        backgroundColor: "#3498DB",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    acceptButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    declineButton: {
        backgroundColor: "#f5f5f5",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    declineButtonText: {
        color: "#e74c3c",
        fontWeight: "bold",
    },
    supportButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 15,
        marginBottom: 20,
    },
    supportButtonText: {
        color: "#3498DB",
        fontWeight: "600",
    },
});

export default HomeRider;
