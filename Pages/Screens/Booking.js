import { StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Booking = () => {
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [currentAddress, setCurrentAddress] = useState('Fetching location...');
    const [destination, setDestination] = useState('');  // Initially empty destination
    const [destinations, setDestinations] = useState([
        { id: '1', title: 'Ustp, CDOC', coords: { latitude: 8.473, longitude: 124.624 }},
        { id: '2', title: 'Bonbon, Cagayan de Oro', coords: { latitude: 8.450, longitude: 124.620 }},
        { id: '3', title: 'Divisoria, CDO', coords: { latitude: 8.484, longitude: 124.645 }},
    ]); // Predefined list of popular destinations

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

    const selectDestination = (destination) => {
        setDestination(destination.title);
        setMapRegion({
            ...mapRegion,
            ...destination.coords,
        });
    };

    return (
        <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                region={mapRegion}
                mapType='standard'
            >
                <Marker coordinate={mapRegion} title="Your Location" />
            </MapView>
            <View style={styles.searchContainer}>
                <View style={styles.insideSearchContainer}>
                    <Icon name="search" size={24} color="gray" style={styles.icon} />
                    <TextInput 
                        placeholder="Search for a destination" 
                        placeholderTextColor="#999" 
                        style={styles.input}
                        onChangeText={setDestination}
                        value={destination}
                    />
                    <Icon name="mic" size={24} color="gray" style={styles.icon} />
                </View>
            </View>
            <FlatList
                data={destinations}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => selectDestination(item)}>
                        <Text style={styles.destinationItem}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
            <View style={styles.locationInfo}>
                <View style={styles.locationContainer}>
                    {/* Display the Current Location */}
                    <View style={styles.locationRow}>
                        <View style={styles.circle} />
                        <Text style={styles.currentLocation}>Current Location</Text>
                    </View>
                    <Text style={styles.currentLoc}>{currentAddress} {"\n"}</Text>

                    {/* Display the selected Destination */}
                    <View style={styles.locationRow}>
                        <View style={styles.circle} />
                        <Text style={styles.destinationLocation}>Destination</Text>
                    </View>
                    <Text style={styles.destinationLoc}>{destination}</Text>
                </View>
            </View>
            <View style={styles.riderCard}>
                <View style={styles.riderInfo}>
                    <Image
                        source={require('../../Images/profile.jpg')}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.riderName}>Ivan Dadacay</Text>
                        <Text>Rating: 5.0</Text>
                        <Text>⭐⭐⭐⭐⭐</Text>
                        <Text>Motorcycle: Bajaj</Text>
                        <Text>₱ 86.00</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmText}>CONFIRM</Text>
                </TouchableOpacity>
            </View>
            <Button title="Get Location" onPress={userLocation} />
        </View>
    );
};

export default Booking;

const styles = StyleSheet.create({
    riderCard: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    riderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    riderName: {
        fontWeight: 'bold',
    },
    confirmButton: {
        marginTop: 20,
        backgroundColor: '#956AF1',
        borderRadius: 20,
        alignItems: 'center',
        height: 40,
        justifyContent: 'center'
    },
    confirmText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    locationContainer:{
        marginHorizontal: 20,
    },
    locationRow: {
        flexDirection: 'row',  
        alignItems: 'center',     
    },
    circle: {
        width: 10,             
        height: 10,
        borderRadius: 5,      
        backgroundColor: '#956AF1',
        marginRight: 10,       
    },
    currentLocation: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    currentLoc: {
        fontSize: 12,
        color: 'gray',
        marginLeft: 20,       
    },
    destinationLocation: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    destinationLoc: {
        fontSize: 12,
        color: 'gray',
        marginLeft: 20,        
    },
    locationInfo: {
        position: 'absolute',
        top: 120,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: 320,
        height: 105,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderRadius: 20,
    },
    insideSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 10,
    },
    searchContainer: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        height: 50,
        width: 280,
        borderRadius: 10,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        width: "100%",
        height: "100%",
    },
    input: {
        flex: 1, 
        height: 40,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    icon: {
        padding: 5,
    },
    destinationItem: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
});
