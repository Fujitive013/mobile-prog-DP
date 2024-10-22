import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from 'axios';
import * as Location from 'expo-location';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Add icon library
import haversine from 'haversine'; // Import haversine for distance calculation
import * as Speech from 'expo-speech'; // Import the speech module
import styles from '../../Styles/Booking'; // Import your styles here
import { useNavigation } from '@react-navigation/native'; // Import the hook

export default function App() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentAddress, setCurrentAddress] = useState('Fetching location...');
  const [destination, setDestination] = useState(null);  // Initially empty destination
  const [destinationCoords, setDestinationCoords] = useState(null); // Store destination coordinates
  const [fare, setFare] = useState(null); // State for fare
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const handleConfirmRide = () => {
        Alert.alert(
            "Confirm Ride",
            "Are you sure you want to confirm this ride?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Ride not confirmed"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => navigation.navigate('ConfirmedBooking', { fare }) // Navigate if confirmed
                }
            ]
        );
    };

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

  const userLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      const { latitude, longitude } = location.coords;

      // Update the map region based on the current location
      setMapRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Update current location coordinates for the marker
      setCurrentCoords({ latitude, longitude });

      // Reverse geocoding to get address from latitude and longitude
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      });

      // Extract the address (city, region, etc.)
      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        setCurrentAddress(`${address.city}, ${address.region}`);
      }
    } catch (error) {
      console.log('Error fetching location: ', error);
      setCurrentAddress('Unable to fetch location');
    }
  };

  useEffect(() => {
    userLocation();
  }, []);

  const handleInputChange = async (input) => {
    setQuery(input);

    if (input.length > 2) {
      try {
        const response = await axios.get('https://maps.gomaps.pro/maps/api/place/autocomplete/json', {
          params: {
            input: input,
            key: 'AlzaSy4K5kA7hcxUL4UzwGodXFs2gp4Hnqg56OU', // Replace with your API key
            components: 'country:ph',
          },
        });

        if (response.data.predictions) {
          setSuggestions(response.data.predictions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching autocomplete data:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const decodePolyline = (encoded) => {
    let poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = (result >> 1) ^ (-(result & 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = (result >> 1) ^ (-(result & 1));
        lng += dlng;

        poly.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    return poly;
  };

  const handleSuggestionPress = async (description) => {
    setQuery(description);    // Set the input to the selected suggestion
    setDestination(description); // Set the destination with the selected suggestion
    setSuggestions([]); // Clear suggestions

    // Speak the destination address using Expo's Speech API
    Speech.speak(`Destination set to ${description}`);

    // Fetch geocode for the selected location
    const geocode = await fetchGeocode(description);

    if (geocode) {
      // Update map region to move to the selected location
      setMapRegion({
        latitude: geocode.latitude,
        longitude: geocode.longitude,
        latitudeDelta: 0.01, // Zoom into the selected location
        longitudeDelta: 0.01,
      });

      // Update destination coordinates for the marker
      setDestinationCoords(geocode);

      // Fetch directions after getting destination coordinates
      await fetchDirections(currentCoords, geocode);

      // Calculate the fare based on the distance
      const distance = haversine(currentCoords, geocode, { unit: 'km' });
      calculateFare(distance);
    }
  };

  const fetchGeocode = async (address) => {
    try {
      const response = await axios.get('https://maps.gomaps.pro/maps/api/geocode/json', {
        params: {
          address: address,
          key: 'AlzaSy4K5kA7hcxUL4UzwGodXFs2gp4Hnqg56OU', // Replace with your API key
        },
      });

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.error('No results found for this address');
        return null;
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
      return null;
    }
  };

  const fetchDirections = async (origin, destination) => {
    try {
      const response = await axios.get('https://maps.gomaps.pro/maps/api/directions/json', {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          key: 'AlzaSy4K5kA7hcxUL4UzwGodXFs2gp4Hnqg56OU', // Replace with your API key
        },
      });

      console.log('Directions API Response:', response.data);

      if (response.data.routes.length > 0) {
        // Decode the overview polyline to get the route coordinates
        const polyline = response.data.routes[0].overview_polyline.points;
        const points = decodePolyline(polyline); // Decode the polyline string
        
        setRouteCoordinates(points); // Set the route coordinates
      }
    } catch (error) {
        console.error('Error fetching directions:', error);
    }
  };

  const calculateFare = (distance) => {
    let calculatedFare = 0;

    if (distance <= 2) {
      calculatedFare = 50; // Base fare
    } else if (distance <= 7) {
      calculatedFare = 50 + (distance - 2) * 10;
    } else {
      calculatedFare = 50 + (7 - 2) * 10 + (distance - 7) * 15;
    }

    setFare(calculatedFare.toFixed(2)); // Set fare with 2 decimal points
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        mapType='standard'
      >
        {/* Marker for Current Location */}
        <Marker
          coordinate={currentCoords}
          title="Your Location"
        />

        {/* Marker for Destination */}
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor="#0fa859"
          />
        )}

        {/* Draw the route line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#1a91d6" // Light blue color
            strokeWidth={2} // Width of the line
          />
        )}
      </MapView>

      <View style={styles.locationInfo}>
        <View style={styles.locationContainer}>
            {/* Display the Current Location */}
            <View style={styles.locationsubContainer}>
                <View style={styles.locationRow}>
                    <View style={styles.circle} />
                    <Text style={styles.currentLocation}>Current Location</Text>
                </View>
                <Text style={styles.currentLoc}>{currentAddress} {"\n"}</Text>
            </View>

            {/* Display the selected Destination only if set */}
            {destination && (
                <>
                    <View style={styles.locationRow}>
                        <View style={styles.circle} />
                        <Text style={styles.destinationLocation}>Destination</Text>
                    </View>
                    <Text style={styles.destinationLoc}>{destination}</Text>
                </>
            )}
        </View>
      </View>

      {/* Fare Display */}
      {fare && (
        <View style={styles.fareContainer}>
          <Text style={styles.fareText}>Estimated Fare: ₱{fare}</Text>
        </View>
      )}

      {/* Confirm Button */}
      {fare && ( // Only show button if fare is calculated
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmRide}>
              <Text style={styles.confirmText}>CONFIRM RIDE</Text>
          </TouchableOpacity>
      )}
      
      <View style={styles.searchContainerWrapper}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={17} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Type a location"
            value={query}
            onChangeText={handleInputChange}
          />
        </View>

        {/* Suggestions List */}
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionPress(item.description)}>
              <Text style={styles.item}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      <Button title="Get Location" onPress={userLocation} />
    </View>
  );
}