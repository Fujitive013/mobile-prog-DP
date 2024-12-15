import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; // Import Location from expo-location

const TrackRider = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);

    const fetchCurrentLocation = async () => {
        try {
            const response = await axios.get("http://192.168.1.3:5000/driver/getCurrentLocation");
            console.log("Current Location:", response.data);
            if (response.data && response.data.latitude && response.data.longitude) {
                const newLocation = {
                    latitude: response.data.latitude,
                    longitude: response.data.longitude,
                };
                setCurrentLocation(newLocation);
                
                // Automatically set map region to current location when fetched
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
            console.log("Error fetching current location:", error.response ? error.response.data : error.message);
            setCurrentLocation(null);
        }
    };

    const getUserLocation = async () => {
        // Request permission to access location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        // Get the user's current location
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    };

    useEffect(() => {
        fetchCurrentLocation();
        getUserLocation();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                // Use mapRegion if available, otherwise fallback to userLocation or default
                region={mapRegion}
            >
                {currentLocation && (
                    <Marker
                        coordinate={currentLocation}
                        title="Rider's Location"
                        description="This is where the rider is currently located."
                        pinColor="blue"  // Optional: Make it visually distinct
                    />
                )}
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Your Location"
                        description="This is your current location."
                        pinColor="red"  // Optional: Different color for user location
                    />
                )}
            </MapView>
            <Text style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
                {currentLocation ? `Rider: Lat: ${currentLocation.latitude}, Lon: ${currentLocation.longitude}` : "Rider location not available"}
            </Text>
            <Text style={{ position: 'absolute', top: 30, left: 10, color: 'white' }}>
                {userLocation ? `You: Lat: ${userLocation.latitude}, Lon: ${userLocation.longitude}` : "Your location not available"}
            </Text>
        </View>
    );
};

export default TrackRider;