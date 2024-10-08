import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    Platform,
} from "react-native";
import { Card, TextInput, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icons
import DateTimePicker from "@react-native-community/datetimepicker"; // Import the DateTimePicker

const RegistrationModal = ({ visible, onClose }) => {
    const navigation = useNavigation();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleRegister = () => {
        if (
            firstName === "" ||
            lastName === "" ||
            !birthDate ||
            address === "" ||
            phoneNumber === ""
        ) {
            Alert.alert("Missing Information", "Please fill out all fields.");
            return;
        }

        Alert.alert("Success", "You have successfully signed up!");
        onClose();
        navigation.navigate("Dashboard");
    };

    const onChangeDate = (event, selectedDate) => {
        if (event.type === "set") {
            const currentDate = selectedDate || birthDate;
            setBirthDate(currentDate);
        }
        setShowDatePicker(false); // Close picker after date selection
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <Card style={styles.card}>
                    <View>
                        <Text style={styles.SignUpLabel}>Registration</Text>
                    </View>
                    <Text style={styles.allLabels}>First Name</Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name="person"
                            size={20}
                            color="#AFAFAF"
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="First Name"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputField}
                            mode="outlined"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>
                    <Text style={styles.allLabels}>Last Name</Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name="person"
                            size={20}
                            color="#AFAFAF"
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Last Name"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputField}
                            mode="outlined"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>
                    <Text style={styles.allLabels}>Birthdate</Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name="perm-contact-calendar"
                            size={20}
                            color="#AFAFAF"
                            style={styles.icon}
                        />
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={styles.dateContainer}
                        >
                            <Text style={styles.dateText}>
                                {birthDate
                                    ? birthDate.toLocaleDateString()
                                    : "Select Date"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <DateTimePicker
                            value={birthDate}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
                    <Text style={styles.allLabels}>Phone Number</Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name="phone"
                            size={20}
                            color="#AFAFAF"
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Phone Number"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputField}
                            mode="outlined"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>
                    <Text style={styles.allLabels}>Address</Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name="location-on"
                            size={20}
                            color="#AFAFAF"
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Address"
                            placeholderTextColor="#AFAFAF"
                            style={styles.inputField}
                            mode="outlined"
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                    <Button
                        mode="elevated"
                        style={styles.submitButton}
                        onPress={handleRegister}
                        textColor="#FFFFFF"
                    >
                        <Text style={styles.registerLabel}>Continue</Text>
                    </Button>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        </Modal>
    );
};

export default RegistrationModal;

const styles = StyleSheet.create({
    SignUpLabel: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    card: {
        width: "90%",
        padding: 20,
        borderRadius: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    inputField: {
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingVertical: 0,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    dateContainer: {
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingVertical: 20, // Add vertical padding
        paddingHorizontal: 10, // Add horizontal padding
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        justifyContent: "center",
    },
    dateText: {
        color: "#000",
    },
    submitButton: {
        backgroundColor: "#424242",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10,
    },
    allLabels: {
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        color: "#000000",
        textAlign: "right",
        marginRight: 10,
    },
});
