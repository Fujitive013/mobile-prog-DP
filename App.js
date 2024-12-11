import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import LoginModal from "./Pages/Modals/LoginModal";
import SignupModal from "./Pages/Modals/SignupModal";
import Dashboard from "./Pages/Dashboard";
import LandingPage from "./Pages/LandingPage";
import RegistrationModal from "./Pages/Modals/RegistrationModal";
import ConfirmedBooking from "./Pages/Screens/Settings Sub Pages/ConfirmedBooking";
import Booked from "./Pages/Screens/Settings Sub Pages/Booked";
import HelpSupport from "./Pages/Screens/Settings Sub Pages/HelpSupport";
import Settings from "./Pages/Screens/Settings";
import Notification from "./Pages/Screens/Settings Sub Pages/Notifications";
import ChatSupport from "./Pages/Screens/Settings Sub Pages/ChatSupport";
import CallUs from "./Pages/Screens/Settings Sub Pages/CallUs";
import Email from "./Pages/Screens/Settings Sub Pages/Email";
import Privacy from "./Pages/Screens/Settings Sub Pages/Privacy";
import GcashPayment from "./Pages/Screens/Settings Sub Pages/Gcash/GcashPayment";
import VoucherScreen from "./Pages/Screens/Voucher and Missions/VoucherScreen";
import MissionsScreen from "./Pages/Screens/Voucher and Missions/MissionsScreen";
import RatingsMade from "./Pages/Screens/Settings Sub Pages/RatingsMade";
import RatingsReceived from "./Pages/Screens/Settings Sub Pages/RatingsRecieved";

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
                <Stack.Screen
                    name="RegistrationModal"
                    component={RegistrationModal}
                />
                <Stack.Screen
                    name="ConfirmedBooking"
                    component={ConfirmedBooking}
                />
                <Stack.Screen name="Booked" component={Booked} />
                <Stack.Screen name="HelpSupport" component={HelpSupport} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="Notification" component={Notification} />
                <Stack.Screen name="ChatSupport" component={ChatSupport} />
                <Stack.Screen name="CallUs" component={CallUs} />
                <Stack.Screen name="Email" component={Email} />
                <Stack.Screen name="Privacy" component={Privacy} />
                <Stack.Screen name="GcashPayment" component={GcashPayment} />
                <Stack.Screen name="VoucherScreen" component={VoucherScreen} />
                <Stack.Screen
                    name="MissionsScreen"
                    component={MissionsScreen}
                />
                <Stack.Screen name="RatingsMade" component={RatingsMade} />
                <Stack.Screen
                    name="RatingsReceived"
                    component={RatingsReceived}
                />
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
