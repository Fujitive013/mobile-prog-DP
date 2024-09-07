import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Index = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.mainContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={require("../Images/text_logo_black.png")}
                    style={[styles.mainImage, { width: 300, height: 300 }]}
                    resizeMode="contain"
                />
                <View>
                    <Text style={styles.welcomeLabel}> WELCOME! </Text>
                </View>
                <View style={styles.mainloginContainer}>
                    <Card style={styles.backgroundContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={styles.textLabel}>LOGIN</Text>
                        </TouchableOpacity>
                    </Card>
                    <Card style={styles.backgroundContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("SignUp")}
                        >
                            <Text style={styles.textLabel}>REGISTER</Text>
                        </TouchableOpacity>
                    </Card>
                    <Card style={styles.backgroundContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Book")}
                        >
                            <Text style={styles.textLabel}>BOOK</Text>
                        </TouchableOpacity>
                    </Card>
                    <Card style={styles.backgroundContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Dashboard")}
                        >
                            <Text style={styles.textLabel}>DASHBOARD</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            </View>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    textLabel: {
        fontSize: 25,
        width: 250,
        height: 50,
        borderRadius: 10,
        textAlign: "center",
        textAlignVertical: "center",
        color: "#FFFFFF",
    },
    backgroundContainer: {
        backgroundColor: "#2D2A2A",
        marginVertical: 15,
    },
    mainloginContainer: {
        marginVertical: 40,
    },
    imageContainer: {
        alignItems: "center",
        marginVertical: 100,
        marginBottom: -20,
        marginTop: 50,
    },
    mainImage: {
        marginBottom: -20,
    },
    welcomeLabel: {
        fontSize: 40,
        marginTop: -10,
        marginBottom: -10,
        fontWeight: "700",
    },
    mainContainer: {
        backgroundColor: "#FFDC2E",
        height: "100%",
    },
});
