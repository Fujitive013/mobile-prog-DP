import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Image,
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
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleRegister = () => {
        // Basic validation
        if (
            firstName === "" ||
            lastName === "" ||
            age === "" ||
            address === "" ||
            phoneNumber === ""
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
                    <Image
                        source={require('../Images/backgroundLogo.png')} // replace with your image file
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    />
                    <Card style={styles.subContainer}>
                        <Image
                            source={require("../Images/text_logo_black.png")}
                            style={[styles.mainImage, { width: 190, height: 170, alignSelf: 'center' }]}
                            resizeMode="contain"
                        />
                        <View>
                            <Text style={styles.headerLabel}>
                                Registration
                            </Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
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
                        <View style={{flexDirection:'row'}}>
                            <View style={styles.nameInput}>
                                <Text style={styles.label}> Age </Text>
                                <TextInput
                                placeholder="Age"
                                placeholderTextColor="#AFAFAF"
                                style={styles.inputField}
                                mode="outlined"
                                value={age}
                                onChangeText={setAge}
                                theme={{ roundness: 20 }}
                                keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.nameInput}>
                                <Text style={styles.label}> Phone Number </Text>
                                <TextInput
                                placeholder="Phone Number"
                                placeholderTextColor="#AFAFAF"
                                style={styles.inputField}
                                mode="outlined"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                theme={{ roundness: 20 }}
                                keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <View style={styles.nameInput}>
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
                        </View>
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
    nameInput: {
        marginRight: 10,
        flex: 1,
    },
    headerLabel: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    registerLabel: {
        fontSize: 17,
        color: "white",
    },
    label: {
        fontSize: 14,
        marginTop: 15,
        marginBottom: 5,
    },
    inputField: {
        width: "100%",
        justifyContent: 'space-between',
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
        marginBottom: "100%",
        padding: 15,
    },
    subContainer: {
        backgroundColor: "#F9F9F9",
        padding: 20,
        borderRadius: 25,
        paddingVertical: 20,
        marginTop: 50,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFDC2E",
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: "110%",
        height: "120%"
    },
});
