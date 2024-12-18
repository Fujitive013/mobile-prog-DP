import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function RatingsMade() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedDriverID, setSelectedDriverID] = useState(null);
  const [newReview, setNewReview] = useState({
    rideId: "",
    rating: "",
    comment: "",
  });
  const [rides, setRides] = useState([]);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const navigation = useNavigation();

  const fetchRides = useCallback(async () => {
    try {
      const completedRidesResponse = await axios.get(
        "http://192.168.1.3:5000/view/completedRides"
      );
      const reviewsResponse = await axios.get(
        "http://192.168.1.3:5000/user/viewReviews"
      );

      const completedRides = completedRidesResponse.data;
      const reviews = reviewsResponse.data;

      // Filter out rides that have already been reviewed
      const availableRides = completedRides.filter(
        (ride) =>
          !reviews.some(
            (review) =>
              review.ride_id === ride.id || review.ride_id === ride._id
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
        "http://192.168.1.3:5000/user/viewReviews"
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
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
        "http://192.168.1.3:5000/user/makeReviews",
        reviewPayload
      );
      Alert.alert("Success", "Review posted successfully");
      setModalVisible(false);

      // Remove the rated ride from the list
      setRides((prevRides) =>
        prevRides.filter(
          (ride) => ride.id !== selectedRideId && ride._id !== selectedRideId
        )
      );

      // Reset form and selected ride
      setNewReview({
        rideId: "",
        rating: "",
        comment: "",
      });
      setSelectedRide(null);
      setSelectedRideId(null);
      setSelectedDriverID(null);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to post review. Please try again.");
    }
  };

  const resetForm = () => {
    setNewReview({
      rideId: "",
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
      <Text style={styles.rideText}>Ride with: {item.driver_name}</Text>
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }) => {
    console.log("Review item:", item);
    return (
      <View style={styles.reviewCard}>
        <Text style={styles.riderId}>
          Driver Name: {item.driver_name || "Unknown Driver"}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>Rating: {item.rating || "N/A"}/5</Text>
          <View style={styles.stars}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < (item.rating || 0) ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
        <Text style={styles.comment}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={14}
            color="#7f8c8d"
          />{" "}
          Comment: {item.comment || "No comment"}
        </Text>
        <Text style={styles.dateText}>
          <Ionicons name="calendar-outline" size={14} color="#bdc3c7" />{" "}
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Your Ratings</Text>
      </View>
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id || item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.noReviewsText}>No reviews available.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
                    (ride.id === selectedRideId || ride._id === selectedRideId)
                  )
              )}
              renderItem={renderRideItem}
              keyExtractor={(item) => item.id || item._id}
              style={styles.rideList}
            />
            {rides.length === 0 && (
              <Text style={styles.noRidesText}> No rides found</Text>
            )}
            {selectedRide && (
              <>
                <View style={styles.ratingInput}>
                  <Text style={styles.ratingLabel}>Rating:</Text>
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
                            star <= parseInt(newReview.rating)
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
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
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
