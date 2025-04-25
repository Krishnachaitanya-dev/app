import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import theme from '@/constants/theme';
import { services } from '@/mocks/services';
import { Service } from '@/types';
import { useOrderStore } from '@/store/order-store';
import ServiceCard from '@/components/ServiceCard';
import Button from '@/components/Button';
import QuantitySelector from '@/components/QuantitySelector';
import { ArrowRight, X } from 'lucide-react-native';

export default function NewOrderScreen() {
  const params = useLocalSearchParams<{ serviceId?: string }>();
  const { addService, currentOrder, resetCurrentOrder } = useOrderStore();
  
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: { service: Service; quantity: number };
  }>({});
  
  useEffect(() => {
    // Reset current order when entering this screen
    resetCurrentOrder();
    
    // If a service ID is provided in the params, select it
    if (params.serviceId) {
      const service = services.find(s => s.id === params.serviceId);
      if (service) {
        handleServiceSelect(service);
      }
    }
  }, []);
  
  const handleServiceSelect = (service: Service) => {
    setSelectedServices(prev => {
      const newSelectedServices = { ...prev };
      
      if (newSelectedServices[service.id]) {
        // If already selected, increment quantity
        newSelectedServices[service.id] = {
          ...newSelectedServices[service.id],
          quantity: newSelectedServices[service.id].quantity + 1,
        };
      } else {
        // If not selected, add with quantity 1
        newSelectedServices[service.id] = {
          service,
          quantity: 1,
        };
      }
      
      return newSelectedServices;
    });
  };
  
  const handleQuantityChange = (serviceId: string, quantity: number) => {
    setSelectedServices(prev => {
      const newSelectedServices = { ...prev };
      
      if (quantity <= 0) {
        // Remove service if quantity is 0 or negative
        delete newSelectedServices[serviceId];
      } else {
        // Update quantity
        newSelectedServices[serviceId] = {
          ...newSelectedServices[serviceId],
          quantity,
        };
      }
      
      return newSelectedServices;
    });
  };
  
  const calculateTotal = () => {
    return Object.values(selectedServices).reduce((total, { service, quantity }) => {
      return total + (service.pricePerUnit * quantity);
    }, 0);
  };
  
  const handleContinue = () => {
    if (Object.keys(selectedServices).length === 0) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }
    
    // Add selected services to order store
    Object.values(selectedServices).forEach(({ service, quantity }) => {
      addService({
        serviceId: service.id,
        serviceName: service.name,
        quantity,
        price: service.pricePerUnit * quantity,
      });
    });
    
    // Navigate to pickup details screen
    router.push('/order/pickup');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Select Services',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Choose Laundry Services</Text>
        <Text style={styles.subtitle}>Select the services you need</Text>
        
        <View style={styles.servicesContainer}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={handleServiceSelect}
              selected={!!selectedServices[service.id]}
            />
          ))}
        </View>
      </ScrollView>
      
      {Object.keys(selectedServices).length > 0 && (
        <View style={styles.selectedServicesContainer}>
          <Text style={styles.selectedServicesTitle}>Selected Services</Text>
          
          {Object.values(selectedServices).map(({ service, quantity }) => (
            <View key={service.id} style={styles.selectedServiceItem}>
              <View style={styles.selectedServiceInfo}>
                <Text style={styles.selectedServiceName}>{service.name}</Text>
                <Text style={styles.selectedServicePrice}>
                  ₹{(service.pricePerUnit * quantity).toFixed(2)}
                </Text>
              </View>
              
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => handleQuantityChange(service.id, quantity + 1)}
                onDecrease={() => handleQuantityChange(service.id, quantity - 1)}
              />
            </View>
          ))}
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹{calculateTotal().toFixed(2)}</Text>
          </View>
          
          <Button
            title="Continue"
            onPress={handleContinue}
            fullWidth
            rightIcon={<ArrowRight size={20} color={theme.colors.white} />}
          />
        </View>
      )}
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
    paddingBottom: 200,
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
  servicesContainer: {
    marginBottom: theme.spacing.l,
  },
  selectedServicesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.l,
    borderTopRightRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    ...theme.shadows.large,
  },
  selectedServicesTitle: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  selectedServiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedServiceInfo: {
    flex: 1,
  },
  selectedServiceName: {
    fontSize: theme.fontSizes.m,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  selectedServicePrice: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.l,
  },
  totalLabel: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  totalAmount: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});