import { StyleSheet, Text, View, Switch, Image } from "react-native";
import React, { useState } from 'react';
import { Card } from "react-native-paper";

const Profile = () => {

    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => {
        alert("Under development");
        setIsEnabled(false); // always set isEnabled to false
    };

    return (
        <View style={styles.mainContainer}>
            <Card style={styles.subContainer}>
                <Card style={styles.profileContainer}/>
                <View style={styles.namePhoneContainer}>
                    <Text style={styles.nameLabel}>
                        Ivan Emmanuel A. Dadacay
                    </Text>
                    <Text style={styles.phoneLabel}>
                        +63 935-1611-635
                    </Text>
                </View>
                <Card style={styles.accountContainer}>
                    <Text style={styles.accountLabel}>
                        Account
                    </Text>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', justifyContent: 'space-between'  }}>
                        <Text style={styles.labelStyle}>
                            Gender
                        </Text>
                        <Text style={styles.infoLabel}>
                            Male
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', justifyContent: 'space-between' }}>
                        <Text style={styles.labelStyle}>
                            Birthday
                        </Text>
                        <Text style={styles.infoLabel}>
                            April 15, 2004
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.labelStyle}>
                            Location
                        </Text>
                        <Text style={styles.infoLabel}>
                            Cagayan
                        </Text>
                    </View>
                </Card>
            </Card>
            <Card style={{ width: "90%", height: "10%", backgroundColor: "#FFFFFF", borderRadius: 20, marginVertical: "100%", alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                    source={{ uri: 'https://img.icons8.com/?size=100&id=118497&format=png&color=000000' }}
                    style={{ width: 65, height: 65 }}
                    />
                    <Text style={{fontSize: 17, marginBottom: 20}}>Facebook</Text>
                    <Text style={{fontSize: 17, marginTop: 20, marginLeft: -78, opacity: 0.5}}> CONNECTED </Text>
                    <Switch styles={styles.facebookSwitch}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{ marginLeft: 80, transform: [{ scale: 1.5 }] }}
                    />
                </View>
            </Card>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    infoLabel:{
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        width: 100,
        color: "#2B2929"
    },
    labelStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        marginHorizontal: 10,
        width: 100,
        color: "#2B2929"
    },
    accountLabel: {
        fontSize: 23,
        fontWeight: 'bold',
        marginHorizontal: 10,
        marginVertical: 15,
        color: "#2B2929"
    },
    accountContainer:{
        backgroundColor: "#F5F5F5",
        borderRadius: 30,
        borderWidth: 1,
        width: "90%",
        alignSelf: 'center',
        height: "105%",
        opacity: 0.8,
        marginVertical: 130,
        color: "#2B2929"
    },
    phoneLabel: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: "#2B2929"
    },
    nameLabel: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: "#2B2929"
    },
    namePhoneContainer: {
        marginVertical: -110,
    },
    profileContainer: {
        backgroundColor: "#F5F5F5",
        width: "43%",
        height: "80%",
        borderRadius: 100,
        borderWidth: 1,
        alignSelf: 'center',
        marginVertical: "30%"
    },
    subContainer: {
        backgroundColor: "#FFFFFF",
        height: "30%",
        borderRadius: 30,
        borderWidth: 1,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFDC2E"
    },
});
