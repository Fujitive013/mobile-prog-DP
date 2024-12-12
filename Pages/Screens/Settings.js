import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
<<<<<<< Updated upstream
  const navigation = useNavigation();
=======
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.1.3:5000/user/details",
                    {
                        withCredentials: true,
                    }
                );
                console.log("Fetched User Data:", response.data); // Log fetched data
                setUser(response.data.user); // Access the user property
            } catch (error) {
                console.log("Failed to fetch user data:", error);
                navigation.navigate("LandingPage"); // Navigate if unauthorized
            }
        };
        fetchUserData();
    }, []);
>>>>>>> Stashed changes

  const profile = () => {
    navigation.navigate('Profile')
  }

  const notification = () => {
    navigation.navigate('Notification')
  }

  const privacy = () => {
    navigation.navigate('Privacy')
  }

  const helpSupport = () => {
    navigation.navigate('HelpSupport')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={profile}>
          <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>Profile Information</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={notification}>
          <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>Notification</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={privacy}>
          <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={helpSupport}>
          <Ionicons name="headset-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>Help Support</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 32,
    marginVertical: 100,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 20,
    marginBottom: 12
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    marginBottom: 15,
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
});