import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
    const navigation = useNavigation();

    const Settings = () => {
        navigation.navigate('Dashboard', screen= 'settings');
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={Settings}>
          <Ionicons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Ionicons name="headset-outline" size={24} color="black" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Help Support</Text>
        </View>

        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="chatbubbles-outline" size={24} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>Chat Support</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="call-outline" size={24} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>Call us</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="mail-outline" size={24} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>Send us an Email</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="help-circle-outline" size={24} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>FAQs</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 80
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
});