import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ChatSupportScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presetQuestions, setPresetQuestions] = useState([
    { text: "What does Motodachi do?", response: "Motodachi is a service that helps you get home or to work faster with convenient, reliable rides." },
    { text: "What is your pricing?", response: "Our pricing starts at 50 pesos for the first kilometer and adds 10 pesos per additional kilometer." },
    { text: "Contact Number", response: "Our contact number is +639 123 4567 789." },
  ]);
  const navigation = useNavigation();

  const addMessage = (response, index) => {
    setMessages(prevMessages => [...prevMessages, { text: response, sender: 'agent' }]);
    setPresetQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
  };

  const back = () => {
    navigation.navigate('HelpSupport');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.chatSupportHeader}>
          <Ionicons name="headset-outline" size={24} color="black" />
          <Text style={styles.chatSupportTitle}>Chat Support</Text>
        </View>

        <ScrollView style={styles.messageContainer}>
          {messages.map((msg, index) => (
            <View key={index} style={msg.sender === 'user' ? styles.userMessage : styles.agentMessage}>
              {msg.sender === 'agent' && (
                <View style={styles.agentAvatar}>
                  <Ionicons name="person" size={24} color="white" />
                </View>
              )}
              <View style={msg.sender === 'agent' ? styles.messageContentAgent : styles.messageContentUser}>
                {msg.sender === 'agent' && (
                  <Text style={styles.agentName}>Support Agent</Text>
                )}
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            </View>
          ))}
          {loading && <ActivityIndicator size="small" color="#007AFF" style={styles.loadingIndicator} />}
        </ScrollView>

        <View style={styles.presetContainer}>
          {presetQuestions.map((question, index) => (
            <TouchableOpacity key={index} style={styles.presetButton} onPress={() => addMessage(question.response, index)}>
              <Text style={styles.presetText}>{question.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message here"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity onPress={() => addMessage(message)} style={styles.sendButton}>
              <Ionicons name="send" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7', 
    top: 15,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E5EA' 
  },
  backButton: { 
    marginRight: 16 
  },
  headerTitle: { 
    fontSize: 17, 
    fontWeight: '600' 
  },
  chatSupportHeader: { 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 16 
  },
  chatSupportTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginLeft: 8 
  },
  messageContainer: { 
    flex: 1, 
    padding: 16 
  },
  userMessage: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginBottom: 16 
  },
  agentMessage: { 
    flexDirection: 'row', 
    marginBottom: 16
  },
  agentAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12
  },
  messageContentAgent: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 12, 
    maxWidth: '70%'
  },
  messageContentUser: { 
    backgroundColor: '#007AFF', 
    borderRadius: 20, 
    padding: 12, 
    maxWidth: '70%', 
    color: 'white' 
  },
  messageText: { 
    fontSize: 16, 
    color: 'black' 
  },
  agentName: { 
    fontSize: 14, 
    fontWeight: '600',
    marginBottom: 4, 
    color: '#8E8E93' 
  },
  presetContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  presetButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  presetText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: { 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#E5E5EA' 
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    borderRadius: 20, 
    paddingHorizontal: 12
   },
  input: { 
    flex: 1, 
    height: 40, 
    fontSize: 16 
  },
  sendButton: { 
    padding: 8 
  },
  loadingIndicator: { 
    marginVertical: 10 
  },
});
