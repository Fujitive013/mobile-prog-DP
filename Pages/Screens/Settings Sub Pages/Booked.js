import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Modal,
    Alert,
    Dimensions,
    Animated,
    Easing,
    BackHandler, // Import BackHandler
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function Booked() {
    const route = useRoute();
    const { fare, payment_method, id } = route.params;
    const navigation = useNavigation();
    const [pendingStatus, setPendingStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const userId = route.params?.userId;
    const booking_id = route.params?.booking_id;

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    console.log("booking_id From confirmedBooking", booking_id);

    useEffect(() => {
        fetchPendingStatus();
        const updateInterval = setInterval(fetchPendingStatus, 3000);

        // Start animations
        startPulseAnimation();
        startRotateAnimation();

        // Start of Selection
        // Handle back button press
        // Start of Selection
        const backAction = () => {
            // Prevent navigating back and stay on the Booked screen
            return true;
        };

        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => {
            clearInterval(updateInterval);
            pulseAnim.stopAnimation();
            rotateAnim.stopAnimation();
            BackHandler.removeEventListener("hardwareBackPress", backAction);
        };
    }, []);

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const startRotateAnimation = () => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    const fetchPendingStatus = async () => {
        try {
            const response = await axios.get(
                `http://192.168.18.24:5000/view/pendingStatus?userId=${userId}&booking_id=${booking_id}`
            );

            if (response.data && response.data.length > 0) {
                setPendingStatus(response.data[0]);
                setLoading(true);
            } else {
                setPendingStatus(null);
                setLoading(false);
            }
        } catch (error) {
            console.error(
                "Error fetching pending status:",
                error.response ? error.response.data : error.message
            );
            Alert.alert(
                "Error",
                "Failed to fetch pending status. Please try again.",
                [{ text: "OK", onPress: () => setLoading(false) }]
            );
        }
    };

    const handleConfirm = () => {
        if (!loading) {
            setModalVisible(true);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: "Dashboard",
                        params: { screen: "Home", userId: userId },
                    },
                ],
            })
        );
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Booked</Text>
            </View>

            <View style={styles.profileContainer}>
                <Image
                    source={require("../../../Images/profile.jpg")}
                    style={styles.profileImage}
                />
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4].map((star) => (
                        <Ionicons
                            key={star}
                            name="star"
                            size={16}
                            color="#FFD700"
                        />
                    ))}
                    <Ionicons name="star-outline" size={16} color="#FFD700" />
                </View>
                <Text style={styles.name}>Ivan Emmanuel A. Dadacay</Text>
                <Text style={styles.role}>Bajaj</Text>
                <Text style={styles.fare}>Fare: ₱{fare}</Text>
            </View>

            <View style={styles.paymentContainer}>
                <Text style={styles.paymentTitle}>Select Payment Method</Text>
                <View style={styles.paymentOption}>
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={24}
                        color="#4285F4"
                    />
                    <Text style={styles.paymentText}>{payment_method}</Text>
                </View>
            </View>

            <View style={styles.messageContainer}>
                <Text style={styles.messageText}>
                    {pendingStatus
                        ? "Please wait for the rider to arrive at your location."
                        : "Please wait for the rider to arrive in your location."}{" "}
                    {"\n\n"}
                    {pendingStatus
                        ? "Locating a rider who can take your request..."
                        : "You'll be notified if the rider is in your location."}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <Animated.View
                    style={[
                        styles.buttonWrapper,
                        { transform: [{ scale: pulseAnim }] },
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.cancelButton,
                            loading && styles.loadingButton,
                        ]}
                        onPress={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <Animated.View
                                style={{ transform: [{ rotate: spin }] }}
                            >
                                <Ionicons name="sync" size={24} color="#fff" />
                            </Animated.View>
                        ) : (
                            <Ionicons name="checkmark" size={24} color="#fff" />
                        )}
                        <Text style={styles.cancelButtonText}>
                            {loading ? "Waiting for a rider..." : "Done"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            Thank you for using our app. Have a great day!
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleCloseModal}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 25,
        marginVertical: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: "bold",
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: "row",
        marginBottom: 5,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    role: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
    },
    fare: {
        fontSize: 16,
        fontWeight: "bold",
    },
    paymentContainer: {
        marginBottom: 30,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
    },
    paymentText: {
        fontSize: 16,
        marginLeft: 10,
    },
    messageContainer: {
        marginBottom: 30,
        alignItems: "center",
    },
    messageText: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
        color: "#555",
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: height * 0.05,
    },
    buttonWrapper: {
        width: "100%",
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#4A90E2",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingButton: {
        backgroundColor: "#FFD700",
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        maxWidth: 400,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButton: {
        backgroundColor: "#4A90E2",
        padding: 10,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
