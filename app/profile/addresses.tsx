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
import AddressCard from '@/components/AddressCard';
import Button from '@/components/Button';
import { Plus, MapPin } from 'lucide-react-native';

export default function AddressesScreen() {
  const { user, updateUser } = useAuthStore();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  
  const handleAddAddress = () => {
    // In a real app, this would navigate to an add address screen
    Alert.alert('Add Address', 'This feature would allow adding a new address');
  };
  
  const handleEditAddress = (addressId: string) => {
    // In a real app, this would navigate to an edit address screen
    Alert.alert('Edit Address', `This feature would allow editing address ${addressId}`);
  };
  
  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            if (user) {
              const updatedAddresses = user.address.filter(addr => addr.id !== addressId);
              updateUser({ address: updatedAddresses });
              Alert.alert('Success', 'Address deleted successfully');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSetAsDefault = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.address.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
      
      updateUser({ address: updatedAddresses });
      Alert.alert('Success', 'Default address updated successfully');
    }
  };
  
  const handleAddressPress = (addressId: string) => {
    setSelectedAddress(addressId === selectedAddress ? null : addressId);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'My Addresses' }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Your Addresses</Text>
        <Text style={styles.subtitle}>Manage your delivery and pickup addresses</Text>
        
        {user?.address.map((address) => (
          <View key={address.id}>
            <TouchableOpacity
              style={styles.addressCardContainer}
              onPress={() => handleAddressPress(address.id)}
              activeOpacity={0.7}
            >
              <AddressCard
                address={address}
                onPress={() => handleAddressPress(address.id)}
                selected={selectedAddress === address.id}
              />
            </TouchableOpacity>
            
            {selectedAddress === address.id && (
              <View style={styles.addressActions}>
                <Button
                  title="Edit"
                  onPress={() => handleEditAddress(address.id)}
                  variant="outline"
                  size="small"
                  style={styles.actionButton}
                />
                
                {!address.isDefault && (
                  <Button
                    title="Set as Default"
                    onPress={() => handleSetAsDefault(address.id)}
                    variant="outline"
                    size="small"
                    style={styles.actionButton}
                  />
                )}
                
                {user.address.length > 1 && (
                  <Button
                    title="Delete"
                    onPress={() => handleDeleteAddress(address.id)}
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
          title="Add New Address"
          onPress={handleAddAddress}
          fullWidth
          leftIcon={<MapPin size={20} color={theme.colors.white} />}
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
  addressCardContainer: {
    marginBottom: theme.spacing.s,
  },
  addressActions: {
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