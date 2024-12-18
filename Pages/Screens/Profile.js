import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.3:5000/user/details",
          {
            withCredentials: true,
          }
        );
        console.log("Fetched User Data:", response.data);
        setUser(response.data.user);
      } catch (error) {
        console.log("Failed to fetch user data:", error);
        navigation.navigate("LandingPage");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "LandingPage" }],
              })
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No user data available.</Text>
      </View>
    );
  }

  const formattedBirthdate = user?.birthdate
    ? formatDate(user.birthdate)
    : "Not provided";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../Images/profile.jpg')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.subtitle}>{user.gender}</Text>
      </View>
      <TouchableOpacity style={styles.editProfileButton}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <InfoItem label="Email" value={user.email} />
        <InfoItem label="Phone" value={user.phone || "Not provided"} />
        <InfoItem label="Birthdate" value={formattedBirthdate} />
        <InfoItem label="Address" value={user.address || "Not provided"} />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={24}
          color="#fff"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#3897f0",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  editProfileButton: {
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F0F2F5",
    width: "90%",
    borderRadius: 20,
  },
  editProfileText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    padding: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    color: "#888",
  },
  infoValue: {
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3897f0",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Profile;
