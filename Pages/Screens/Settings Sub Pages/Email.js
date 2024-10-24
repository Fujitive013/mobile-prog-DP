import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HelpContactScreen() {
  const navigation = useNavigation();

  const back = () => {
    navigation.navigate('HelpSupport')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}  onPress={back}>

          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.helpSection}>
        <Ionicons name="headset-outline" size={24} color="black" style={styles.helpIcon} />
        <Text style={styles.helpTitle}>We’re here to help. Send us email or call us
        through the following options.</Text>
      </View>

        <TouchableOpacity style={styles.contactItem}>
        <View style={styles.subContainer}>
            <Ionicons name="mail-outline" size={40} color="black" style={styles.mailContainer} />
            <Text style={styles.contactText}>
                Email <Text style={styles.boldText}>motodachisupport@gmail.com</Text>
            </Text>
        </View>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boldText:{
    fontWeight: 'bold'
  },
  contactText:{
    fontSize: 16,
    alignSelf: 'center'
  },
  subContainer:{
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginVertical: 20,
  },
  mailContainer:{
    height: 35,
    width: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  helpIcon: {
    marginRight: 8,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactInfo: {
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: '#666',
  },
  logo: {
    width: 100,
    height: 70,
    borderRadius: 10,
  },
});