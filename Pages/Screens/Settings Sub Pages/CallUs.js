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
        <Text style={styles.helpTitle}>Need help? Get in Touch</Text>
      </View>

        <TouchableOpacity style={styles.contactItem}>
          <View>
            <Text style={styles.phoneNumber}>+ 123 456 789</Text>
            <Text style={styles.userType}>For Globe/TM Users</Text>
          </View>
          <Image
            source={require('../../../Images/tm.png')}
            style={styles.logo}
          />
        </TouchableOpacity>


        <TouchableOpacity style={styles.contactItem}>
          <View>
            <Text style={styles.phoneNumber}>+ 987 654 321</Text>
            <Text style={styles.userType}>For Smart/TNT Users</Text>
          </View>
          <Image
            source={require('../../../Images/tnt.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginVertical: 20,
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
    fontSize: 16,
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