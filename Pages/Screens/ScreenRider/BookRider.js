import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute } from "@react-navigation/native";

const BookRider = () => {
    const route = useRoute();
    const { rideDetails } = route.params || {};
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);

    useEffect(() => {
        (async () => {
            // Get location permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Get current location
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            // Convert pickup address to coordinates
            try {
                const pickupGeocode = await Location.geocodeAsync(rideDetails.pickupLocation);
                if (pickupGeocode.length > 0) {
                    setPickupCoords({
                        latitude: pickupGeocode[0].latitude,
                        longitude: pickupGeocode[0].longitude,
                    });
                }

                // Convert destination address to coordinates
                const destinationGeocode = await Location.geocodeAsync(rideDetails.destination);
                if (destinationGeocode.length > 0) {
                    setDestinationCoords({
                        latitude: destinationGeocode[0].latitude,
                        longitude: destinationGeocode[0].longitude,
                    });
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            }
        })();
    }, [rideDetails]);

    // Update map region to fit all markers
    useEffect(() => {
        if (pickupCoords && destinationCoords) {
            // Calculate the center point between pickup and destination
            const midLat = (pickupCoords.latitude + destinationCoords.latitude) / 2;
            const midLng = (pickupCoords.longitude + destinationCoords.longitude) / 2;

            // Calculate the delta to ensure both points are visible
            const latDelta = Math.abs(pickupCoords.latitude - destinationCoords.latitude) * 1.5;
            const lngDelta = Math.abs(pickupCoords.longitude - destinationCoords.longitude) * 1.5;

            setMapRegion({
                latitude: midLat,
                longitude: midLng,
                latitudeDelta: Math.max(latDelta, 0.0922),
                longitudeDelta: Math.max(lngDelta, 0.0421),
            });
        }
    }, [pickupCoords, destinationCoords]);

    return (
        <View style={styles.container}>
            {mapRegion && (
                <>
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={mapRegion}
                    >
                        {location && (
                            <Marker
                                coordinate={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                title="Your Location"
                                pinColor="blue"
                            />
                        )}
                        
                        {pickupCoords && (
                            <Marker
                                coordinate={pickupCoords}
                                title="Pickup Location"
                                description={rideDetails.pickupLocation}
                                pinColor="red"
                            />
                        )}

                        {destinationCoords && (
                            <Marker
                                coordinate={destinationCoords}
                                title="Destination"
                                description={rideDetails.destination}
                                pinColor="green"
                            />
                        )}
                    </MapView>

                    <View style={styles.rideDetailsContainer}>
                        <Text style={styles.passengerName}>Passenger: {rideDetails.passengerName}</Text>
                        <View style={styles.locationContainer}>
                            <View style={styles.locationItem}>
                                <View style={[styles.dot, { backgroundColor: 'red' }]} />
                                <Text style={styles.locationText}>Pickup: {rideDetails.pickupLocation}</Text>
                            </View>
                            <View style={styles.locationItem}>
                                <View style={[styles.dot, { backgroundColor: 'green' }]} />
                                <Text style={styles.locationText}>Destination: {rideDetails.destination}</Text>
                            </View>
                        </View>
                        <Text style={styles.fareText}>Fare: ₱{rideDetails.fare}</Text>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    rideDetailsContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    passengerName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
    locationContainer: {
        marginVertical: 10,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    locationText: {
        flex: 1,
        fontSize: 14,
    },
    fareText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#2ecc71',
    },
});

export default BookRider;