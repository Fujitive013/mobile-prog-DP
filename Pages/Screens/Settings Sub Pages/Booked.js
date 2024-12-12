import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useState } from 'react';

export default function BookedRideScreen() {
    const route = useRoute();
    const { fare, paymentMethod, destination, currentAddress } = route.params;
    const navigation = useNavigation(); // Initialize navigation

    // State to manage the modal visibility
    const [modalVisible, setModalVisible] = useState(false);

    const handleConfirm = () => {
        setModalVisible(true); // Show the modal
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Close the modal and navigate
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Dashboard', params: { screen: 'Home' } }],
            })
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={25} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booked</Text>
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
                <View style={styles.paymentOption}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#4285F4" />
                    <Text style={styles.paymentText}>{paymentMethod}</Text>
                </View>
            </View>

            <View>
                <Text style={{fontSize: 13, fontWeight: '700', alignSelf: 'center', textAlign: 'center'}}>Please wait for the rider to arrive in your location. {"\n\n"} 
                    You'll be notify if the rider is in your location.
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleConfirm}>
                    <Text style={styles.cancelButtonText}>Done</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal} // Handle back button
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Thank you for using our app. Have a great day!</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 25,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
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
    },
    paymentText: {
        fontSize: 16,
        marginLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
        top: 100,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '80%', // Adjust width as needed
        maxWidth: 400, // Set a maximum width
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000', // For shadow on iOS
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#4A90E2',
        padding: 10,
        borderRadius: 5,
        width: '100%', // Make button fill the modal
        alignItems: 'center', // Center text in the button
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
