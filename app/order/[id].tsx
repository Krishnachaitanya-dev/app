import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import theme from '@/constants/theme';
import { useOrderStore } from '@/store/order-store';
import ProgressTracker from '@/components/ProgressTracker';
import Button from '@/components/Button';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  FileText, 
  MessageSquare,
  Phone,
  X,
} from 'lucide-react-native';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrderById } = useOrderStore();
  const [order, setOrder] = useState(getOrderById(id));
  
  useEffect(() => {
    if (!order) {
      Alert.alert('Error', 'Order not found');
      router.back();
    }
  }, [order]);
  
  if (!order) {
    return null;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const handleContactSupport = () => {
    router.push('/support/chat');
  };
  
  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          onPress: () => {
            // In a real app, this would call an API to cancel the order
            Alert.alert('Order Cancelled', 'Your order has been cancelled successfully.');
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: `Order ${order.id}`,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleContactSupport}
            >
              <MessageSquare size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statusContainer}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Order Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </View>
          </View>
          
          <ProgressTracker status={order.status} />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Services</Text>
          
          {order.services.map((service, index) => (
            <View 
              key={service.serviceId}
              style={[
                styles.serviceItem,
                index < order.services.length - 1 && styles.serviceItemBorder,
              ]}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.serviceName}</Text>
                <Text style={styles.servicePrice}>${service.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.serviceQuantity}>Quantity: {service.quantity}</Text>
            </View>
          ))}
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <MapPin size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailText}>
                {order.pickupDetails.address.street}
              </Text>
              <Text style={styles.detailText}>
                {order.pickupDetails.address.city}, {order.pickupDetails.address.state} {order.pickupDetails.address.zipCode}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Calendar size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailText}>
                {formatDate(order.pickupDetails.date)}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Clock size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailText}>
                {order.pickupDetails.timeSlot}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <MapPin size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailText}>
                {order.deliveryDetails.address.street}
              </Text>
              <Text style={styles.detailText}>
                {order.deliveryDetails.address.city}, {order.deliveryDetails.address.state} {order.deliveryDetails.address.zipCode}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Calendar size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailText}>
                {formatDate(order.deliveryDetails.date)}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Clock size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailText}>
                {order.deliveryDetails.timeSlot}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment</Text>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <CreditCard size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Method</Text>
              <Text style={styles.detailText}>
                {order.paymentDetails.method.type === 'card' 
                  ? `Card ending in ${order.paymentDetails.method.last4}` 
                  : order.paymentDetails.method.type.charAt(0).toUpperCase() + order.paymentDetails.method.type.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <FileText size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailText}>
                {order.paymentDetails.status.charAt(0).toUpperCase() + order.paymentDetails.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
        
        {order.specialInstructions && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <Text style={styles.instructionsText}>
              {order.specialInstructions}
            </Text>
          </View>
        )}
        
        {(order.status === 'pending' || order.status === 'confirmed') && (
          <View style={styles.actionsContainer}>
            <Button
              title="Contact Support"
              onPress={handleContactSupport}
              variant="outline"
              style={styles.supportButton}
              leftIcon={<Phone size={20} color={theme.colors.primary} />}
            />
            
            <Button
              title="Cancel Order"
              onPress={handleCancelOrder}
              variant="outline"
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              leftIcon={<X size={20} color={theme.colors.error} />}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: theme.spacing.l,
  },
  statusContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  statusTitle: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statusBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.m,
  },
  statusText: {
    fontSize: theme.fontSizes.s,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  sectionContainer: {
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
  serviceItem: {
    paddingVertical: theme.spacing.m,
  },
  serviceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  serviceName: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  servicePrice: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  serviceQuantity: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.l,
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
  detailItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
  },
  instructionsText: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  supportButton: {
    flex: 1,
    marginRight: theme.spacing.s,
  },
  cancelButton: {
    flex: 1,
    marginLeft: theme.spacing.s,
    borderColor: theme.colors.error,
  },
  cancelButtonText: {
    color: theme.colors.error,
  },
});