import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";

const BookRider = () => {
    const route = useRoute();
    const { rideDetails } = route.params || {};
    const [rideStarted, setRideStarted] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: rideDetails?.latitude || 8.4542, // Use passed latitude or default
        longitude: rideDetails?.longitude || 124.6319, // Use passed longitude or default
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [routeToPickup, setRouteToPickup] = useState([]);
    const [routeToDestination, setRouteToDestination] = useState([]);
    const [latitude, setLatitude] = useState(rideDetails?.latitude);
    const [longitude, setLongitude] = useState(rideDetails?.longitude);

    console.log(latitude, longitude);
    console.log(rideDetails);
    const startRide = async () => {
        try {
            // Update the ride status to "accepted"
            await axios.put(
                `http://192.168.18.24:5000/bookings/${rideDetails.bookingId}`,
                {
                    status: "accepted",
                }
            );
            console.log("Ride status updated successfully");

            // Post the ride details to the server
            const ridePayload = {
                driver_name: rideDetails.driver_name,
                user_id: rideDetails.user_id,
                booking_id: rideDetails.bookingId, // Booking ID from rideDetails
                pickup_location: rideDetails.pickupLocation, // Pickup location
                destination: rideDetails.destination, // Destination
                fare: rideDetails.fare, // Ride fare
                status: "active", // Start the ride with "in-progress" status
                created_at: new Date().toISOString(), // Record the current time as ride start time
                updated_at: new Date().toISOString(), // Record the current time as ride start time
                ride_rating: null,
            };

            const response = await axios.post(
                `http://192.168.18.24:5000/rides`, // Replace with your API endpoint
                ridePayload
            );

            if (response.status === 201) {
                console.log("Ride started successfully:", response.data);
                setRideStarted(true); // Set rideStarted to true when the ride starts
            } else {
                console.error("Failed to start the ride:", response.statusText);
            }
        } catch (error) {
            console.error("Error starting the ride:", error.message);
        }
    };

    const locationArrived = async () => {
        console.log("Ride Details Booking ID:", rideDetails.user_id);
        try {
            // Update the ride status to "completed"
            const response = await axios.put(
                `http://192.168.18.24:5000/rides/${rideDetails.user_id}`,
                { status: "completed" }
            );

            if (response.status === 200) {
                console.log("Ride status updated to completed successfully");
            } else {
                console.error(
                    "Failed to update ride status:",
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error updating ride status:", error.message);
        }
    };

    // Function to fetch route coordinates using Google Directions API
    const getRouteCoordinates = async (origin, destination) => {
        try {
            const response = await fetch(
                `https://maps.gomaps.pro/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=AlzaSyilaNQygZ6THEJgkJhCjE3AvACgHCE2qkM`
            );
            const data = await response.json();
            if (data.routes.length > 0) {
                const points = data.routes[0].overview_polyline.points;
                return decodePolyline(points);
            }
            return [];
        } catch (error) {
            console.error("Error fetching route:", error);
            return [];
        }
    };

    // Function to decode Google's polyline format
    const decodePolyline = (encoded) => {
        const points = [];
        let index = 0,
            lat = 0,
            lng = 0;

        while (index < encoded.length) {
            let shift = 0,
                result = 0;
            let byte;
            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            const dlat = result & 1 ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            const dlng = result & 1 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            points.push({
                latitude: lat * 1e-5,
                longitude: lng * 1e-5,
            });
        }
        return points;
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            // Only proceed if there are ride details
            if (rideDetails) {
                try {
                    // Set pickup coordinates directly from database values
                    const pickupLocation = {
                        latitude: parseFloat(rideDetails.latitude),
                        longitude: parseFloat(rideDetails.longitude),
                    };
                    setPickupCoords(pickupLocation);

                    // Update map region to center on pickup location
                    setMapRegion({
                        latitude: pickupLocation.latitude,
                        longitude: pickupLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });

                    // Get destination coordinates through geocoding
                    const destinationGeocode = await Location.geocodeAsync(
                        rideDetails.destination
                    );
                    if (destinationGeocode.length > 0) {
                        setDestinationCoords({
                            latitude: destinationGeocode[0].latitude,
                            longitude: destinationGeocode[0].longitude,
                        });
                    }
                } catch (error) {
                    console.error("Geocoding error:", error);
                }
            }
        })();
    }, [rideDetails]);

    useEffect(() => {
        const fetchRoutes = async () => {
            if (location && pickupCoords) {
                const routeToPickupPoints = await getRouteCoordinates(
                    {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                    pickupCoords
                );
                setRouteToPickup(routeToPickupPoints);
            }
            if (pickupCoords && destinationCoords) {
                const routeToDestinationPoints = await getRouteCoordinates(
                    pickupCoords,
                    destinationCoords
                );
                setRouteToDestination(routeToDestinationPoints);
            }
        };

        if (rideDetails) {
            fetchRoutes();
        }
    }, [location, pickupCoords, destinationCoords, rideDetails]);

    useEffect(() => {
        if (rideDetails && pickupCoords && destinationCoords) {
            const midLat =
                (pickupCoords.latitude + destinationCoords.latitude) / 2;
            const midLng =
                (pickupCoords.longitude + destinationCoords.longitude) / 2;

            const latDelta =
                Math.abs(pickupCoords.latitude - destinationCoords.latitude) *
                1.5;
            const lngDelta =
                Math.abs(pickupCoords.longitude - destinationCoords.longitude) *
                1.5;

            setMapRegion({
                latitude: midLat,
                longitude: midLng,
                latitudeDelta: Math.max(latDelta, 0.0922),
                longitudeDelta: Math.max(lngDelta, 0.0421),
            });
        }
    }, [pickupCoords, destinationCoords, rideDetails]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                region={mapRegion}
            >
                {/* Always show current location marker */}
                {location?.coords && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Your Location"
                    >
                        <View style={styles.customMarker}>
                            <FontAwesome5
                                name="motorcycle"
                                size={24}
                                color="#2089dc"
                            />
                        </View>
                    </Marker>
                )}

                {/* Show booking-related markers only if there's a ride */}
                {rideDetails && (
                    <>
                        {pickupCoords && (
                            <Marker
                                coordinate={pickupCoords}
                                title="Pickup Location"
                                description={rideDetails.pickupLocation}
                            >
                                <View
                                    style={[
                                        styles.customMarker,
                                        styles.pickupMarker,
                                    ]}
                                >
                                    <MaterialIcons
                                        name="location-on"
                                        size={30}
                                        color="#ff4757"
                                    />
                                </View>
                            </Marker>
                        )}

                        {destinationCoords && (
                            <Marker
                                coordinate={destinationCoords}
                                title="Destination"
                                description={rideDetails.destination}
                            >
                                <View
                                    style={[
                                        styles.customMarker,
                                        styles.destinationMarker,
                                    ]}
                                >
                                    <MaterialIcons
                                        name="location-on"
                                        size={30}
                                        color="#2ed573"
                                    />
                                </View>
                            </Marker>
                        )}

                        {routeToPickup.length > 0 && (
                            <Polyline
                                coordinates={routeToPickup}
                                strokeWidth={4}
                                strokeColor="#ff4757"
                                lineDashPattern={[1]}
                            />
                        )}

                        {routeToDestination.length > 0 && (
                            <Polyline
                                coordinates={routeToDestination}
                                strokeWidth={4}
                                strokeColor="#2ed573"
                                lineDashPattern={[1]}
                            />
                        )}
                    </>
                )}
            </MapView>

            {rideDetails && (
                <View style={styles.rideDetailsContainer}>
                    <View style={styles.header}>
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <FontAwesome5
                                    name="user-circle"
                                    size={35}
                                    color="#2089dc"
                                />
                            </View>
                            <View style={styles.nameSection}>
                                <Text style={styles.passengerName}>
                                    {rideDetails.passengerName}
                                </Text>
                                <View style={styles.ratingFareContainer}>
                                    <Text style={styles.ratingText}>
                                        ₱{rideDetails.fare}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.startRideButton,
                                {
                                    backgroundColor: rideStarted
                                        ? "#56b1d6"
                                        : "#2ed573",
                                },
                            ]}
                            onPress={rideStarted ? locationArrived : startRide} // Call locationArrived if rideStarted is true, otherwise call startRide
                        >
                            <Text style={styles.startRideText}>
                                {rideStarted
                                    ? "LOCATION ARRIVED"
                                    : "START RIDE"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.locationContainer}>
                        <View style={styles.locationItem}>
                            <View style={styles.locationIcon}>
                                <MaterialIcons
                                    name="my-location"
                                    size={20}
                                    color="#ff4757"
                                />
                            </View>
                            <View style={styles.locationTextContainer}>
                                <Text style={styles.locationLabel}>PICKUP</Text>
                                <Text style={styles.locationText}>
                                    {rideDetails.pickupLocation}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.routeLine} />

                        <View style={styles.locationItem}>
                            <View style={styles.locationIcon}>
                                <MaterialIcons
                                    name="location-on"
                                    size={24}
                                    color="#2ed573"
                                />
                            </View>
                            <View style={styles.locationTextContainer}>
                                <Text style={styles.locationLabel}>
                                    DROP-OFF
                                </Text>
                                <Text style={styles.locationText}>
                                    {rideDetails.destination}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    customMarker: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rideDetailsContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        maxHeight: "40%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatarContainer: {
        marginRight: 15,
    },
    nameSection: {
        justifyContent: "center",
        flex: 1,
    },
    passengerName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2c3e50",
    },
    ratingFareContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 2,
    },
    ratingText: {
        fontSize: 14,
        color: "#7f8c8d",
    },
    fareAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2c3e50",
    },
    startRideButton: {
        backgroundColor: "#2ed573",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    startRideText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#e0e0e0",
    },
    locationContainer: {
        marginVertical: 5,
    },
    locationItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
    },
    locationIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    locationTextContainer: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 10,
        color: "#7f8c8d",
        marginBottom: 2,
    },
    locationText: {
        fontSize: 12,
        color: "#2c3e50",
        fontWeight: "500",
    },
    routeLine: {
        width: 2,
        height: 20,
        backgroundColor: "#e0e0e0",
        marginLeft: 17,
    },
});

export default BookRider;
