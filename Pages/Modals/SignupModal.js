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

const SignUpModal = ({ visible, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isPasswordMatch = password === confirmPassword && password !== "";
    const isEmailValid = email.includes("@") && email.includes(".");

    const handleSignUp = () => {
        if (!isEmailValid) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        if (!isPasswordMatch) {
            Alert.alert("Password Mismatch", "Passwords do not match.");
            return;
        }

        // Proceed with sign-up logic here (e.g., API call)
        // On successful sign-up:
        Alert.alert("Success", "You have successfully signed up!");
        onClose(); // Close the modal on success
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <Card style={styles.card}>
                    <View>
                        <Text style={styles.SignUpLabel}>Sign Up</Text>
                    </View>
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
                    <Text style={styles.confirmPasswordLabel}>
                        Confirm Password
                    </Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name="lock"
                            size={20}
                            color="#AFAFAF"
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputField}
                            secureTextEntry
                            mode="outlined"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>

                    {/* Password match indicator */}
                    {password !== "" && confirmPassword !== "" && (
                        <Text
                            style={[
                                styles.passwordMatchIndicator,
                                {
                                    color: isPasswordMatch ? "green" : "red",
                                },
                            ]}
                        >
                            {isPasswordMatch
                                ? "Passwords match"
                                : "Passwords do not match"}
                        </Text>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            {
                                opacity:
                                    isPasswordMatch && isEmailValid ? 1 : 0.5,
                            },
                        ]}
                        disabled={!isPasswordMatch || !isEmailValid} // Disable if not valid
                        onPress={handleSignUp} // Handle sign up
                    >
                        <Text style={styles.submitLabel}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        </Modal>
    );
};

export default SignUpModal;

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
    confirmPasswordLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        color: "#000000",
        textAlign: "right",
        marginRight: 10,
    },
    passwordMatchIndicator: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: "center",
    },
});