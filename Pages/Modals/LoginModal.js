import React, { useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Card, TextInput } from "react-native-paper";

const LoginModal = ({ visible, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("Login successful");
        // Navigate to next screen or perform action here
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <Card style={styles.card}>
                    <Text style={styles.emailLabel}>Email</Text>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#AFAFAF"
                        style={styles.inputField}
                        mode="outlined"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.passwordLabel}>Password</Text>
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#AFAFAF"
                        style={styles.inputField}
                        secureTextEntry
                        mode="outlined"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.submitButton}
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
    inputField: {
        marginBottom: 10,
        backgroundColor: "#F9F9F9",
    },
    submitButton: {
        backgroundColor: "#424242",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginBottom: 10,
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
        color: "#FCD12A",
        textAlign: "center",
    },
});
