import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Card, Button } from "react-native-paper";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require("../../Images/Hamburger.png")}
                style={{ resizeMode: "center", marginVertical: 30 }}
            />
            <View>
                <Card style={styles.mainContainer}>
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={require("../../Images/Rider.png")}
                            style={styles.imageRider}
                        />
                        <View style={{ flexDirection: "column" }}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>
                                    <Text style={{ color: "#FFFFFF" }}>
                                        Moto
                                    </Text>
                                    <Text style={{ color: "#3498DB" }}>
                                        dachi
                                    </Text>
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
            </View>
            <View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginVertical: -25,
                    }}
                >
                    <Card
                        style={[
                            styles.voucherContainer,
                            { marginHorizontal: 10 },
                        ]}
                    >
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
                    <Card
                        style={[
                            styles.missionContainer,
                            { marginHorizontal: 10 },
                        ]}
                    >
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
            </View>
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                <TouchableOpacity>
                    <Card style={styles.containerOne} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Card style={styles.containerTwo} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Card style={styles.containerThree} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Card style={styles.containerFour} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    containerOne: {
        height: 120,
        width: 150,
        margin: 5,
        backgroundColor: "#87CEEB",
    },
    containerTwo: {
        height: 120,
        width: 150,
        margin: 5,
        backgroundColor: "#87CEEB",
    },
    containerThree: {
        height: 120,
        width: 150,
        margin: 5,
        backgroundColor: "#87CEEB",
    },
    containerFour: {
        height: 120,
        width: 150,
        margin: 5,
        backgroundColor: "#87CEEB",
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
        borderRadius: 20,
        marginVertical: 40,
        backgroundColor: "#D9D9D9",
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
        borderRadius: 20,
        marginVertical: 40,
        backgroundColor: "#D9D9D9",
    },
    imageRider: {
        height: 190,
        width: 170,
    },
    buttonText: {
        color: "#000000",
        fontSize: 17,
    },
    buttonContainer: {
        backgroundColor: "#87CEEB",
        marginVertical: 20,
        borderRadius: 20,
        borderWidth: 1,
    },
    descriptionText: {
        fontSize: 11,
        textAlign: "center",
        marginVertical: -10,
    },
    titleText: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    titleContainer: {
        backgroundColor: "#000000",
        height: 35,
        width: 125,
        marginVertical: 20,
        borderRadius: 10,
        justifyContent: "center",
    },
    mainContainer: {
        alignSelf: "center",
        width: 340,
        height: 200,
        backgroundColor: "#D9D9D9",
    },
});
