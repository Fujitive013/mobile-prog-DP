import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Switch,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const HomeRider = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const navigation = useNavigation();

    const [todayStats, setTodayStats] = useState({
        totalTrips: 8,
        totalEarnings: 1250,
        totalHours: 6,
        rating: 4.8,
    });

    useEffect(() => {
        // Initial fetch
        fetchPendingBookings();

        // Set up polling interval
        const pollInterval = setInterval(() => {
            fetchPendingBookings();
        }, 3000); // Poll every 3 seconds

        return () => {
            clearInterval(pollInterval);
        };
    }, []);

    const acceptRide = async (request) => {
        try {
            // Update booking status to accepted
            await axios.put(
                `http://192.168.18.24:5000/bookings/${request.id}`,
                { status: "accepted" }
            );

            // Remove from pending requests locally
            setPendingRequests((prev) =>
                prev.filter((booking) => booking.id !== request.id)
            );
            Alert.alert("Booking Accepted");
            // Navigate to BookRider screen with ride details
            navigation.navigate("DashboardDriver", {
                screen: "Book",
                params: {
                    rideDetails: {
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

    const fetchPendingBookings = async () => {
        try {
            const response = await axios.get(
                "http://192.168.18.24:5000/bookings?status=pending"
            );
            const formattedRequests = response.data.map((booking) => ({
                id: booking._id,
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

            // Compare with current state and only update if there are changes
            setPendingRequests((prev) => {
                const prevIds = new Set(prev.map((r) => r.id));
                const newIds = new Set(formattedRequests.map((r) => r.id));

                // Check if arrays are different
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

    const toggleOnlineStatus = () => {
        setIsOnline(!isOnline);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, John!</Text>
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
                    <Text style={styles.statValue}>
                        {todayStats.totalTrips}
                    </Text>
                    <Text style={styles.statLabel}>Trips</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="cash" size={24} color="#2ecc71" />
                    <Text style={styles.statValue}>
                        ₱{todayStats.totalEarnings}
                    </Text>
                    <Text style={styles.statLabel}>Earnings</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="star" size={24} color="#f1c40f" />
                    <Text style={styles.statValue}>{todayStats.rating}</Text>
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
