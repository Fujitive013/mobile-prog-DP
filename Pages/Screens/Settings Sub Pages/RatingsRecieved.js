import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
                    "http://192.168.1.3:5000/driver/viewReviews"
                );
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
        const interval = setInterval(fetchReviews, 3000);
        return () => clearInterval(interval);
    }, []);

    const renderReview = ({ item }) => (
        <View style={styles.reviewCard}>
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
                <Ionicons name="chatbubble-outline" size={14} color="#3498db" />{" "}
                {item.comment || "No comment provided"}
            </Text>
            <Text style={styles.dateText}>
                <Ionicons name="calendar-outline" size={14} color="#3498db" />{" "}
                {new Date(item.created_at).toLocaleDateString()}
            </Text>
        </View>
    );

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
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ratings Received</Text>
            </View>
            <FlatList // Use FlatList directly for scrolling
                data={reviews}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderReview}
                contentContainerStyle={styles.listContent} // Add this for padding
                ListEmptyComponent={ // Handle empty state
                    <View>
                        <Ionicons
                            name="star-outline"
                            size={64}
                            color="#ccc"
                        />
                        <Text style={styles.noRatingsText}>
                            No ratings available.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f9fafc", // Softer background color for better contrast
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#e5e5e5",
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: "#2c3e50",
    },
    listContent: {
      padding: 16,
    },
    reviewCard: {
      backgroundColor: "#ffffff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
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
    rating: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#f1c40f",
      marginRight: 8,
    },
    stars: {
      flexDirection: "row",
    },
    comment: {
      fontSize: 14,
      color: "#7f8c8d",
      marginBottom: 8,
      lineHeight: 20,
    },
    dateText: {
      fontSize: 12,
      color: "#bdc3c7",
      marginTop: 4,
    },
    noReviewsText: {
      textAlign: "center",
      fontSize: 16,
      color: "#7f8c8d",
      marginTop: 20,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: 20,
      backgroundColor: "#3498db",
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
      width: "90%",
      backgroundColor: "#ffffff",
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: 16,
    },
    rideList: {
      maxHeight: 200,
      marginBottom: 16,
    },
    noRidesText: {
      textAlign: "center",
      fontSize: 14,
      color: "#7f8c8d",
    },
    rideItem: {
      padding: 12,
      backgroundColor: "#ecf0f1",
      borderRadius: 8,
      marginBottom: 10,
    },
    rideText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#34495e",
    },
    ratingInput: {
      marginBottom: 16,
    },
    ratingLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#34495e",
      marginBottom: 8,
    },
    starRating: {
      flexDirection: "row",
      marginBottom: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: "#dcdcdc",
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: "#2c3e50",
      marginBottom: 16,
      backgroundColor: "#f9fafc",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    submitButton: {
      backgroundColor: "#2ecc71",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
    },
    cancelButton: {
      backgroundColor: "#e74c3c",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
    },
  });
  
