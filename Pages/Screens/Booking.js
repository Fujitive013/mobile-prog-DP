import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button,
    Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import haversine from "haversine";
import * as Speech from "expo-speech";
import { useNavigation } from "@react-navigation/native";

export default function App() {
    const navigation = useNavigation();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [currentAddress, setCurrentAddress] = useState(
        "Fetching location..."
    );
    const [destination, setDestination] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [fare, setFare] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [currentCoords, setCurrentCoords] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    });

    const handleConfirmRide = () => {
        Alert.alert(
            "Confirm Ride",
            "Are you sure you want to confirm this ride?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Ride not confirmed"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () =>
                        navigation.navigate("ConfirmedBooking", { fare }),
                },
            ]
        );
    };

    const userLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                enableHighAccuracy: true,
            });
            const { latitude, longitude } = location.coords;

            setMapRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            setCurrentCoords({ latitude, longitude });

            let addressResponse = await Location.reverseGeocodeAsync({
                latitude: latitude,
                longitude: longitude,
            });

            if (addressResponse.length > 0) {
                const address = addressResponse[0];
                const detailedAddress = `${address.street || ""}, ${
                    address.name || ""
                }, ${address.district || ""}, ${address.city || ""}, ${
                    address.region || ""
                }, ${address.postalCode || ""}, ${address.country || ""}`;
                setCurrentAddress(detailedAddress);
            }
        } catch (error) {
            console.log("Error fetching location: ", error);
            setCurrentAddress("Unable to fetch location");
        }
    };

    useEffect(() => {
        userLocation();
    }, []);

    const handleInputChange = async (input) => {
        setQuery(input);
        if (input.length > 2) {
            try {
                const response = await axios.get(
                    "https://maps.gomaps.pro/maps/api/place/autocomplete/json",
                    {
                        params: {
                            input: input,
                            key: "AlzaSyAkLKzv7MYrCtLPG2WFzYA1el9jnc_O84r",
                            components: "country:ph",
                        },
                    }
                );

                if (response.data.predictions) {
                    setSuggestions(response.data.predictions);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Error fetching autocomplete data:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionPress = async (description) => {
        setQuery(description);
        setDestination(description);
        setSuggestions([]);

        Speech.speak(`Destination set to ${description}`);

        const geocode = await fetchGeocode(description);

        if (geocode) {
            setMapRegion({
                latitude: geocode.latitude,
                longitude: geocode.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            setDestinationCoords(geocode);

            await fetchDirections(currentCoords, geocode);

            const distance = haversine(currentCoords, geocode, { unit: "km" });
            calculateFare(distance);
        }
    };

    const fetchGeocode = async (address) => {
        try {
            const response = await axios.get(
                "https://maps.gomaps.pro/maps/api/geocode/json",
                {
                    params: {
                        address: address,
                        key: "AlzaSyAkLKzv7MYrCtLPG2WFzYA1el9jnc_O84r",
                    },
                }
            );

            if (response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry.location;
                return { latitude: lat, longitude: lng };
            } else {
                console.error("No results found for this address");
                return null;
            }
        } catch (error) {
            console.error("Error fetching geocode:", error);
            return null;
        }
    };

    const fetchDirections = async (origin, destination) => {
        try {
            const response = await axios.get(
                "https://maps.gomaps.pro/maps/api/directions/json",
                {
                    params: {
                        origin: `${origin.latitude},${origin.longitude}`,
                        destination: `${destination.latitude},${destination.longitude}`,
                        key: "AlzaSyAkLKzv7MYrCtLPG2WFzYA1el9jnc_O84r",
                    },
                }
            );

            if (response.data.routes.length > 0) {
                const polyline =
                    response.data.routes[0].overview_polyline.points;
                const points = decodePolyline(polyline);
                setRouteCoordinates(points);
            }
        } catch (error) {
            console.error("Error fetching directions:", error);
        }
    };

    const decodePolyline = (encoded) => {
        let poly = [];
        let index = 0,
            len = encoded.length;
        let lat = 0,
            lng = 0;

        while (index < len) {
            let b,
                shift = 0,
                result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlat = (result >> 1) ^ -(result & 1);
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlng = (result >> 1) ^ -(result & 1);
            lng += dlng;

            poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
        return poly;
    };

    const calculateFare = (distance) => {
        let calculatedFare = 0;

        if (distance <= 2) {
            calculatedFare = 50;
        } else if (distance <= 7) {
            calculatedFare = 50 + (distance - 2) * 10;
        } else {
            calculatedFare = 50 + (7 - 2) * 10 + (distance - 7) * 15;
        }

        setFare(calculatedFare.toFixed(2));
    };

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={mapRegion} mapType="standard">
                <Marker
                    coordinate={currentCoords}
                    title="Your Location"
                    pinColor="#1a91d6"
                />

                {destinationCoords && (
                    <Marker
                        coordinate={destinationCoords}
                        title="Destination"
                        pinColor="#0fa859"
                    />
                )}

                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#1a91d6"
                        strokeWidth={4}
                    />
                )}
            </MapView>

            <View style={styles.locationInfo}>
                <View style={styles.LocDesContainer}>
                    <View style={styles.locationContainer}>
                        <View style={styles.locationRow}>
                            <View style={styles.circle} />
                            <Text style={styles.currentLocation}>
                                Current Location
                            </Text>
                        </View>
                        <Text style={styles.currentLoc}>{currentAddress}</Text>
                    </View>
                    <View style={styles.DestinationContainer}>
                        <View style={styles.destinationRow}>
                            <View style={styles.square} />
                            <Text style={styles.destinationLabel}>
                                Destination
                            </Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Search destination..."
                            onChangeText={handleInputChange}
                            value={query}
                        />

                        {suggestions.length > 0 && (
                            <FlatList
                                data={suggestions}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleSuggestionPress(
                                                item.description
                                            )
                                        }
                                        style={styles.suggestionItem}
                                    >
                                        <Text>{item.description}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.place_id}
                                style={styles.suggestionList}
                            />
                        )}
                    </View>
                </View>

                {fare && (
                    <View style={styles.fareContainer}>
                        <Text style={styles.fareText}>
                            Estimated Fare: ₱{fare}
                        </Text>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirmRide}
                        >
                            <Text style={styles.confirmButtonText}>
                                Confirm
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    locationInfo: {
        width: "100%",
        height: "45%",
        backgroundColor: "#ffffff",
        paddingVertical: 20,
        paddingHorizontal: 7.5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    locationContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    LocDesContainer: {
        backgroundColor: "#f5f5f5",
        padding: 5,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        elevation: 10,
    },
    DestinationContainer: {
        paddingBottom: 10,
        paddingHorizontal: 15,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3,
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#1a91d6",
        marginRight: 8,
    },
    square: {
        width: 8,
        height: 8,
        backgroundColor: "#0fa859",
        marginRight: 8,
    },
    destinationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    currentLocation: {
        fontWeight: "bold",
        fontSize: 14,
    },
    currentLoc: {
        fontSize: 12,
        color: "#555",
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: "black",
    },
    destinationLabel: {
        fontWeight: "bold",
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#f4f3ff",
        padding: 8,
        borderRadius: 8,
        fontSize: 14,
        marginBottom: 8,
    },
    suggestionList: {
        maxHeight: 120,
    },
    suggestionItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    fareContainer: {
        marginTop: 25,
        alignItems: "center",
    },
    confirmButton: {
        backgroundColor: "#956AF1",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        width: "25%",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    fareText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
});
