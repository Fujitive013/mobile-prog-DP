import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const GcashPayment = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const fare = route.params?.fare || 0;
    const currentAddress = route.params?.currentAddress;
    const destination = route.params?.destination;
    const latitude = route.params?.latitude;
    const longitude = route.params?.longitude;
    const userName = route.params?.userName;

    console.log(latitude, longitude);

    const [mobileNumber, setMobileNumber] = useState("");
    const [error, setError] = useState("");

    const handlePayment = async () => {
        if (mobileNumber.length !== 11) {
            setError("Mobile number must be 11 digits long.");
            return;
        }
        setError("");

        const paymentStatus = "paid";
        const paymentMethod = "Gcash";
        try {
            console.log("Sending request with data:", {
                fare,
                destination,
                currentAddress,
                paymentMethod,
                paymentStatus,
                latitude,
                longitude,
            });
            const response = await axios.post(
                "http://192.168.1.3:5000/user/booking",
                {
                    passenger_name: userName,
                    fare,
                    destination,
                    payment_status: paymentStatus,
                    currentAddress,
                    payment_method: paymentMethod,
                    latitude,
                    longitude,
                }
            );

            console.log("Booking created successfully:", response.data);

            // Navigate to the Booked screen with booking details
            navigation.navigate("Booked", {
                fare,
                payment_status: paymentStatus,
                payment_method: paymentMethod,
                destination,
                currentAddress,
                latitude,
                longitude,
            });
        } catch (error) {
            console.error("Error creating booking:", error.response?.data);
            // Handle error (you can show a message to the user, etc.)
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../../../../Images/Gcash.png")}
                style={styles.logo}
            />

            <Text style={styles.title}>Gcash Payment</Text>

            <Text style={styles.label}>Enter Mobile Number:</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 09123456789"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                maxLength={11}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Text style={styles.fare}>Fare: ₱{fare}</Text>

            <TouchableOpacity style={styles.button} onPress={handlePayment}>
                <Text style={styles.buttonText}>Confirm Payment</Text>
            </TouchableOpacity>
        </View>
    );
};

export default GcashPayment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
        padding: 20,
        justifyContent: "center",
    },
    logo: {
        height: 100,
        width: 118,
        alignSelf: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1A1A1A",
        textAlign: "center",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#707070",
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: "#FFFFFF",
        fontSize: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    fare: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1A1A1A",
        textAlign: "center",
        marginTop: 15,
        marginBottom: 25,
    },
    button: {
        backgroundColor: "#4A90E2",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    error: {
        color: "#FF4D4D",
        fontSize: 14,
        marginBottom: 15,
        textAlign: "center",
    },
});
