import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import Booking from "./Screens/Booking";
import Profile from "./Screens/Profile";
import HomeScreen from "./Screens/HomeScreen";
import Settings from "./Screens/Settings";
import RatingsMade from "./Screens/Settings Sub Pages/RatingsMade";
import TrackRider from "./Screens/Settings Sub Pages/TrackRider";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
const Tab = createBottomTabNavigator();
const home = "Home";
const book = "Book";
const profile = "Profile";
const settings = "Settings";
const ratings = "Ratings";
const track = "Track";

const Dashboard = () => {
  const route = useRoute();
  const { userName, userId } = route.params;
  console.log(userId);
  const navigation = useNavigation();
  const [activeRide, setActiveRide] = useState(null);
  const [completedRide, setCompletedRide] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasClickedYes, setHasClickedYes] = useState(false);

  const checkActiveRide = async () => {
    try {
      const response = await fetch("http://192.168.1.3:5000/view/activeRides", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.length > 0 && data[0].status === "active") {
        setActiveRide(data[0]); // Set active ride
        setModalVisible(true);
      } else {
        setActiveRide(null); // Clear active ride if not active
      }
    } catch (error) {
      console.error("Error fetching active rides:", error);
      setActiveRide(null);
    }
  };

  const handleModalClose = (shouldTrack) => {
    setModalVisible(false);
    if (shouldTrack) {
      setHasClickedYes(true);
      navigation.navigate("Track");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkActiveRide();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName={home}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === home) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === book) {
              iconName = focused ? "book" : "book-outline";
            } else if (rn === profile) {
              iconName = focused ? "person" : "person-outline";
            } else if (rn === settings) {
              iconName = focused ? "settings" : "settings-outline";
            } else if (rn === ratings) {
              iconName = focused ? "star" : "star-outline";
            } else if (rn === track) {
              iconName = focused ? "map" : "map-outline";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#3498DB",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { paddingBottom: 10, height: 60 },
        })}
      >
        <Tab.Screen
          name={home}
          options={{ headerShown: false }}
          component={HomeScreen}  //pass the userName to the component {HomeScreen}
          initialParams={{ userName, userId }}
        />
        {activeRide && activeRide.status === "active" ? (
          <Tab.Screen
            name={track}
            options={{
              headerShown: false,
              tabBarLabel: 'Track',
              tabBarIcon: ({ focused, color, size }) => (
                <Icon name={focused ? "map" : "map-outline"} size={size} color={color} />
              ),
            }}
            component={TrackRider}
            initialParams={{ userName, userId }}
          />
        ) : (
          <Tab.Screen
            name={book}
            options={{
              headerShown: false,
              tabBarLabel: 'Book',
              tabBarIcon: ({ focused, color, size }) => (
                <Icon name={focused ? "book" : "book-outline"} size={size} color={color} />
              ),
            }}
            component={Booking}
            initialParams={{ userName, userId }}
          />
        )}
        <Tab.Screen
          name={ratings}
          options={{ headerShown: false }}
          component={RatingsMade}
          initialParams={{ userName, userId }}
        />
        <Tab.Screen
          name={profile}
          options={{ headerShown: false }}
          component={Profile}
          initialParams={{ userName, userId }}
        />
        <Tab.Screen
          name={settings}
          options={{ headerShown: false }}
          component={Settings}
          initialParams={{ userName, userId }}
        />
      </Tab.Navigator>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && !hasClickedYes}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Track Rider</Text>
            <Text style={styles.modalMessage}>
              Do you want to track the rider?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleModalClose(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleModalClose(true);
                  setModalVisible(false); // Close modal immediately on "Yes"
                }}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    backgroundColor: "#3498DB",
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});