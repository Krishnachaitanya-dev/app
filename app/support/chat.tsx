import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import theme from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { Send } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export default function ChatScreen() {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'agent',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  const handleSend = () => {
    if (message.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      
      // Simulate agent response after a delay
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getAutoResponse(message),
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, agentMessage]);
      }, 1000);
    }
  };
  
  const getAutoResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return `Hello ${user?.name.split(' ')[0]}! How can I assist you with your laundry today?`;
    } else if (lowerCaseMessage.includes('order') && lowerCaseMessage.includes('status')) {
      return 'You can check your order status in the Orders tab. Is there a specific order you need help with?';
    } else if (lowerCaseMessage.includes('cancel')) {
      return 'To cancel an order, please go to the order details page and tap on "Cancel Order". Note that cancellation is only available before pickup.';
    } else if (lowerCaseMessage.includes('payment')) {
      return 'We accept credit/debit cards, PayPal, and mobile payment options. Is there a specific payment issue you need help with?';
    } else if (lowerCaseMessage.includes('delivery')) {
      return 'Our standard delivery time is within 24-48 hours after pickup. Express service is available for faster delivery.';
    } else {
      return "Thank you for your message. Our support team will get back to you shortly. Is there anything else I can help you with?";
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.agentMessageContainer,
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.agentMessageBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.agentMessageText,
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.messageTime}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Support Chat' }} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    padding: theme.spacing.l,
  },
  messageContainer: {
    marginBottom: theme.spacing.m,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  agentMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
  },
  userMessageBubble: {
    backgroundColor: theme.colors.primary,
  },
  agentMessageBubble: {
    backgroundColor: theme.colors.white,
  },
  messageText: {
    fontSize: theme.fontSizes.m,
    lineHeight: 22,
  },
  userMessageText: {
    color: theme.colors.white,
  },
  agentMessageText: {
    color: theme.colors.text,
  },
  messageTime: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textExtraLight,
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    maxHeight: 100,
    fontSize: theme.fontSizes.m,
    marginRight: theme.spacing.s,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.grayDark,
  },
});