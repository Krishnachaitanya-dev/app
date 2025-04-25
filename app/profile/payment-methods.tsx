import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import theme from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import PaymentMethodCard from '@/components/PaymentMethodCard';
import Button from '@/components/Button';
import { Plus, CreditCard } from 'lucide-react-native';
import { PaymentMethod } from '@/types';

export default function PaymentMethodsScreen() {
  const { user, updateUser } = useAuthStore();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  
  const handleAddPaymentMethod = () => {
    // In a real app, this would navigate to an add payment method screen
    Alert.alert('Add Payment Method', 'This feature would allow adding a new payment method');
  };
  
  const handleEditPaymentMethod = (paymentMethodId: string) => {
    // In a real app, this would navigate to an edit payment method screen
    Alert.alert('Edit Payment Method', `This feature would allow editing payment method ${paymentMethodId}`);
  };
  
  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            if (user) {
              const updatedPaymentMethods = user.paymentMethods.filter(pm => pm.id !== paymentMethodId);
              updateUser({ paymentMethods: updatedPaymentMethods });
              Alert.alert('Success', 'Payment method deleted successfully');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSetAsDefault = (paymentMethodId: string) => {
    if (user) {
      const updatedPaymentMethods = user.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId,
      }));
      
      updateUser({ paymentMethods: updatedPaymentMethods });
      Alert.alert('Success', 'Default payment method updated successfully');
    }
  };
  
  const handlePaymentMethodPress = (paymentMethodId: string) => {
    setSelectedPaymentMethod(paymentMethodId === selectedPaymentMethod ? null : paymentMethodId);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Payment Methods' }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Your Payment Methods</Text>
        <Text style={styles.subtitle}>Manage your payment options</Text>
        
        {user?.paymentMethods?.map((paymentMethod: PaymentMethod) => (
          <View key={paymentMethod.id}>
            <TouchableOpacity
              style={styles.paymentMethodCardContainer}
              onPress={() => handlePaymentMethodPress(paymentMethod.id)}
              activeOpacity={0.7}
            >
              <PaymentMethodCard
                paymentMethod={paymentMethod}
                onPress={() => handlePaymentMethodPress(paymentMethod.id)}
                selected={selectedPaymentMethod === paymentMethod.id}
              />
            </TouchableOpacity>
            
            {selectedPaymentMethod === paymentMethod.id && (
              <View style={styles.paymentMethodActions}>
                <Button
                  title="Edit"
                  onPress={() => handleEditPaymentMethod(paymentMethod.id)}
                  variant="outline"
                  size="small"
                  style={styles.actionButton}
                />
                
                {!paymentMethod.isDefault && (
                  <Button
                    title="Set as Default"
                    onPress={() => handleSetAsDefault(paymentMethod.id)}
                    variant="outline"
                    size="small"
                    style={styles.actionButton}
                  />
                )}
                
                {user.paymentMethods.length > 1 && (
                  <Button
                    title="Delete"
                    onPress={() => handleDeletePaymentMethod(paymentMethod.id)}
                    variant="outline"
                    size="small"
                    style={[styles.actionButton, styles.deleteButton]}
                    textStyle={styles.deleteButtonText}
                  />
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <Button
          title="Add Payment Method"
          onPress={handleAddPaymentMethod}
          fullWidth
          leftIcon={<CreditCard size={20} color={theme.colors.white} />}
        />
      </View>
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
    paddingBottom: 100,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.l,
  },
  paymentMethodCardContainer: {
    marginBottom: theme.spacing.s,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.l,
    marginTop: -theme.spacing.s,
  },
  actionButton: {
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  deleteButtonText: {
    color: theme.colors.error,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.l,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});