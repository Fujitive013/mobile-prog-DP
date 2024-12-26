import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const TrackRider = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);
    const [activeRide, setActiveRide] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    const fetchActiveRide = async () => {
        try {
            const response = await axios.get(
                "http://192.168.18.24:5000/view/activeRides"
            );
            if (response.data && response.data.length > 0) {
                setActiveRide(response.data[0]);
            } else {
                setActiveRide(null);
            }
        } catch (error) {
            console.log(
                "Error fetching active ride:",
                error.response ? error.response.data : error.message
            );
            setActiveRide(null);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const fetchCurrentLocation = async () => {
        try {
            const response = await axios.get(
                "http://192.168.18.24:5000/driver/getCurrentLocation"
            );
            console.log("Current Location:", response.data);
            if (
                response.data &&
                response.data.latitude &&
                response.data.longitude
            ) {
                const newLocation = {
                    latitude: response.data.latitude,
                    longitude: response.data.longitude,
                };
                setCurrentLocation(newLocation);

                setMapRegion({
                    latitude: newLocation.latitude,
                    longitude: newLocation.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                });
            } else {
                setCurrentLocation(null);
            }
        } catch (error) {
            console.log(
                "Error fetching current location:",
                error.response ? error.response.data : error.message
            );
            setCurrentLocation(null);
        }
    };

    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.log("Permission to access location was denied");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    };

    useEffect(() => {
        fetchActiveRide();
        fetchCurrentLocation();
        getUserLocation();

        const updateInterval = setInterval(() => {
            fetchActiveRide();
            fetchCurrentLocation();
        }, 3000);

        return () => clearInterval(updateInterval);
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#3498DB" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!activeRide) {
        return (
            <View style={styles.container}>
                <Text style={styles.noRideText}>
                    You haven't booked a ride yet.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={mapRegion}>
                {currentLocation && (
                    <Marker
                        coordinate={currentLocation}
                        title="Rider's Location"
                        description="This is where the rider is currently located."
                        image={require("../../../Images/motorbike.png")} // Replace with the path to your image
                    />
                )}
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Your Location"
                        description="This is your current location."
                        image={require("../../../Images/userlocation.png")}
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    noRideText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "#e74c3c",
        padding: 15,
        borderRadius: 10,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default TrackRider;
