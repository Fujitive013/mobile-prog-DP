import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import MapView from "react-native-maps";

const Book = () => {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Image
                    source={require("../../Images/text_logo_black.png")}
                    style={styles.mainImage}
                />
                <View style={styles.containerTitle}>
                    <Text style={styles.titleLabel}>CunningCarat</Text>
                    <View style={styles.containerTitle}>
                        <Text style={styles.descriptionLabel}>
                            Exceptional prices and
                        </Text>
                        <Text style={styles.descriptionLabel}>
                            top-notch safety-only with
                        </Text>
                        <Text style={styles.descriptionLabel}>
                            CunningCarat
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.subContainer}>
                <Card style={styles.cardContainer}>
                    <Text style={styles.mapLabel}>Select your map</Text>
                    <View style={styles.mapContainer}>
                        <MapView style={styles.map} />
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={require("../../Images/PickUp.png")}
                                style={{
                                    width: 24,
                                    height: 24,
                                    marginRight: 10,
                                    marginLeft: 10,
                                    marginVertical: 10,
                                }}
                            />
                            <Text style={{ fontSize: 17 }}>
                                Cagayan de Oro City
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={require("../../Images/DropOut.png")}
                                style={{
                                    width: 24,
                                    height: 24,
                                    marginRight: 10,
                                    marginLeft: 10,
                                }}
                            />
                            <Text style={{ fontSize: 17 }}>Iligan</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={require("../../Images/Fare.png")}
                                style={{
                                    width: 24,
                                    height: 24,
                                    marginRight: 10,
                                    marginLeft: 10,
                                    marginVertical: 10,
                                }}
                            />
                            <Text style={{ fontSize: 17 }}>₱ 11250</Text>
                        </View>
                    </View>
                </Card>
            </View>
        </View>
    );
};

export default Book;

const styles = StyleSheet.create({
    map: {
        marginHorizontal: 8,
        width: "95%",
        height: "60%",
    },
    mapLabel: {
        fontSize: 17,
        marginVertical: 10,
        marginHorizontal: 10,
        fontWeight: "800",
    },
    cardContainer: {
        marginVertical: -40,
        width: 330,
        height: 350,
        backgroundColor: "#87CEEB",
    },
    descriptionLabel: {
        textAlign: "center",
    },
    container: {
        flexDirection: "column", // Stack elements vertically
        justifyContent: "flex-start", // Move elements to the top
        alignItems: "center", // Center elements horizontally
        backgroundColor: "#F2F0EF",
        height: "100%",
    },
    topRow: {
        // Add styles for the new wrapper View
        flexDirection: "row", // Align elements in a row
        alignItems: "center", // Center elements vertically
    },
    containerTitle: {
        marginLeft: 10, // Add some margin to the left of the text
    },
    titleLabel: {
        fontSize: 30,
    },
    mainImage: {
        width: 140,
        height: 170,
        marginVertical: 50,
    },
});
