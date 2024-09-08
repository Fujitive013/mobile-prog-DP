import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function RegistrationScreen() {
    const navigation = useNavigation();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");

    const handleRegister = () => {
        // Basic validation
        if (
            firstName === "" ||
            lastName === "" ||
            age === "" ||
            address === ""
        ) {
            Alert.alert("Missing Information", "Please fill out all fields.");
            return;
        }
        if (isNaN(age)) {
            Alert.alert("Invalid Age", "Please enter a valid numeric age.");
            return;
        }

        console.log("Registration successful!");
        // Add registration logic here
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainContainer}>
                    <Card style={styles.subContainer}>
                        <View>
                            <Text style={styles.headerLabel}>
                                Tell us about yourself
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.registerLabel}>
                                Registration
                            </Text>
                        </View>
                        <View>
                            <View style={styles.nameInput}>
                                <Text style={styles.label}> First Name </Text>
                                <TextInput
                                    placeholder="First Name"
                                    placeholderTextColor="#AFAFAF"
                                    style={styles.inputField}
                                    mode="outlined"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    theme={{ roundness: 20 }}
                                />
                            </View>
                            <View style={styles.nameInput}>
                                <Text style={styles.label}> Last Name </Text>
                                <TextInput
                                    placeholder="Last Name"
                                    placeholderTextColor="#AFAFAF"
                                    style={styles.inputField}
                                    mode="outlined"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    theme={{ roundness: 20 }}
                                />
                            </View>
                        </View>

                        <Text style={styles.label}> Age </Text>
                        <TextInput
                            placeholder="Age"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputField}
                            mode="outlined"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                            theme={{ roundness: 20 }}
                        />

                        <Text style={styles.label}> Address </Text>
                        <TextInput
                            placeholder="Address"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputField}
                            mode="outlined"
                            value={address}
                            onChangeText={setAddress}
                            theme={{ roundness: 20 }}
                        />
                        <Button
                            mode="elevated"
                            style={styles.submitButton}
                            onPress={handleRegister}
                        >
                            <Text style={styles.registerLabel}>Continue</Text>
                        </Button>
                    </Card>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default RegistrationScreen;

const styles = StyleSheet.create({
    headerLabel: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    registerLabel: {
        fontSize: 17,
        color: "white",
    },
    label: {
        fontSize: 17,
        marginTop: 15,
        marginBottom: 5,
    },
    inputField: {
        marginBottom: 10,
        backgroundColor: "#F9F9F9",
    },
    submitButton: {
        marginVertical: 20,
        backgroundColor: "#424242",
        borderRadius: 10,
    },
    accountText: {
        alignItems: "center",
    },
    signUpLabel: {
        color: "#FCD12A",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
    mainContainer: {
        marginTop: 30,
        padding: 20,
    },
    subContainer: {
        backgroundColor: "#F9F9F9",
        padding: 35,
        borderRadius: 25,
        paddingVertical: 20,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFDC2E",
    },
});
