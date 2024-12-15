import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import Booking from "./Screens/Booking";
import Profile from "./Screens/Profile";
import HomeScreen from "./Screens/HomeScreen";
import Settings from "./Screens/Settings";
import RatingsMade from "./Screens/Settings Sub Pages/RatingsMade";
import TrackRider from "./Screens/Settings Sub Pages/TrackRider";
const Tab = createBottomTabNavigator();
const home = "Home";
const book = "Book";
const profile = "Profile";
const settings = "Settings";
const ratings = "Ratings";
const track = "Track";

const Dashboard = () => {
    return (
        <Tab.Navigator
            initialRouteName={home}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === home) {
                        iconName = focused ? "home" : "home-outline";
                        // if icon is focused or is selected... solid color else outline lng
                    } else if (rn === book) {
                        iconName = focused ? "book" : "book-outline";
                        // same logic above
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
                tabBarStyle: { paddingBottom: 10, height: 60 }, // Customize tab bar style
            })}
        >
            <Tab.Screen
                name={home}
                options={{ headerShown: false }}
                component={HomeScreen}
            />
            <Tab.Screen
                name={book}
                options={{ headerShown: false }}
                component={Booking}
            />
            <Tab.Screen
                name={ratings}
                options={{ headerShown: false }}
                component={RatingsMade}
            />
            <Tab.Screen
                name={profile}
                options={{ headerShown: false }}
                component={Profile}
            />
            <Tab.Screen
                name={settings}
                options={{ headerShown: false }}
                component={Settings}
            />
            <Tab.Screen
                name={track}
                options={{ headerShown: false }}
                component={TrackRider}
            />
        </Tab.Navigator>
    );
};

export default Dashboard;

const styles = StyleSheet.create({});
