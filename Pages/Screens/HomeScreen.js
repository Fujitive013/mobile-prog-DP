import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";
import React from "react";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require("../../Images/Hamburger.png")}
                style={{ resizeMode: "center", marginVertical: 30 }}
            />
            <Card style={styles.mainContainer}>
                <View style={{ flexDirection: "row" }}>
                    <Image
                        source={require("../../Images/Rider.png")}
                        style={styles.imageRider}
                    />
                    <View style={{ flexDirection: "column" }}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>
                                <Text style={{ color: "#FFFFFF" }}>Moto</Text>
                                <Text style={{ color: "#FFDC2E" }}>dachi</Text>
                            </Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionText}>
                                Exceptional prices and{" "}
                            </Text>
                            <Text
                                style={[
                                    styles.descriptionText,
                                    { marginTop: 8 },
                                ]}
                            >
                                top-notch safety-only with{" "}
                            </Text>
                            <Text
                                style={[
                                    styles.descriptionText,
                                    { marginTop: 8 },
                                ]}
                            >
                                Motodachi
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity>
                                <Button>
                                    <Text style={styles.buttonText}>
                                        BOOK NOW
                                    </Text>
                                </Button>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
            <View style={{ flexDirection: "row" }}>
                <Card style={styles.voucherContainer}>
                    <TouchableOpacity>
                        <Text style={styles.voucherText}>Vouchers</Text>
                        <Image
                            source={require("../../Images/Vouchers.png")}
                            style={styles.voucherImage}
                        />
                        <Text style={styles.descriptionVoucher}>
                            Claim before
                        </Text>
                        <Text
                            style={[
                                styles.descriptionVoucher,
                                { marginVertical: 2 },
                            ]}
                        >
                            they're gone
                        </Text>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.missionContainer}>
                    <TouchableOpacity>
                        <Text style={styles.missionText}>Missions</Text>
                        <Image
                            source={require("../../Images/Missions.png")}
                            style={styles.missionImage}
                        />
                        <Text style={styles.descriptionMission}>
                            Earn rewards for
                        </Text>
                        <Text
                            style={[
                                styles.descriptionMission,
                                { marginVertical: 2 },
                            ]}
                        >
                            completing tasks
                        </Text>
                    </TouchableOpacity>
                </Card>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Card style={styles.containerOne} />
                <Card style={styles.containerTwo} />
                <Card style={styles.containerThree} />
                <Card style={styles.containerFour} />
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    containerOne: {
        height: 150,
        width: 150,
        marginVertical: -20,
        marginHorizontal: 25,
        backgroundColor: "#FFE761",
    },
    imageRider: {
        height: 190,
        width: 170,
    },
    containerTwo: {
        height: 150,
        width: 150,
        marginVertical: -20,
        marginHorizontal: -15,
        backgroundColor: "#FFE761",
    },
    containerThree: {
        height: 150,
        width: 150,
        marginVertical: 150,
        marginHorizontal: -295,
        backgroundColor: "#FFE761",
    },
    containerFour: {
        height: 150,
        width: 150,
        marginVertical: 150,
        marginHorizontal: 305,
        backgroundColor: "#FFE761",
    },
    descriptionVoucher: {
        fontSize: 11,
        marginHorizontal: 10,
        marginVertical: -5,
    },
    voucherImage: {
        height: 60,
        width: 55,
        marginVertical: -30,
        marginHorizontal: 85,
    },
    voucherText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
        marginHorizontal: 10,
        marginVertical: 2,
    },
    voucherContainer: {
        height: 50,
        width: 150,
        marginHorizontal: 25,
        borderRadius: 20,
        marginVertical: 40,
        backgroundColor: "#D9D9D9",
    },
    descriptionMission: {
        fontSize: 11,
        marginHorizontal: 10,
        marginVertical: -5,
    },
    missionImage: {
        height: 45,
        width: 45,
        marginVertical: -22.5,
        marginHorizontal: 95,
    },
    missionText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
        marginHorizontal: 10,
        marginVertical: 2,
    },
    missionContainer: {
        height: 50,
        width: 150,
        marginHorizontal: -20,
        borderRadius: 20,
        marginVertical: 40,
        backgroundColor: "#D9D9D9",
    },
    buttonText: {
        color: "#000000",
        fontSize: 17,
    },
    buttonContainer: {
        backgroundColor: "#FFDC2E",
        marginVertical: 20,
        borderRadius: 20,
        borderWidth: 1,
    },
    descriptionText: {
        fontSize: 11,
        textAlign: "center",
        marginVertical: -10,
    },
    titleContainer: {
        backgroundColor: "#000000",
        height: 35,
        width: 125,
        marginVertical: 20,
        borderRadius: 10,
        justifyContent: "center",
    },
    titleText: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    mainContainer: {
        backgroundColor: "#D9D9D9",
        width: "85%",
        height: "25%",
        marginHorizontal: 25,
        marginVertical: -25,
        flexDirection: "row",
    },
    container: {
        backgroundColor: "#F4F4F4",
    },
});
