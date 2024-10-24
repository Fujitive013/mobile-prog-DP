import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from 'axios';
import * as Location from 'expo-location';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import haversine from 'haversine';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentAddress, setCurrentAddress] = useState('Fetching location...');
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
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => navigation.navigate('ConfirmedBooking', { fare })
        }
      ]
    );
  };

  const userLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
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
        const detailedAddress = `${address.street || ''}, ${address.name || ''}, ${address.district || ''}, ${address.city || ''}, ${address.region || ''}, ${address.postalCode || ''}, ${address.country || ''}`;
        setCurrentAddress(detailedAddress);
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
            key: 'AlzaSyAkLKzv7MYrCtLPG2WFzYA1el9jnc_O84r',
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

      const distance = haversine(currentCoords, geocode, { unit: 'km' });
      calculateFare(distance);
    }
  };

  const fetchGeocode = async (address) => {
    try {
      const response = await axios.get('https://maps.gomaps.pro/maps/api/geocode/json', {
        params: {
          address: address,
          key: 'AlzaSyAkLKzv7MYrCtLPG2WFzYA1el9jnc_O84r',
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
          key: 'AlzaSyAkLKzv7MYrCtLPG2WFzYA1el9jnc_O84r',
        },
      });

      if (response.data.routes.length > 0) {
        const polyline = response.data.routes[0].overview_polyline.points;
        const points = decodePolyline(polyline);
        setRouteCoordinates(points);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
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
      <MapView
        style={styles.map}
        region={mapRegion}
        mapType='standard'
      >
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
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <View style={styles.circle} />
            <Text style={styles.currentLocation}>Current Location</Text>
          </View>
          <Text style={styles.currentLoc}>{currentAddress}</Text>

          {destination && (
            <>
              <View style={styles.locationRow}>
                <View style={styles.square} />
                <Text style={styles.destinationLabel}>Destination</Text>
              </View>
              <Text style={styles.destination}>{destination}</Text>
            </>
          )}
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
                onPress={() => handleSuggestionPress(item.description)}
                style={styles.suggestionItem}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionList}
          />
        )}

        {fare && (
          <View style={styles.fareContainer}>
            <Text style={styles.fareText}>Estimated Fare: ₱{fare}</Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmRide}
            >
              <Text style={styles.confirmButtonText}>Confirm Ride</Text>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationInfo: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 15,  // Reduced padding
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
  },
  locationContainer: {
    marginBottom: 15,  // Reduced margin
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,  // Reduced margin
  },
  circle: {
    width: 8,  // Reduced size
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a91d6',
    marginRight: 8,  // Reduced margin
  },
  square: {
    width: 8,  // Reduced size
    height: 8,
    backgroundColor: '#0fa859',
    marginRight: 8,  // Reduced margin
  },
  currentLocation: {
    fontWeight: 'bold',
    fontSize: 14,  // Reduced font size
  },
  currentLoc: {
    fontSize: 12,  // Reduced font size
    color: '#555',
  },
  destinationLabel: {
    fontWeight: 'bold',
    fontSize: 14,  // Reduced font size
  },
  destination: {
    fontSize: 12,  // Reduced font size
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,  // Reduced padding
    borderRadius: 8,
    fontSize: 14,  // Reduced font size
    marginBottom: 8,  // Reduced margin
  },
  suggestionList: {
    maxHeight: 120,  // Reduced max height
  },
  suggestionItem: {
    paddingVertical: 8,  // Reduced padding
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  fareContainer: {
    marginTop: 8,  // Reduced margin
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#956AF1',
    padding: 10,  // Reduced padding
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,  // Reduced font size
    fontWeight: 'bold',
  },
  fareText: {
    fontSize: 16,  // Reduced font size
    fontWeight: 'bold',
    marginBottom: 8,  // Reduced margin
  },
});
