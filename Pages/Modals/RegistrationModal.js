import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { Card, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

const RegistrationModal = ({ visible, onClose, email, password }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

    // Assign email and password to state
    const [userEmail, setUserEmail] = useState(email);
    const [userPassword, setUserPassword] = useState(password);

    useEffect(() => {
        setUserEmail(email);
        setUserPassword(password);
    }, [email, password]);

    const handleRegister = async () => {
        if (!firstName || !lastName || !phoneNumber || !birthDate || !gender) {
            Alert.alert("Incomplete Data", "Please fill out all fields.");
            return;
        }

        const payload = {
            firstName,
            lastName,
            email: userEmail,
            phone: phoneNumber,
            birthDate: birthDate.toISOString(),
            gender,
            password: userPassword,
        };

        try {
            const response = await fetch("http://192.168.1.2:5000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert("Success", "User Registered Successfully!");
                onClose();
            } else {
                Alert.alert(
                    "Error",
                    result.error || "Failed to register user."
                );
            }
        } catch (error) {
            console.log("Error during registration:", error);
            Alert.alert("Error", "An error occurred during registration.");
        }
    };

    const onChangeDate = (event, selectedDate) => {
        if (event.type === "set") {
            setBirthDate(selectedDate || birthDate);
        }
        setShowDatePicker(false);
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <Card style={styles.card}>
                    <Text style={styles.SignUpLabel}>Registration</Text>

                    {/* First Name */}
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

                    {/* Last Name */}
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

                    {/* Gender */}
                    <Text style={styles.allLabels}>Gender</Text>
                    <View style={styles.inputContainer}>
                        <Icon
                            name="wc"
                            size={20}
                            color="#AFAFAF"
                            style={styles.icon}
                        />
                        <Picker
                            selectedValue={gender}
                            onValueChange={(value) => setGender(value)}
                            style={styles.inputField}
                        >
                            <Picker.Item label="Select Gender" value="" color="#AFAFAF" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                        </Picker>
                    </View>

                    {/* Birthdate */}
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

                    {/* Phone Number */}
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

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleRegister}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.registerLabel}>Continue</Text>
                    </TouchableOpacity>
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
    SignUpLabel: { fontSize: 30, marginBottom: 20, textAlign: "center" },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    card: { width: "90%", padding: 20, borderRadius: 20 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    icon: { marginRight: 10 },
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
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        justifyContent: "center",
    },
    dateText: { color: "#000" },
    submitButton: {
        backgroundColor: "#424242",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10,
    },
    registerLabel: { color: "#FFFFFF", fontSize: 16, marginVertical: 5 },
    allLabels: { fontSize: 16, marginBottom: 5 },
    closeButton: {
        color: "#000000",
        textAlign: "right",
        marginTop: 10,
        fontSize: 16,
    },
});
