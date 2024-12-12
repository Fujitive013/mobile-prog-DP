import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Card, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icons
import { useNavigation } from "@react-navigation/native";
<<<<<<< Updated upstream
=======
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
>>>>>>> Stashed changes

const LoginModal = ({ visible, onClose }) => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

<<<<<<< Updated upstream
    const isEmailValid = email.includes("@") && email.includes(".");

    const handleLogin = () => {
        if (!isEmailValid) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
=======
    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "http://192.168.1.3:5000/login",
                { email, password },
                { withCredentials: true }
            );

            console.log("Server response:", response.data);

            if (response.status === 200) {
                // Store token in AsyncStorage
                await AsyncStorage.setItem("token", response.data.token);
                console.log("Token stored:", response.data.token);

                const userRole = response.data.user.user_role;
                console.log("Login successful, user role:", userRole);
                
                setEmail("");
                setPassword("");

                // Navigate based on user role without storing it
                if (userRole === "passenger") {
                    navigation.navigate("Dashboard");
                } else if (userRole === "driver") {
                    navigation.navigate("DashboardDriver");
                }
                onClose();
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert(
                "Login failed",
                error.response?.data?.error || "Invalid credentials."
            );
>>>>>>> Stashed changes
        }

        console.log("Login successful");
        setEmail("");
        setPassword("");
        navigation.navigate("Dashboard");
        onClose(); // Close the modal after login
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <Card style={styles.card}>
                    <Text style={styles.SignUpLabel}>Sign In</Text>
                    <Text style={styles.emailLabel}>Email</Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name="email"
                            size={20}
                            color="#AFAFAF"
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputField}
                            mode="outlined"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <Text style={styles.passwordLabel}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name="lock"
                            size={20}
                            color="#AFAFAF"
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputField}
                            secureTextEntry
                            mode="outlined"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            {
                                opacity: isEmailValid ? 1 : 0.5,
                            },
                        ]}
                        disabled={!isEmailValid} // Disable if email is invalid
                        onPress={handleLogin}
                    >
                        <Text style={styles.submitLabel}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        </Modal>
    );
};

export default LoginModal;

const styles = StyleSheet.create({
    SignUpLabel: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    card: {
        width: "90%",
        padding: 20,
        borderRadius: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    inputField: {
        flex: 1,
        backgroundColor: "#F9F9F9",
    },
    submitButton: {
        backgroundColor: "#424242",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10,
    },
    submitLabel: {
        color: "white",
        fontSize: 16,
    },
    emailLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    passwordLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        color: "#000000",
        textAlign: "right",
        marginRight: 10,
    },
});
