import {
    StyleSheet,
    Text,
    View,
    Button,
    Image,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import SignUpModal from "./Modals/SignupModal";
import LoginModal from "./Modals/LoginModal";
import { useNavigation } from "@react-navigation/native";

const LoginSignup = () => {
    const navigation = useNavigation();
    const [isSignUpVisible, setSignUpVisible] = useState(false);
    const [isLoginVisible, setLoginVisible] = useState(false);

    return (
        <View style={styles.container}>
            {/* Background image */}
            <Image
                source={require("../Images/text_logo_black.png")}
                style={styles.backgroundImage}
                resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome to the App!</Text>

            {/* Buttons for Sign Up and Login */}
            <View style={styles.buttonContainer}>
                <Button
                    title="Sign Up"
                    onPress={() => setSignUpVisible(true)}
                    color="#424242"
                />
                <Button
                    title="Login"
                    onPress={() => setLoginVisible(true)}
                    color="#424242"
                />
            </View>

            {/* Sign Up Modal */}
            <SignUpModal
                visible={isSignUpVisible}
                onClose={() => setSignUpVisible(false)}
            />

            {/* Login Modal */}
            <LoginModal
                visible={isLoginVisible}
                onClose={() => setLoginVisible(false)}
            />

            {/* Additional navigation buttons */}
            <View style={styles.navButtons}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate("Registration")}
                >
                    <Text style={styles.navButtonText}>Registration</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate("Dashboard")}
                >
                    <Text style={styles.navButtonText}>Dashboard</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginSignup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFDC2E", // Background color from SignUp/Login screens
        justifyContent: "center",
        alignItems: "center",
    },
    backgroundImage: {
        position: "absolute",
        top: 50,
        width: 300,
        height: 300,
    },
    welcomeText: {
        fontSize: 24,
        marginVertical: 20,
        fontWeight: "bold",
    },
    buttonContainer: {
        marginTop: 20,
        width: "80%",
        justifyContent: "space-around",
        height: 100,
    },
    navButtons: {
        marginTop: 40,
        width: "80%",
    },
    navButton: {
        backgroundColor: "#424242",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: "center",
    },
    navButtonText: {
        color: "#fff",
        fontSize: 18,
    },
});
