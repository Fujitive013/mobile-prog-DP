import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NotificationSettingsScreen() {
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [isNewPromosOn, setIsNewPromosOn] = useState(true);
  const [isRemindersOn, setIsRemindersOn] = useState(true);

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
          <Ionicons name="notifications-outline" size={25} color="black" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Notification</Text>
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>On</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isNotificationOn ? "#fff" : "#fff"}
            onValueChange={setIsNotificationOn}
            value={isNotificationOn}
          />
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>New Promos</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isNotificationOn ? "#fff" : "#fff"}
            onValueChange={setIsNewPromosOn}
            value={isNewPromosOn}
          />
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Reminders</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isNotificationOn ? "#fff" : "#fff"}
            onValueChange={setIsRemindersOn}
            value={isRemindersOn}
          />
        </View>
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
    marginBottom: 10
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
    marginBottom: 20,
    marginBottom: 40
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
  },
});