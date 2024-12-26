import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    RefreshControl,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function RatingsReceived() {
    const [reviews, setReviews] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const fetchReviews = async () => {
        try {
            const response = await axios.get(
                "http://192.168.18.24:5000/driver/viewReviews"
            );
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchReviews().then(() => setRefreshing(false));
    }, []);

    const renderReview = ({ item }) => (
        <View style={styles.reviewCard}>
            <Text style={styles.reviewerName}>
                Passenger: {item.passengerName}
            </Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Ratings: {item.rating}/5</Text>
                {[...Array(5)].map((_, index) => (
                    <Ionicons
                        key={index}
                        name={index < item.rating ? "star" : "star-outline"}
                        size={16}
                        color="#FFD700"
                    />
                ))}
            </View>
            <Text style={styles.reviewComment}>Comment: {item.comment}</Text>
            <Text style={styles.reviewDate}>
                {new Date(item.created_at).toLocaleDateString()}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ratings Received</Text>
            </View>
            <FlatList
                data={reviews}
                renderItem={renderReview}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="star-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateText}>
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
        backgroundColor: "#f8f9fa",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.05,
        paddingBottom: height * 0.02,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        backgroundColor: "#fff",
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1a1a1a",
    },
    listContent: {
        padding: 16,
    },
    reviewCard: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    reviewerName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#f1c40f",
        marginRight: 8,
    },
    reviewComment: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
        lineHeight: 20,
    },
    reviewDate: {
        fontSize: 12,
        color: "#999",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 32,
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
});
