import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Card, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function LoginScreen() {
    const navigation = useNavigation();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require("../Images/text_logo_black.png")}
                        style={[styles.mainImage, { width: 300, height: 300 }]}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.mainContainer}>
                    <Card style={styles.subContainer}>
                        <View style={styles.circle}>
                            <Image
                                source={require("../Images/User.png")}
                                style={styles.userImage}
                            />
                        </View>
                        <Text style={styles.emailLabel}> Email </Text>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputEmailAddress}
                            mode="outlined"
                            theme={{ roundness: 20 }}
                        />
                        <Text style={styles.passwordLabel}> Password </Text>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputPassword}
                            secureTextEntry
                            mode="outlined"
                            theme={{ roundness: 20 }}
                        />

                        {/* Updated TouchableOpacity for the Sign In Button */}
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => {
                                /* Handle sign in logic */
                            }}
                            activeOpacity={0.7} // Apply opacity change on press
                        >
                            <Text style={styles.signInLabel}>Sign In</Text>
                        </TouchableOpacity>

                        <View style={styles.accountText}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("SignUp")}
                            >
                                <Text
                                    style={{ textDecorationLine: "underline" }}
                                >
                                    Don't have an account?
                                    <Text style={styles.signUpLabel}>
                                        {" "}
                                        Sign Up
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    mainImage: {
        marginBottom: -10,
    },
    userImage: {
        width: 50,
        height: 50,
    },
    signUpLabel: {
        color: "#FCD12A",
    },
    accountText: {
        alignItems: "center",
    },
    signInLabel: {
        fontSize: 17,
        color: "white",
    },
    submitButton: {
        marginVertical: 20,
        backgroundColor: "#424242",
        borderRadius: 10,
        alignItems: "center", // Center the text inside the button
        paddingVertical: 12, // Add some padding for better touch area
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
    imageContainer: {
        alignItems: "center",
        marginVertical: 30,
        marginBottom: -10,
    },
    mainContainer: {
        marginTop: 30,
        padding: 20,
    },
    subContainer: {
        backgroundColor: "#F9F9F9",
        padding: 35,
        borderRadius: 25,
    },
    emailLabel: {
        fontSize: 17,
        marginTop: 15,
        marginBottom: 5,
    },
    inputEmailAddress: {
        marginBottom: 10,
        backgroundColor: "#F9F9F9",
    },
    passwordLabel: {
        fontSize: 17,
        marginBottom: 5,
    },
    inputPassword: {
        backgroundColor: "#F9F9F9",
    },
    container: {
        flex: 1,
        backgroundColor: "#FFDC2E",
    },
    circle: {
        position: "absolute",
        top: "-10%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }],
        width: 95,
        height: 95,
        borderRadius: 50,
        backgroundColor: "#ACACAC",
        alignItems: "center",
        justifyContent: "center",
    },
});
