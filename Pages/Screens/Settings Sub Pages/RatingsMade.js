import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Modal,
    TextInput,
    Button,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function RatingsMade() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRide, setSelectedRide] = useState(null);
    const [selectedDriverID, setSelectedDriverID] = useState(null);
    const [newReview, setNewReview] = useState({
        rideId: "",
        rating: "",
        comment: "",
    });
    const [rides, setRides] = useState([]);
    const [selectedRideId, setSelectedRideId] = useState(null); // Track selected ride ID
    const navigation = useNavigation();

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.1.3:5000/view/completedRides"
                );
                setRides(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching rides:", error);
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.1.3:5000/user/viewReviews"
                );
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
        fetchReviews();
    }, []);

    const navigateToSettings = () => {
        navigation.navigate("Dashboard", { screen: "settings" });
    };

    const handleAddReview = async () => {
        try {
            // Ensure the ride ID is included in the review data
            const reviewPayload = {
                ...newReview,
                ride_id: selectedRideId, // Include the ride ID
                driver_id: selectedDriverID,
            };

            await axios.post(
                "http://192.168.1.3:5000/user/makeReviews",
                reviewPayload
            );
            Alert.alert("Review Posted Successfully");
            navigation.navigate("Dashboard", { screen: "settings" });
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    const renderRideItem = ({ item }) => (
        <TouchableOpacity
            style={styles.rideItem}
            onPress={() => {
                setSelectedRide(item);
                setSelectedRideId(item.id || item._id); // Update selected ride ID
                setSelectedDriverID(item.driver_id || item.driver_id); // Update selected driver ID
            }}
        >
            <Text style={styles.rideText}>Ride ID: {item._id}</Text>
        </TouchableOpacity>
    );

    // Filter out the selected ride from the list
    const filteredRides = rides.filter(
        (ride) =>
            !(
                selectedRideId &&
                (ride.id === selectedRideId || ride._id === selectedRideId)
            )
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
                    onPress={navigateToSettings}
                >
                    <Ionicons name="arrow-back" size={25} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Passenger Ratings</Text>
            </View>
            <View style={styles.listContent}>
                {reviews.length > 0 ? (
                    reviews.map((item, index) => (
                        <View
                            key={item.id || item._id}
                            style={styles.reviewCard}
                        >
                            <Text style={styles.rating}>
                                Ride ID: {item.ride_id}
                            </Text>
                            <Text style={styles.rating}>
                                Rating: {item.rating} / 5
                            </Text>
                            <Text style={styles.comment}>
                                comment: {item.comment}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noReviewsText}>
                        No reviews available.
                    </Text>
                )}
            </View>
            <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addReviewButtonText}>Add a Review</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Review a Ride</Text>
                        <FlatList
                            data={filteredRides}
                            renderItem={renderRideItem}
                            keyExtractor={(item) => item.id || item._id}
                            style={styles.rideList}
                        />
                        {selectedRide && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Rating (1-5)"
                                    keyboardType="numeric"
                                    value={newReview.rating}
                                    onChangeText={(text) =>
                                        setNewReview({
                                            ...newReview,
                                            rating: text,
                                        })
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Comment"
                                    value={newReview.comment}
                                    onChangeText={(text) =>
                                        setNewReview({
                                            ...newReview,
                                            comment: text,
                                        })
                                    }
                                />
                                <View style={styles.modalButtons}>
                                    <Button
                                        title="Submit"
                                        onPress={handleAddReview}
                                        color="#3498db"
                                    />
                                    <Button
                                        title="Cancel"
                                        onPress={() => setModalVisible(false)}
                                        color="#e74c3c"
                                    />
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
        backgroundColor: "#f5f5f5",
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
    date: {
        fontSize: 12,
        color: "#aaa",
    },
    noReviewsText: {
        textAlign: "center",
        fontSize: 16,
        color: "#aaa",
        marginTop: 20,
    },
    addReviewButton: {
        backgroundColor: "#3498db",
        padding: 12,
        margin: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    addReviewButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 14,
    },
    rideList: {
        marginVertical: 10,
    },
    rideItem: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 8,
    },
    rideText: {
        fontSize: 14,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
