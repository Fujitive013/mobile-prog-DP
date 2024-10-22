import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

export default function ConfirmedBooking() {
  const navigation = useNavigation(); // Initialize navigation
  const [paymentMethod, setPaymentMethod] = useState('Gcash');
  const route = useRoute();
  const fare = route.params?.fare || 0;

  const handleConfirm = () => {
    // Navigate to Booked.js and pass the fare
    navigation.navigate('Booked', { fare, paymentMethod });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={25} color="black" />
        <Text style={styles.headerTitle}>Confirm Ride</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={require('../../../Images/profile.jpg')}
          style={styles.profileImage}
        />
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4].map((star) => (
            <Ionicons key={star} name="star" size={16} color="#FFD700" />
          ))}
          <Ionicons name="star-outline" size={16} color="#FFD700" />
        </View>
        <Text style={styles.name}>Ivan Emmanuel A. Dadacay</Text>
        <Text style={styles.role}>Bajaj</Text>
        <Text style={styles.fare}>Fare: ₱{fare}</Text>
      </View>

      <View style={styles.paymentContainer}>
        <Text style={styles.paymentTitle}>Select Payment Method</Text>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'Gcash' && styles.selectedPayment]}
          onPress={() => setPaymentMethod('Gcash')}
        >
          <Ionicons name="cash-outline" size={24} color="#4A90E2" />
          <Text style={styles.paymentText}>Gcash</Text>
          <View style={styles.radioButton}>
            {paymentMethod === 'Gcash' && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === 'UponArrival' && styles.selectedPayment]}
          onPress={() => setPaymentMethod('UponArrival')}
        >
          <Ionicons name="location-outline" size={24} color="#4A90E2" />
          <Text style={styles.paymentText}>Upon Arrival</Text>
          <View style={styles.radioButton}>
            {paymentMethod === 'UponArrival' && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  fare: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentContainer: {
    marginBottom: 30,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedPayment: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F8FF',
  },
  paymentText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
