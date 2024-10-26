import React, { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Card, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import RegistrationModal from "./RegistrationModal";

const SignUpModal = ({ visible, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistrationVisible, setRegistrationVisible] = useState(false);

    const isPasswordMatch = password === confirmPassword && password !== "";
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email validation

    const handleSignUp = () => {
        if (!isPasswordMatch) {
            Alert.alert("Password Mismatch", "Passwords do not match.");
            return;
        }

        if (!isEmailValid) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        // Store email and password for the registration modal
        setRegistrationVisible(true);
    };

    useEffect(() => {
        if (!visible) {
            // Reset states when modal is closed
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setRegistrationVisible(false); // Ensure registration modal is closed
        }
    }, [visible]);

    return (
        <>
            <Modal
                transparent
                visible={visible && !isRegistrationVisible}
                animationType="slide"
            >
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
                                accessibilityLabel="Email input"
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
                                accessibilityLabel="Password input"
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
                                accessibilityLabel="Confirm Password input"
                            />
                        </View>

                        {/* Password match indicator */}
                        {password !== "" && confirmPassword !== "" && (
                            <Text
                                style={[
                                    styles.passwordMatchIndicator,
                                    {
                                        color: isPasswordMatch
                                            ? "green"
                                            : "red",
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
                                { opacity: isPasswordMatch ? 1 : 0.5 },
                            ]}
                            disabled={!isPasswordMatch || !isEmailValid} // Disable if not valid
                            onPress={handleSignUp}
                        >
                            <Text style={styles.submitLabel}>Sign Up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            </Modal>

            {/* Registration Modal */}
            <RegistrationModal
                visible={isRegistrationVisible}
                onClose={() => {
                    setRegistrationVisible(false);
                    onClose(); // Close the signup modal when registration is closed
                }}
                email={email}
                password={password}
            />
        </>
    );
};

SignUpModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
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
