import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import theme from '@/constants/theme';
import Button from '@/components/Button';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  ChevronRight, 
  HelpCircle,
  FileText,
  Send,
} from 'lucide-react-native';

export default function SupportScreen() {
  const [message, setMessage] = useState('');
  
  const faqItems = [
    {
      question: 'How do I place an order?',
      answer: 'You can place an order by tapping on the "Place New Order" button on the home screen or orders tab. Then select the services you need, schedule pickup and delivery times, and complete the payment process.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, PayPal, and mobile payment options like Apple Pay and Google Pay.',
    },
    {
      question: 'How long does the laundry service take?',
      answer: 'Standard service typically takes 24-48 hours from pickup to delivery. Express service is available for same-day or next-day delivery depending on the time of pickup.',
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order before it is picked up without any charges. After pickup, cancellation fees may apply.',
    },
    {
      question: 'What if my clothes are damaged?',
      answer: 'We take utmost care of your items. In the rare event of damage, please contact our support team within 48 hours of delivery, and we will assess the situation and provide appropriate compensation.',
    },
  ];
  
  const handleStartChat = () => {
    router.push('/support/chat');
  };
  
  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the support team
      alert('Message sent to support team!');
      setMessage('');
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.quickHelpContainer}>
          <Text style={styles.sectionTitle}>How can we help you?</Text>
          
          <View style={styles.contactOptionsContainer}>
            <TouchableOpacity style={styles.contactOption} onPress={handleStartChat}>
              <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.primary }]}>
                <MessageSquare size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.contactOptionText}>Live Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactOption}>
              <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.secondary }]}>
                <Phone size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.contactOptionText}>Call Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactOption}>
              <View style={[styles.contactIconContainer, { backgroundColor: theme.colors.success }]}>
                <Mail size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.contactOptionText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.quickMessageContainer}>
          <Text style={styles.sectionTitle}>Send a Quick Message</Text>
          
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              multiline
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.faqContainer}>
          <View style={styles.faqHeader}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {faqItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.faqItem}
            >
              <View style={styles.faqQuestion}>
                <HelpCircle size={20} color={theme.colors.primary} />
                <Text style={styles.faqQuestionText}>{item.question}</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.policiesContainer}>
          <Text style={styles.sectionTitle}>Policies & Information</Text>
          
          <TouchableOpacity style={styles.policyItem}>
            <View style={styles.policyInfo}>
              <FileText size={20} color={theme.colors.primary} />
              <Text style={styles.policyText}>Terms of Service</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.policyItem}>
            <View style={styles.policyInfo}>
              <FileText size={20} color={theme.colors.primary} />
              <Text style={styles.policyText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.policyItem}>
            <View style={styles.policyInfo}>
              <FileText size={20} color={theme.colors.primary} />
              <Text style={styles.policyText}>Refund Policy</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollContent: {
    padding: theme.spacing.l,
  },
  quickHelpContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  contactOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactOption: {
    alignItems: 'center',
    width: '30%',
  },
  contactIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  contactOptionText: {
    fontSize: theme.fontSizes.s,
    fontWeight: '500',
    color: theme.colors.text,
  },
  quickMessageContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    minHeight: 100,
    maxHeight: 150,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
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
  faqContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  viewAllLink: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faqQuestionText: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
    flex: 1,
  },
  policiesContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
  },
  policyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  policyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  policyText: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
});