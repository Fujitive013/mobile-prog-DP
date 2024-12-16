import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from '@react-navigation/native'; // Import the hook
import { useRoute } from "@react-navigation/native";

const HomeScreens = () => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params;

    const handleMissions = () => {
        navigation.navigate('MissionsScreen')
    }

    const handleVoucher = () => {
        navigation.navigate('VoucherScreen')
    }

    const handleConfirm = () => {
        navigation.navigate('Dashboard', { screen: 'Book', params: { userId: userId } }); // Navigate to Booking.js
    };

    const fetchFonts = async () => {
        await Font.loadAsync({
            "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf"),
            "Jakarta-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"), // Ensure this path is correct
        });
    };

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
                await fetchFonts();
                setFontLoaded(true);
            } catch (error) {
                console.error("Error loading fonts:", error);
            } finally {
                await SplashScreen.hideAsync();
            }
        };

        loadFonts();
    }, []);

    if (!fontLoaded) {
        return null; // Return null while loading
    }

    return (
        <View style={styles.container}>
            <View>
                <Image
                    source={require("../../Images/Banner.jpg")}
                    style={{ width: "100%", height: 210 }}
                />
            </View>
            <View style={styles.descriptionContainer}>
                <View style={styles.centeredTextContainer}>
                    <Text style={styles.descriptionText}>
                        Exceptional prices and
                    </Text>
                    <Text style={styles.descriptionText}>
                        top-notch safety-
                    </Text>
                    <Text style={styles.descriptionText}>
                        only with Motodachi
                    </Text>
                </View>
            </View>
            <View style={{ alignSelf: "center" }}>
                <TouchableOpacity style={styles.buttonContainer} onPress={handleConfirm}>
                    <Text style={styles.bookText}>BOOK NOW</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.voucherMissionContainer}>
                <View style={styles.voucherContainer}>
                    <TouchableOpacity style={styles.vouchersubContainer} onPress={handleVoucher}>
                        <View>
                            <Text style={styles.voucherText} onPress={handleConfirm}>Vouchers</Text>
                            <Text style={styles.voucherDescription}>
                                Claim before they're gone
                            </Text>
                        </View>
                        <Image
                            source={require("../../Images/gift-voucher.png")}
                            style={styles.voucherImage}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.voucherContainer}>
                    <TouchableOpacity style={styles.vouchersubContainer} onPress={handleMissions}>
                        <View>
                            <Text style={styles.voucherText}>Missions</Text>
                            <Text style={styles.voucherDescription}>
                                Earn rewards for this tasks
                            </Text>
                        </View>
                        <Image
                            source={require("../../Images/mountain.png")}
                            style={styles.voucherImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default HomeScreens;

const styles = StyleSheet.create({
    voucherImage: {
        marginLeft: 10,
        width: 100,
        height: 60,
        borderRadius: 12,
    },
    voucherDescription: {
        fontSize: 14,
        fontFamily: "PlusJakartaSans-Regular",
        color: "#407A9E",
    },
    voucherText: {
        fontSize: 16,
        fontFamily: "Jakarta-Bold",
    },
    container: {
        backgroundColor: "#FFFFFF",
        height: "100%",
    },
    vouchersubContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
    voucherContainer: {
        height: 90,
        width: 300,
        borderRadius: 12,
        backgroundColor: "#F2F5FA",
        elevation: 0.2,
        justifyContent: "center",
        marginBottom: 15,
    },
    voucherMissionContainer: {
        marginVertical: 10,
        alignItems: "center",
    },
    bookText: {
        alignSelf: "center",
        color: "#FFFFFF",
    },
    buttonContainer: {
        backgroundColor: "#3399DB",
        justifyContent: "center",
        height: 50,
        borderRadius: 30,
        width: 280,
        marginBottom: 15,
    },
    centeredTextContainer: {
        alignSelf: "center",
    },
    descriptionContainer: {
        marginVertical: 10,
    },
    descriptionText: {
        textAlign: "justify",
        fontSize: 29,
        fontFamily: "Jakarta-Bold",
    },
    titleText: {
        position: "absolute",
        top: 170,
        left: 10,
        fontSize: 26,
        color: "#747474",
        fontFamily: "Jakarta-Bold",
    },
});
