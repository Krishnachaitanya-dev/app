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
import { Stack, router } from 'expo-router';
import theme from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import DateSelector from '@/components/DateSelector';
import TimeSlotSelector from '@/components/TimeSlotSelector';
import AddressCard from '@/components/AddressCard';
import Button from '@/components/Button';
import { ArrowRight, Plus } from 'lucide-react-native';

export default function PickupDetailsScreen() {
  const { user } = useAuthStore();
  const { currentOrder, setPickupDetails } = useOrderStore();
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState(
    user?.address.find(a => a.isDefault) || null
  );
  
  const handleContinue = () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a pickup date');
      return;
    }
    
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a pickup time slot');
      return;
    }
    
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a pickup address');
      return;
    }
    
    // Save pickup details to order store
    setPickupDetails(selectedAddress, selectedDate, selectedTimeSlot);
    
    // Navigate to delivery details screen
    router.push('/order/delivery');
  };
  
  const handleAddAddress = () => {
    // In a real app, this would navigate to an add address screen
    Alert.alert('Add Address', 'This feature would allow adding a new address');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Pickup Details' }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Schedule Pickup</Text>
        <Text style={styles.subtitle}>Select when and where to pick up your laundry</Text>
        
        <DateSelector
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        
        <TimeSlotSelector
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onSelectTimeSlot={setSelectedTimeSlot}
        />
        
        <View style={styles.addressesContainer}>
          <View style={styles.addressesHeader}>
            <Text style={styles.addressesTitle}>Pickup Address</Text>
            <TouchableOpacity onPress={handleAddAddress}>
              <Text style={styles.addAddressText}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          
          {user?.address.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onPress={setSelectedAddress}
              selected={selectedAddress?.id === address.id}
            />
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          fullWidth
          rightIcon={<ArrowRight size={20} color={theme.colors.white} />}
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
  addressesContainer: {
    marginBottom: theme.spacing.l,
  },
  addressesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  addressesTitle: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  addAddressText: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.primary,
    fontWeight: '600',
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