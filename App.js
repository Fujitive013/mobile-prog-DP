import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import LoginModal from "./Pages/Modals/LoginModal";
import SignupModal from "./Pages/Modals/SignupModal";
import Dashboard from "./Pages/Dashboard";
import LandingPage from "./Pages/LandingPage";
import RegistrationModal from "./Pages/Modals/RegistrationModal";
import ConfirmedBooking from "./Pages/Screens/Settings Sub Pages/ConfirmedBooking";
import Booked from './Pages/Screens/Settings Sub Pages/Booked';
import HomeScreens from "./Pages/Screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="LandingPage" component={LandingPage} />
                <Stack.Screen name="Login" component={LoginModal} />
                <Stack.Screen name="SignUp" component={SignupModal} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="RegistrationModal" component={RegistrationModal}/>
                <Stack.Screen name="ConfirmedBooking" component={ConfirmedBooking} />
                <Stack.Screen name="Booked" component={Booked} />
                <Stack.Screen name="HomeScreens" component={HomeScreens} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
