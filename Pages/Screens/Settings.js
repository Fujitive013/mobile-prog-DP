import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icons

const Settings = () => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Settings</Text>
            </View>
            <View>
                <TouchableOpacity style={styles.SettingsButton}>
                    <Icon
                        name="person"
                        size={24}
                        color="#000"
                        style={styles.icon}
                    />
                    <Text style={styles.ButtonText}>Profile Information</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.SettingsButton}>
                    <Icon
                        name="notifications"
                        size={24}
                        color="#000"
                        style={styles.icon}
                    />
                    <Text style={styles.ButtonText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.SettingsButton}>
                    <Icon
                        name="lock"
                        size={24}
                        color="#000"
                        style={styles.icon}
                    />
                    <Text style={styles.ButtonText}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.SettingsButton}>
                    <Icon
                        name="contacts"
                        size={24}
                        color="#000"
                        style={styles.icon}
                    />
                    <Text style={styles.ButtonText}>Contacts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.SettingsButton}>
                    <Icon
                        name="help-outline"
                        size={24}
                        color="#000"
                        style={styles.icon}
                    />
                    <Text style={styles.ButtonText}>Help Support</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    SettingsButton: {
        backgroundColor: "#F6F6F6",
        paddingVertical: 15,
        borderRadius: 30,
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 5,
        width: "100%",
    },
    ButtonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
    },
    icon: {
        marginLeft: 20,
    },
});
