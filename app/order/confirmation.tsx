import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import theme from '@/constants/theme';
import { useOrderStore } from '@/store/order-store';
import Button from '@/components/Button';
import { CheckCircle, Home, Package } from 'lucide-react-native';

export default function ConfirmationScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { getOrderById } = useOrderStore();
  const [order, setOrder] = useState(getOrderById(orderId));
  
  useEffect(() => {
    if (!order) {
      router.replace('/(tabs)');
    }
  }, [order]);
  
  const handleViewOrder = () => {
    router.push(`/order/${orderId}`);
  };
  
  const handleGoHome = () => {
    router.replace('/(tabs)');
  };
  
  if (!order) {
    return null;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Order Confirmation',
          headerLeft: () => null, // Disable back button
        }} 
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.successContainer}>
          <CheckCircle size={80} color={theme.colors.success} />
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successMessage}>
            Your order has been confirmed and will be processed shortly.
          </Text>
        </View>
        
        <View style={styles.orderInfoContainer}>
          <Text style={styles.orderInfoTitle}>Order Information</Text>
          
          <View style={styles.orderInfoItem}>
            <Text style={styles.orderInfoLabel}>Order ID</Text>
            <Text style={styles.orderInfoValue}>{order.id}</Text>
          </View>
          
          <View style={styles.orderInfoItem}>
            <Text style={styles.orderInfoLabel}>Pickup Date</Text>
            <Text style={styles.orderInfoValue}>
              {formatDate(order.pickupDetails.date)} ({order.pickupDetails.timeSlot})
            </Text>
          </View>
          
          <View style={styles.orderInfoItem}>
            <Text style={styles.orderInfoLabel}>Delivery Date</Text>
            <Text style={styles.orderInfoValue}>
              {formatDate(order.deliveryDetails.date)} ({order.deliveryDetails.timeSlot})
            </Text>
          </View>
          
          <View style={styles.orderInfoItem}>
            <Text style={styles.orderInfoLabel}>Total Amount</Text>
            <Text style={[styles.orderInfoValue, styles.totalAmount]}>
              ₹{order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>What's Next?</Text>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={styles.instructionText}>
                Prepare your laundry for pickup at the scheduled time
              </Text>
            </View>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={styles.instructionText}>
                Our delivery agent will collect your items
              </Text>
            </View>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={styles.instructionText}>
                Track your order status in the Orders tab
              </Text>
            </View>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>4</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={styles.instructionText}>
                Receive your clean laundry at the delivery time
              </Text>
            </View>
          </View>
        </View>
        
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=2671&auto=format&fit=crop' }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <Button
          title="View Order Details"
          onPress={handleViewOrder}
          variant="outline"
          style={styles.viewOrderButton}
          leftIcon={<Package size={20} color={theme.colors.primary} />}
        />
        
        <Button
          title="Go to Home"
          onPress={handleGoHome}
          fullWidth
          leftIcon={<Home size={20} color={theme.colors.white} />}
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
  successContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  successTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.textLight,
    textAlign: 'center',
    maxWidth: '80%',
  },
  orderInfoContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  orderInfoTitle: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  orderInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  orderInfoLabel: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.textLight,
  },
  orderInfoValue: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  totalAmount: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.l,
  },
  instructionsContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  instructionsTitle: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
  },
  instructionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  instructionNumberText: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.white,
  },
  instructionContent: {
    flex: 1,
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
    lineHeight: 22,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.l,
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
  viewOrderButton: {
    marginBottom: theme.spacing.m,
  },
});