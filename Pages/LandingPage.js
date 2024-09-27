import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SignUpModal from "./Modals/SignupModal";
import LoginModal from "./Modals/LoginModal";
import { useNavigation } from "@react-navigation/native";

const LandingPage = () => {
    const navigation = useNavigation();
    const [isSignUpVisible, setSignUpVisible] = useState(false);
    const [isLoginVisible, setLoginVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Image
                source={require("../Images/text_logo_black.png")}
                style={styles.backgroundImage}
                resizeMode="contain"
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.touchableButton}
                    onPress={() => setSignUpVisible(true)}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.touchableButton}
                    onPress={() => setLoginVisible(true)}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>

            <SignUpModal
                visible={isSignUpVisible}
                onClose={() => setSignUpVisible(false)}
            />

            <LoginModal
                visible={isLoginVisible}
                onClose={() => setLoginVisible(false)}
            />

            <View style={styles.navButtons}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate("Registration")}
                >
                    <Text style={styles.navButtonText}>Registration</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LandingPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F6F6",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        marginBottom: -170, // ambot ngano negative ni hahaha
        // pag i positive nako kay makulangan ang margin wtf
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
        marginVertical: 20,
        fontWeight: "bold",
        color: "#2C3E50",
        textAlign: "center",
    },
    buttonContainer: {
        marginTop: 30,
        width: "100%",
        justifyContent: "center",
        height: 150,
    },
    touchableButton: {
        backgroundColor: "#3498DB",
        paddingVertical: 18,
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
    buttonText: {
        color: "#ffffff",
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
