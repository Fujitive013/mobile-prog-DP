import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for outline icons
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
    const navigation = useNavigation();

<<<<<<< Updated upstream
    const handleLogout = () => {
        navigation.navigate('LandingPage')
=======
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.1.3:5000/user/details",
                    {
                        withCredentials: true,
                    }
                );
                console.log("Fetched User Data:", response.data); // Log fetched data
                setUser(response.data.user); // Access the user property
            } catch (error) {
                console.log("Failed to fetch user data:", error);
                navigation.navigate("LandingPage"); // Navigate if unauthorized
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://192.168.1.3:5000/logout",
                {},
                {
                    withCredentials: true,
                }
            );
            navigation.navigate("LandingPage");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
>>>>>>> Stashed changes
    }

    // Sample user data
    const user = {
        name: "Axel Paredes",
        email: "axelparedes@email.com",
        phoneNumber: "+1234567890",
        birthDate: "January 1, 1990",
        address: "Villanueva, Misamis Oriental",
        gender: "Male",
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image
                    source={require('../../Images/axel.jpg')} // Replace with your image path
                    style={styles.profileImage}
                />
                <Text style={styles.userName}>{user.name}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Ionicons name="mail-outline" size={24} color="#000" />
                        <Text style={styles.label}>Email</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.email}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Ionicons name="call-outline" size={24} color="#000" />
                        <Text style={styles.label}>Phone</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.phoneNumber}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Ionicons name="calendar-outline" size={24} color="#000" />
                        <Text style={styles.label}>Birthdate</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.birthDate}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Ionicons name="location-outline" size={24} color="#000" />
                        <Text style={styles.label}>Address</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.address}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={styles.iconLabelContainer}>
                        <Ionicons name="person-outline" size={24} color="#000" />
                        <Text style={styles.label}>Gender</Text>
                    </View>
                    <View style={styles.outputContainer}>
                        <Text style={styles.value}>{user.gender}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
        fontSize: 15,
        fontWeight: "bold",
        color: "#2C3E50",
    },
    detailsContainer: {
        marginBottom: 10,
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
        fontSize: 15,
        color: "#34495E",
        marginLeft: 10,
    },
    value: {
        fontSize: 13,
        fontWeight: "600",
        color: "#7F8C8D",
    },
    logoutButton: {
        backgroundColor: "#F6F6F6",
        paddingVertical: 10,
        borderRadius: 30,
        marginVertical: -10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 5,
        width: "50%",
        alignSelf: "center",
    },
});
