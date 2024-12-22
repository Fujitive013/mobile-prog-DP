import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeRider = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [completedRidesCount, setCompletedRidesCount] = useState(0);
  const [rides, setRides] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.error('Error fetching userName:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://192.168.1.3:5000/driver/viewReviews');
        setReviews(response.data);
        if (response.data.length > 0) {
          const totalRating = response.data.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = parseFloat((totalRating / response.data.length).toFixed(2));
          setAverageRating(avgRating);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchRides = async () => {
      try {
        const response = await axios.get('http://192.168.1.3:5000/driver/completedRides');
        const rides = response.data;
        setRides(rides);
        setCompletedRidesCount(rides.length);
        if (rides.length > 0) {
          const totalEarnings = parseFloat(
            rides.reduce((sum, ride) => sum + ride.fare, 0).toFixed(2)
          );
          setTotalEarnings(totalEarnings);
        }
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };

    fetchRides();
    fetchReviews();
    fetchUserName();
    fetchPendingBookings();

    const pollInterval = setInterval(fetchPendingBookings, 3000);
    return () => clearInterval(pollInterval);
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const response = await axios.get('http://192.168.1.3:5000/bookings?status=pending');
      const formattedRequests = response.data.map((booking) => ({
        id: booking._id,
        userId: booking.user_id,
        passengerName: booking.passenger_name,
        pickupLocation: booking.currentAddress,
        destination: booking.destination,
        fare: booking.fare,
        timeRequested: 'Just now',
        status: booking.status,
        payment_status: booking.payment_status,
        payment_method: booking.payment_method,
        latitude: booking.latitude,
        longitude: booking.longitude,
      }));

      setPendingRequests(prev => {
        const prevIds = new Set(prev.map(r => r.id));
        const newIds = new Set(formattedRequests.map(r => r.id));
        if (prevIds.size !== newIds.size || !Array.from(prevIds).every(id => newIds.has(id))) {
          return formattedRequests;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
    }
  };

  const acceptRide = (request) => {
    try {
      navigation.navigate('DashboardDriver', {
        screen: 'Book',
        params: {
          rideDetails: {
            driver_name: userName,
            user_id: request.userId,
            bookingId: request.id,
            pickupLocation: request.pickupLocation,
            destination: request.destination,
            passengerName: request.passengerName,
            fare: request.fare,
            latitude: request.latitude,
            longitude: request.longitude,
          },
        },
      });
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.subGreeting}>Ready to hit the road?</Text>
        </View>
      </View>

      <View style={styles.statusToggle}>
        <TouchableOpacity
          style={[styles.statusButton, isOnline ? styles.activeStatus : null]}
          onPress={() => setIsOnline(true)}
        >
          <Text style={[styles.statusText, isOnline ? styles.activeStatusText : null]}>
            Online
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, !isOnline ? styles.activeStatus : null]}
          onPress={() => setIsOnline(false)}
        >
          <Text style={[styles.statusText, !isOnline ? styles.activeStatusText : null]}>
            Offline
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Trips</Text>
          <Text style={styles.statValue}>{completedRidesCount}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Rating</Text>
          <Text style={styles.statValue}>{averageRating}</Text>
        </View>
      </View>

      <View style={styles.ratingCard}>
      <Text style={styles.statLabel}>Earnings</Text>
      <Text style={styles.statValue}>₱ {totalEarnings.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Ride Requests</Text>
        {pendingRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestInfo}>
              <Icon name="car-outline" size={24} color="#666" />
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>
                  Pickup: {request.pickupLocation}
                </Text>
                <Text style={styles.locationText}>
                  Dropoff: {request.destination}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptRide(request)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statusToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 21,
  },
  activeStatus: {
    backgroundColor: '#fff',
  },
  statusText: {
    color: '#666',
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#1a1a1a',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  ratingCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  locationContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    width: '25%',
    alignSelf: 'flex-end',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeRider;