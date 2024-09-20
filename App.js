import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import LoginModal from "./Pages/Modals/LoginModal";
import SignupModal from "./Pages/Modals/SignupModal";
import Book from "./Pages/Screens/Book";
import Dashboard from "./Pages/Dashboard";
import Registration from "./Pages/Registration";
import LandingPage from "./Pages/LandingPage";

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
                <Stack.Screen name="Book" component={Book} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Registration" component={Registration} />
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
