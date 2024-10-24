import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the back icon

const MissionsScreen = ({ navigation }) => {
  // Individual states for two missions
  const [mission1Completed, setMission1Completed] = useState(false);
  const [mission2Completed, setMission2Completed] = useState(false);

  // Functions to mark missions as completed
  const completeMission1 = () => {
    setMission1Completed(true);
    Alert.alert('Mission Completed', 'You earned 100 points!');
  };

  const completeMission2 = () => {
    setMission2Completed(true);
    Alert.alert('Mission Completed', 'You earned 50 points!');
  };

  // Back button functionality
  const goBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Heading with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading}>Available Missions</Text>
      </View>

      {/* Mission 1 */}
      <View style={styles.mission}>
        <Text style={styles.missionTitle}>Complete 3 Rides</Text>
        <Text style={styles.missionDescription}>
          Finish 3 rides to earn 100 points.
        </Text>
        {mission1Completed ? (
          <Text style={styles.completedText}>Completed</Text>
        ) : (
          <TouchableOpacity style={styles.completeButton} onPress={completeMission1}>
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mission 2 */}
      <View style={styles.mission}>
        <Text style={styles.missionTitle}>Refer a Friend</Text>
        <Text style={styles.missionDescription}>
          Refer a friend and earn 50 points.
        </Text>
        {mission2Completed ? (
          <Text style={styles.completedText}>Completed</Text>
        ) : (
          <TouchableOpacity style={styles.completeButton} onPress={completeMission2}>
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Enhanced styles for Missions screen
const styles = StyleSheet.create({
  container: {
    top: 25,
    flex: 1,
    padding: 20,
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
  mission: {
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
  missionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E90FF',
    marginBottom: 5,
  },
  missionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  completeButton: {
    backgroundColor: '#1E90FF', 
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  completedText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MissionsScreen;
