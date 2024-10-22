import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatSupportScreen() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Implement send message logic here
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.chatSupportHeader}>
          <Ionicons name="headset-outline" size={24} color="black" />
          <Text style={styles.chatSupportTitle}>Chat Support</Text>
        </View>

        <View style={styles.messageContainer}>
          <View style={styles.agentMessage}>
            <View style={styles.agentAvatar}>
              <Ionicons name="person" size={24} color="white" />
            </View>
            <View style={styles.messageContent}>
              <Text style={styles.agentName}>Support Agent</Text>
              <Text style={styles.messageText}>Hello, How may I help you?</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message here"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
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
    marginVertical: 10,
    marginHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  chatSupportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  chatSupportTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  messageContainer: {
    flex: 1,
    padding: 16,
  },
  agentMessage: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginVertical: 15,
  },
  messageContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    maxWidth: '70%',
  },
  agentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#8E8E93',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
});