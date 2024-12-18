import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { height } = Dimensions.get("window");

export default function RatingsReceived() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.18.24:5000/driver/viewReviews"
                );
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchReviews();

        // Set up interval to fetch reviews every 3 seconds
        const interval = setInterval(fetchReviews, 3000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#3498db" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Driver</Text>
            </View>
            <View style={styles.listContent}>
                {console.log(reviews)}
                {reviews.length > 0 ? (
                    reviews.map((item, index) => (
                        <View key={index} style={styles.reviewCard}>
                            <Text style={styles.riderId}>
                                Passenger Name: {item.passengerName}
                            </Text>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.rating}>
                                    Rating: {item.rating || "N/A"}/5
                                </Text>
                                <View style={styles.stars}>
                                    {[...Array(5)].map((_, index) => (
                                        <Ionicons
                                            key={index}
                                            name={
                                                index < (item.rating || 0)
                                                    ? "star"
                                                    : "star-outline"
                                            }
                                            size={16}
                                            color="#FFD700"
                                        />
                                    ))}
                                </View>
                            </View>
                            <Text style={styles.comment}>
                                Comment: {item.comment}
                            </Text>
                            <Text style={styles.dateText}>
                                {new Date(item.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noRatingsText}>
                        No ratings available.
                    </Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        marginHorizontal: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginBottom: height * 0.001,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    listContent: {
        paddingHorizontal: 16,
    },
    reviewCard: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    rating: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#3498db",
        marginRight: 5,
    },
    comment: {
        fontSize: 14,
        color: "#333",
        marginBottom: 8,
    },
    noRatingsText: {
        textAlign: "center",
        fontSize: 16,
        color: "#aaa",
        marginTop: 20,
    },
    dateText: {
        fontSize: 12,
        color: "#666",
        marginBottom: 8,
    },
    riderId: {
        fontSize: 18,
        fontWeight: "600",
        color: "#3498db",
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    stars: {
        flexDirection: "row",
    },
});
