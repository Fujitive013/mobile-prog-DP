import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function RatingsReceived() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const Settings = () => {
        navigation.navigate("Dashboard", { screen: "settings" });
    };

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
                <TouchableOpacity style={styles.backButton} onPress={Settings}>
                    <Ionicons name="arrow-back" size={25} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Driver</Text>
            </View>
            <View style={styles.listContent}>
                {reviews.length > 0 ? (
                    reviews.map((item, index) => (
                        <View key={index} style={styles.reviewCard}>
                            <Text style={styles.rating}>
                                Ride ID: {item.ride_id}
                            </Text>
                            <Text style={styles.rating}>
                                Rating: {item.rating} / 5
                            </Text>
                            <Text style={styles.comment}>
                                Comment: {item.comment}
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
        marginVertical: 30,
        backgroundColor: "#f5f5f5",
        marginHorizontal: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginBottom: 10,
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
        fontSize: 14,
        color: "#3498db",
        marginBottom: 4,
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
});
