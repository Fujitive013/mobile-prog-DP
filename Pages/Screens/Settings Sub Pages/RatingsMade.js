import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Modal,
    TextInput,
    Alert,
    Dimensions,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function RatingsMade() {
    const [reviews, setReviews] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRide, setSelectedRide] = useState(null);
    const [selectedDriverID, setSelectedDriverID] = useState(null);
    const [newReview, setNewReview] = useState({
        rating: "",
        comment: "",
    });
    const [rides, setRides] = useState([]);
    const [selectedRideId, setSelectedRideId] = useState(null);
    const navigation = useNavigation();

    const fetchRides = useCallback(async () => {
        try {
            const completedRidesResponse = await axios.get(
                "http://192.168.18.24:5000/view/completedRides"
            );
            const reviewsResponse = await axios.get(
                "http://192.168.18.24:5000/user/viewReviews"
            );

            const completedRides = completedRidesResponse.data;
            const reviews = reviewsResponse.data;

            const availableRides = completedRides.filter(
                (ride) =>
                    !reviews.some(
                        (review) =>
                            review.ride_id === ride.id ||
                            review.ride_id === ride._id
                    )
            );

            setRides(availableRides);
        } catch (error) {
            console.error("Error fetching rides:", error);
        }
    }, []);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await axios.get(
                "http://192.168.18.24:5000/user/viewReviews"
            );
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchRides();
        fetchReviews();
    }, [fetchRides, fetchReviews]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchReviews();
    }, [fetchReviews]);

    const handleAddReview = async () => {
        try {
            const reviewPayload = {
                ...newReview,
                ride_id: selectedRideId,
                driver_id: selectedDriverID,
                driver_name: selectedRide.driver_name,
                passengerName: selectedRide.passengerName,
            };

            await axios.post(
                "http://192.168.18.24:5000/user/makeReviews",
                reviewPayload
            );
            Alert.alert("Success", "Review posted successfully");
            setModalVisible(false);

            setRides((prevRides) =>
                prevRides.filter(
                    (ride) =>
                        ride.id !== selectedRideId &&
                        ride._id !== selectedRideId
                )
            );

            resetForm();
            fetchReviews();
        } catch (error) {
            console.error("Error submitting review:", error);
            Alert.alert("Error", "Failed to post review. Please try again.");
        }
    };

    const resetForm = () => {
        setNewReview({
            rating: "",
            comment: "",
        });
        setSelectedRide(null);
        setSelectedRideId(null);
        setSelectedDriverID(null);
    };

    const renderRideItem = ({ item }) => (
        <TouchableOpacity
            style={styles.rideItem}
            onPress={() => {
                setSelectedRide(item);
                setSelectedRideId(item.id || item._id);
                setSelectedDriverID(item.driver_id || item.driver_id);
            }}
        >
            <Text style={styles.rideText}>Rate Driver: {item.driver_name}</Text>
        </TouchableOpacity>
    );

    const renderReviewItem = ({ item }) => (
        <View style={styles.reviewCard}>
            <Text style={styles.reviewerName}>
                {item.driver_name || "Unknown Driver"}
            </Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating || "N/A"}/5</Text>
                {[...Array(5)].map((_, index) => (
                    <Ionicons
                        key={index}
                        name={
                            index < (item.rating || 0) ? "star" : "star-outline"
                        }
                        size={16}
                        color="#FFD700"
                    />
                ))}
            </View>
            <Text style={styles.reviewComment}>
                {item.comment || "No comment"}
            </Text>
            <Text style={styles.reviewDate}>
                {new Date(item.created_at).toLocaleDateString()}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ratings</Text>
            </View>
            <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item.id || item._id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="star-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateText}>
                            No ratings available.
                        </Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    resetForm();
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add a Review</Text>
                        <FlatList
                            data={rides.filter(
                                (ride) =>
                                    !(
                                        selectedRideId &&
                                        (ride.id === selectedRideId ||
                                            ride._id === selectedRideId)
                                    )
                            )}
                            renderItem={renderRideItem}
                            keyExtractor={(item) => item.id || item._id}
                            style={styles.rideList}
                            ListEmptyComponent={
                                <Text style={styles.noRidesText}>
                                    No rides available for review
                                </Text>
                            }
                        />
                        {selectedRide && (
                            <>
                                <View style={styles.selectedRideInfo}>
                                    <Text style={styles.selectedRideText}>
                                        Selected Driver:{" "}
                                        {selectedRide.driver_name}
                                    </Text>
                                </View>
                                <View style={styles.ratingInput}>
                                    <Text style={styles.ratingLabel}>
                                        Rating:
                                    </Text>
                                    <View style={styles.starRating}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <TouchableOpacity
                                                key={star}
                                                onPress={() =>
                                                    setNewReview({
                                                        ...newReview,
                                                        rating: star.toString(),
                                                    })
                                                }
                                            >
                                                <Ionicons
                                                    name={
                                                        star <=
                                                        parseInt(
                                                            newReview.rating
                                                        )
                                                            ? "star"
                                                            : "star-outline"
                                                    }
                                                    size={32}
                                                    color="#FFD700"
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Your comment"
                                    value={newReview.comment}
                                    onChangeText={(text) =>
                                        setNewReview({
                                            ...newReview,
                                            comment: text,
                                        })
                                    }
                                    multiline
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.submitButton}
                                        onPress={handleAddReview}
                                    >
                                        <Text style={styles.submitButtonText}>
                                            Submit
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => {
                                            setModalVisible(false);
                                            resetForm();
                                        }}
                                    >
                                        <Text style={styles.cancelButtonText}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
        padding: 16,
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
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.02,
        paddingBottom: height * 0.01,
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
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#007AFF",
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
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1a1a1a",
        marginBottom: 16,
    },
    rideList: {
        maxHeight: 200,
        marginBottom: 16,
    },
    rideItem: {
        padding: 12,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginBottom: 10,
    },
    rideText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1a1a1a",
    },
    noRidesText: {
        textAlign: "center",
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
    },
    ratingInput: {
        marginBottom: 16,
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 8,
    },
    starRating: {
        flexDirection: "row",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: "#1a1a1a",
        marginBottom: 16,
        backgroundColor: "#f8f9fa",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    submitButton: {
        backgroundColor: "#007AFF",
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
        backgroundColor: "#FF3B30",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
    },
    selectedRideInfo: {
        backgroundColor: "#e8f0fe",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    selectedRideText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1a1a1a",
    },
});
