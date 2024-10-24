import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the back icon

const VoucherScreen = ({ navigation }) => {
  // Individual states for two vouchers
  const [voucher1Redeemed, setVoucher1Redeemed] = useState(false);
  const [voucher2Redeemed, setVoucher2Redeemed] = useState(false);

  // Functions to redeem vouchers
  const redeemVoucher1 = () => {
    setVoucher1Redeemed(true);
    Alert.alert('Success', 'You have redeemed Free Ride!');
  };

  const redeemVoucher2 = () => {
    setVoucher2Redeemed(true);
    Alert.alert('Success', 'You have redeemed 10% Off Next Ride!');
  };

  // Back button functionality
  const goBack = () => {
    if (navigation) {
      navigation.goBack(); // Navigates back if you are using a navigator
    }
  };

  return (
    <View style={styles.container}>
      {/* Heading with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading}>Available Vouchers</Text>
      </View>

      {/* Voucher 1 */}
      <View style={styles.voucher}>
        <Text style={styles.voucherTitle}>Free Ride</Text>
        <Text style={styles.voucherDescription}>
          Redeem for a free ride on Motodachi.
        </Text>
        {voucher1Redeemed ? (
          <Text style={styles.redeemedText}>Redeemed</Text>
        ) : (
          <TouchableOpacity style={styles.redeemButton} onPress={redeemVoucher1}>
            <Text style={styles.redeemButtonText}>Redeem</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Voucher 2 */}
      <View style={styles.voucher}>
        <Text style={styles.voucherTitle}>10% Off Next Ride</Text>
        <Text style={styles.voucherDescription}>
          Get 10% off your next ride with Motodachi.
        </Text>
        {voucher2Redeemed ? (
          <Text style={styles.redeemedText}>Redeemed</Text>
        ) : (
          <TouchableOpacity style={styles.redeemButton} onPress={redeemVoucher2}>
            <Text style={styles.redeemButtonText}>Redeem</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Enhanced styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    top: 25,
    backgroundColor: '#f4f4f4',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  voucher: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  voucherTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E90FF',
    marginBottom: 5,
  },
  voucherDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  redeemButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  redeemButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  redeemedText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VoucherScreen;
