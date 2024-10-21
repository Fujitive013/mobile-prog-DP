import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Material Icons

const Profile = () => {
    // Sample user data
    const user = {
        name: "Axel Paredes",
        email: "axelparedes@email.com",
        phoneNumber: "+1234567890",
        birthDate: "January 1, 1990",
        address: "Villanueva, Misamis Oriental",
        gender: "Male",
        photo: "Images/img_placeholder_1024x768-768x576.jpg", // Sample photo URL
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image
                    source={{ uri: user.photo }}
                    style={styles.profileImage}
                />
                <Text style={styles.userName}>{user.name}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Icon name="email" size={24} color="#000" />
                        <Text style={styles.label}>Email</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.email}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Icon name="phone" size={24} color="#000" />
                        <Text style={styles.label}>Phone</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.phoneNumber}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Icon name="calendar-today" size={24} color="#000" />
                        <Text style={styles.label}>Birthdate</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.birthDate}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Icon name="home" size={24} color="#000" />
                        <Text style={styles.label}>Address</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.address}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Icon name="wc" size={24} color="#000" />
                        <Text style={styles.label}>Gender</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.gender}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#F7F9FC",
    },
    profileInfo: {
        alignItems: "center",
        marginBottom: 0,
        paddingBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#000",
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2C3E50",
    },
    detailsContainer: {
        marginBottom: 20,
    },
    detailItem: {
        marginBottom: 20,
        borderBottomWidth: 3,
        borderBottomColor: "#E1E1E1",
    },
    iconLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    outputContainer: {
        marginTop: 5,
        paddingLeft: 30,
        paddingBottom: 5,
    },
    label: {
        fontSize: 16,
        color: "#34495E",
        marginLeft: 10,
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "#7F8C8D",
    },
    logoutButton: {
        backgroundColor: "#F6F6F6",
        paddingVertical: 15,
        borderRadius: 30,
        marginVertical: -10,
        alignItems: "center",
        justifyContent: "center", // Center content vertically
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 5,
        width: "50%",
        alignSelf: "center", // Center the button horizontally
    },
});
