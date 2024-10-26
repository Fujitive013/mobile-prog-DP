import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SignUpModal from "./Modals/SignupModal";
import LoginModal from "./Modals/LoginModal";
import { useNavigation } from "@react-navigation/native";
import RegistrationModal from "./Modals/RegistrationModal";

const LandingPage = () => {
    const navigation = useNavigation();
    const [isSignUpVisible, setSignUpVisible] = useState(false);
    const [isLoginVisible, setLoginVisible] = useState(false);
    const [isRegistrationVisible, setRegistrationVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = (email, password) => {
        setEmail(email);
        setPassword(password);
        setSignUpVisible(false);
        setRegistrationVisible(true); // Show the registration modal
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../Images/text_logo_black.png")}
                style={styles.backgroundImage}
                resizeMode="contain"
            />
            <View>
                <Text
                    style={[
                        styles.welcomeText,
                        { alignSelf: "center", marginTop: 250 },
                    ]}
                >
                    Hello
                </Text>
                <View style={{ alignSelf: "center" }}>
                    <Text style={styles.descriptionText}>
                        Welcome To Moto-dachi,{" "}
                    </Text>
                    <Text style={[styles.descriptionText]}>
                        with exceptional prices and{" "}
                    </Text>
                    <Text style={[styles.descriptionText]}>
                        top-notch safety-only{" "}
                    </Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.touchableLoginButton}
                    onPress={() => setLoginVisible(true)}
                >
                    <Text style={styles.buttonLoginText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.touchableSignUpButton}
                    onPress={() => setSignUpVisible(true)}
                >
                    <Text style={styles.buttonSignUpText}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            <SignUpModal
                visible={isSignUpVisible}
                onClose={() => setSignUpVisible(false)}
                onSignUp={handleSignUp} // Pass the handleSignUp function
            />

            <LoginModal
                visible={isLoginVisible}
                onClose={() => setLoginVisible(false)}
            />

            <RegistrationModal
                visible={isRegistrationVisible}
                onClose={() => setRegistrationVisible(false)}
                email={email} // Pass email to RegistrationModal
                password={password} // Pass password to RegistrationModal
            />
        </View>
    );
};

export default LandingPage;

const styles = StyleSheet.create({
    descriptionText: {
        fontSize: 16,
        color: "#888888",
        textAlign: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#F6F6F6",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    backgroundImage: {
        position: "absolute",
        top: 50,
        width: 300,
        height: 300,
        opacity: 0.9,
    },
    welcomeText: {
        fontSize: 32,
        marginVertical: 10,
        fontWeight: "bold",
        color: "#181818",
        textAlign: "center",
    },
    buttonContainer: {
        width: "80%",
        justifyContent: "center",
        marginTop: 50,
    },
    touchableLoginButton: {
        backgroundColor: "#3498DB",
        paddingVertical: 12,
        borderRadius: 30,
        marginVertical: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 5,
    },
    touchableSignUpButton: {
        backgroundColor: "#ffffff",
        paddingVertical: 12,
        borderRadius: 30,
        marginVertical: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 5,
    },
    buttonLoginText: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "600",
    },
    buttonSignUpText: {
        color: "#3498DB",
        fontSize: 20,
        fontWeight: "600",
    },
    navButtons: {
        marginTop: 50,
        width: "100%",
    },
    navButton: {
        backgroundColor: "#E67E22",
        padding: 16,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 5,
    },
    navButtonText: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "600",
    },
});
