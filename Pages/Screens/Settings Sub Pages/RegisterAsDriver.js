import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";

export default function RegisterAsDriver() {
  const navigation = useNavigation();
  const [bikeModel, setBikeModel] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [location, setLocation] = useState({
    latitude: 8.4542, // Default to Cagayan de Oro coordinates
    longitude: 124.6319,
  });

  const Settings = () => {
    navigation.navigate("Dashboard", { screen: "settings" });
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const handleSubmit = async () => {
    if (!bikeModel || !licenseNumber || !location?.latitude || !location?.longitude) {
        Alert.alert('Error', 'Please fill in all fields, including your location.');
        return;
    }

    try {
        const response = await axios.post(
            'http://192.168.1.3:5000/driver/register',
            {
                bike_model: bikeModel,
                license_number: licenseNumber,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            },
            {
                withCredentials: true // Ensures cookies are sent for session handling
            }
        );

        if (response.data.success) {
            Alert.alert('Success', 'Successfully registered as driver');
            navigation.navigate('DashboardDriver'); // Navigate to driver-specific dashboard
        } else {
            Alert.alert('Error', response.data.message || 'Failed to register as driver');
        }
    } catch (error) {
        console.error("Registration error:", error);
        Alert.alert('Error', error.response?.data?.message || 'Registration failed. Please try again later.');
    }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={Settings}>
          <Ionicons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register as Driver</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bike Model</Text>
          <TextInput
            style={styles.input}
            value={bikeModel}
            onChangeText={setBikeModel}
            placeholder="Enter your bike model"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>License Number</Text>
          <TextInput
            style={styles.input}
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="Enter your license number"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Your Location</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Register</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#2089dc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
