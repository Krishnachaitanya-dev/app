import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderService, Address, PaymentMethod } from '@/types';
import { 
  fetchOrders, 
  getOrderById, 
  placeOrder, 
  getServices, 
  getTimeSlots 
} from '@/services/order-service';
import { useAuthStore } from './auth-store';

interface OrderState {
  orders: Order[];
  services: OrderService[];
  timeSlots: string[];
  currentOrder: {
    services: OrderService[];
    pickupAddress: Address | null;
    pickupDate: string | null;
    pickupTimeSlot: string | null;
    deliveryAddress: Address | null;
    deliveryDate: string | null;
    deliveryTimeSlot: string | null;
    paymentMethod: PaymentMethod | null;
    specialInstructions: string;
  };
  isLoading: boolean;
  error: string | null;
  
  // Order history actions
  fetchOrders: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | undefined>;
  
  // Service actions
  fetchServices: () => Promise<void>;
  fetchTimeSlots: () => Promise<void>;
  
  // Current order actions
  addService: (service: OrderService) => void;
  updateServiceQuantity: (serviceId: string, quantity: number) => void;
  removeService: (serviceId: string) => void;
  setPickupDetails: (address: Address, date: string, timeSlot: string) => void;
  setDeliveryDetails: (address: Address, date: string, timeSlot: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setSpecialInstructions: (instructions: string) => void;
  calculateTotal: () => number;
  placeOrder: () => Promise<Order>;
  resetCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      services: [],
      timeSlots: [],
      currentOrder: {
        services: [],
        pickupAddress: null,
        pickupDate: null,
        pickupTimeSlot: null,
        deliveryAddress: null,
        deliveryDate: null,
        deliveryTimeSlot: null,
        paymentMethod: null,
        specialInstructions: '',
      },
      isLoading: false,
      error: null,
      
      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const orders = await fetchOrders(user.id);
          set({ orders, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch orders', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      getOrderById: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const order = await getOrderById(id);
          set({ isLoading: false });
          return order || undefined;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch order', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      fetchServices: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const services = await getServices();
          set({ services, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch services', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      fetchTimeSlots: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const timeSlots = await getTimeSlots();
          set({ timeSlots, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch time slots', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      addService: (service) => {
        set((state) => {
          const existingServiceIndex = state.currentOrder.services.findIndex(
            s => s.serviceId === service.serviceId
          );
          
          if (existingServiceIndex >= 0) {
            // Update existing service
            const updatedServices = [...state.currentOrder.services];
            updatedServices[existingServiceIndex] = {
              ...updatedServices[existingServiceIndex],
              quantity: updatedServices[existingServiceIndex].quantity + service.quantity,
              price: (updatedServices[existingServiceIndex].quantity + service.quantity) * 
                     (service.price / service.quantity),
            };
            
            return {
              currentOrder: {
                ...state.currentOrder,
                services: updatedServices,
              },
            };
          } else {
            // Add new service
            return {
              currentOrder: {
                ...state.currentOrder,
                services: [...state.currentOrder.services, service],
              },
            };
          }
        });
      },
      
      updateServiceQuantity: (serviceId, quantity) => {
        set((state) => {
          const serviceIndex = state.currentOrder.services.findIndex(
            s => s.serviceId === serviceId
          );
          
          if (serviceIndex >= 0) {
            const updatedServices = [...state.currentOrder.services];
            const service = updatedServices[serviceIndex];
            
            if (quantity <= 0) {
              // Remove service if quantity is 0 or negative
              updatedServices.splice(serviceIndex, 1);
            } else {
              // Update quantity and price
              const pricePerUnit = service.price / service.quantity;
              updatedServices[serviceIndex] = {
                ...service,
                quantity,
                price: quantity * pricePerUnit,
              };
            }
            
            return {
              currentOrder: {
                ...state.currentOrder,
                services: updatedServices,
              },
            };
          }
          
          return state;
        });
      },
      
      removeService: (serviceId) => {
        set((state) => ({
          currentOrder: {
            ...state.currentOrder,
            services: state.currentOrder.services.filter(s => s.serviceId !== serviceId),
          },
        }));
      },
      
      setPickupDetails: (address, date, timeSlot) => {
        set((state) => ({
          currentOrder: {
            ...state.currentOrder,
            pickupAddress: address,
            pickupDate: date,
            pickupTimeSlot: timeSlot,
          },
        }));
      },
      
      setDeliveryDetails: (address, date, timeSlot) => {
        set((state) => ({
          currentOrder: {
            ...state.currentOrder,
            deliveryAddress: address,
            deliveryDate: date,
            deliveryTimeSlot: timeSlot,
          },
        }));
      },
      
      setPaymentMethod: (method) => {
        set((state) => ({
          currentOrder: {
            ...state.currentOrder,
            paymentMethod: method,
          },
        }));
      },
      
      setSpecialInstructions: (instructions) => {
        set((state) => ({
          currentOrder: {
            ...state.currentOrder,
            specialInstructions: instructions,
          },
        }));
      },
      
      calculateTotal: () => {
        const { services } = get().currentOrder;
        return services.reduce((total, service) => total + service.price, 0);
      },
      
      placeOrder: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { currentOrder } = get();
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Validate order
          if (
            !currentOrder.services.length ||
            !currentOrder.pickupAddress ||
            !currentOrder.pickupDate ||
            !currentOrder.pickupTimeSlot ||
            !currentOrder.deliveryAddress ||
            !currentOrder.deliveryDate ||
            !currentOrder.deliveryTimeSlot ||
            !currentOrder.paymentMethod
          ) {
            throw new Error('Please complete all required order details');
          }
          
          const totalAmount = get().calculateTotal();
          
          // Place the order
          const newOrder = await placeOrder(
            user.id,
            currentOrder.services,
            currentOrder.pickupAddress,
            currentOrder.pickupDate,
            currentOrder.pickupTimeSlot,
            currentOrder.deliveryAddress,
            currentOrder.deliveryDate,
            currentOrder.deliveryTimeSlot,
            currentOrder.paymentMethod,
            currentOrder.specialInstructions,
            totalAmount
          );
          
          // Add to orders list
          set((state) => ({
            orders: [newOrder, ...state.orders],
            isLoading: false,
          }));
          
          // Reset current order
          get().resetCurrentOrder();
          
          return newOrder;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to place order', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      resetCurrentOrder: () => {
        set({
          currentOrder: {
            services: [],
            pickupAddress: null,
            pickupDate: null,
            pickupTimeSlot: null,
            deliveryAddress: null,
            deliveryDate: null,
            deliveryTimeSlot: null,
            paymentMethod: null,
            specialInstructions: '',
          },
        });
      },
    }),
    {
      name: 'laundry-order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);