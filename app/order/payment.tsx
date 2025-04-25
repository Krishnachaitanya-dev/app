import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import theme from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import PaymentMethodCard from '@/components/PaymentMethodCard';
import Button from '@/components/Button';
import { ArrowRight, Plus, FileText } from 'lucide-react-native';
import { PaymentMethod } from '@/types';

export default function PaymentScreen() {
  const { user } = useAuthStore();
  const { currentOrder, setPaymentMethod, setSpecialInstructions, calculateTotal, placeOrder } = useOrderStore();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(
    user?.paymentMethods?.find((pm: PaymentMethod) => pm.isDefault) || null
  );
  const [specialInstructions, setInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const handleAddPaymentMethod = () => {
    // In a real app, this would navigate to an add payment method screen
    Alert.alert('Add Payment Method', 'This feature would allow adding a new payment method');
  };
  
  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    try {
      setIsPlacingOrder(true);
      
      // Save payment method and special instructions to order store
      setPaymentMethod(selectedPaymentMethod);
      setSpecialInstructions(specialInstructions);
      
      // Place the order
      const newOrder = await placeOrder();
      
      // Navigate to confirmation screen
      router.replace({
        pathname: '/order/confirmation',
        params: { orderId: newOrder.id },
      });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Payment' }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Payment Details</Text>
        <Text style={styles.subtitle}>Select a payment method and review your order</Text>
        
        <View style={styles.paymentMethodsContainer}>
          <View style={styles.paymentMethodsHeader}>
            <Text style={styles.paymentMethodsTitle}>Payment Methods</Text>
            <TouchableOpacity onPress={handleAddPaymentMethod}>
              <Text style={styles.addPaymentMethodText}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          
          {user?.paymentMethods?.map((paymentMethod: PaymentMethod) => (
            <PaymentMethodCard
              key={paymentMethod.id}
              paymentMethod={paymentMethod}
              onPress={setSelectedPaymentMethod}
              selected={selectedPaymentMethod?.id === paymentMethod.id}
            />
          ))}
        </View>
        
        <View style={styles.orderSummaryContainer}>
          <Text style={styles.orderSummaryTitle}>Order Summary</Text>
          
          {currentOrder.services.map((service) => (
            <View key={service.serviceId} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{service.serviceName}</Text>
                <Text style={styles.orderItemQuantity}>x{service.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>₹{service.price.toFixed(2)}</Text>
            </View>
          ))}
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹{calculateTotal().toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsHeader}>
            <FileText size={20} color={theme.colors.primary} />
            <Text style={styles.instructionsTitle}>Special Instructions</Text>
          </View>
          
          <TextInput
            style={styles.instructionsInput}
            placeholder="Add any special instructions for your laundry..."
            multiline
            numberOfLines={4}
            value={specialInstructions}
            onChangeText={setInstructions}
          />
        </View>
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <View style={styles.totalSummary}>
          <Text style={styles.totalSummaryLabel}>Total</Text>
          <Text style={styles.totalSummaryAmount}>₹{calculateTotal().toFixed(2)}</Text>
        </View>
        
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={isPlacingOrder}
          fullWidth
          rightIcon={!isPlacingOrder ? <ArrowRight size={20} color={theme.colors.white} /> : undefined}
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
    paddingBottom: 120,
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
  paymentMethodsContainer: {
    marginBottom: theme.spacing.l,
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  paymentMethodsTitle: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  addPaymentMethodText: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  orderSummaryContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  orderSummaryTitle: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  orderItemQuantity: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
  },
  orderItemPrice: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.m,
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  totalAmount: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  instructionsContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  instructionsTitle: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  instructionsInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: theme.fontSizes.m,
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
  totalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  totalSummaryLabel: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  totalSummaryAmount: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});