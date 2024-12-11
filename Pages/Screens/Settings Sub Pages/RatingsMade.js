import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function RatingsReceived() {
    const navigation = useNavigation();

    const Settings = () => {
        navigation.navigate("Dashboard", (screen = "settings"));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={Settings}>
                    <Ionicons name="arrow-back" size={25} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Passenger</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 30,
        backgroundColor: "#f5f5f5",
        marginHorizontal: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginBottom: 10,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
