import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentMethod } from '@/types';
import { 
  fetchPaymentMethods, 
  addPaymentMethod, 
  updatePaymentMethod, 
  deletePaymentMethod 
} from '@/services/payment-service';
import { useAuthStore } from './auth-store';

interface PaymentMethodState {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<PaymentMethod>;
  updatePaymentMethod: (paymentMethodId: string, paymentMethodData: Partial<PaymentMethod>) => Promise<PaymentMethod>;
  deletePaymentMethod: (paymentMethodId: string) => Promise<void>;
  getDefaultPaymentMethod: () => PaymentMethod | null;
}

export const usePaymentMethodStore = create<PaymentMethodState>()(
  persist(
    (set, get) => ({
      paymentMethods: [],
      isLoading: false,
      error: null,
      
      fetchPaymentMethods: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const paymentMethods = await fetchPaymentMethods(user.id);
          set({ paymentMethods, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch payment methods', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      addPaymentMethod: async (paymentMethodData) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const newPaymentMethod = await addPaymentMethod(user.id, paymentMethodData);
          
          set((state) => ({
            paymentMethods: paymentMethodData.isDefault
              ? [
                  newPaymentMethod,
                  ...state.paymentMethods.map(pm => ({
                    ...pm,
                    isDefault: false,
                  })),
                ]
              : [newPaymentMethod, ...state.paymentMethods],
            isLoading: false,
          }));
          
          return newPaymentMethod;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add payment method', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updatePaymentMethod: async (paymentMethodId, paymentMethodData) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const updatedPaymentMethod = await updatePaymentMethod(user.id, paymentMethodId, paymentMethodData);
          
          set((state) => {
            const updatedPaymentMethods = state.paymentMethods.map(pm => {
              if (pm.id === paymentMethodId) {
                return updatedPaymentMethod;
              }
              
              // If the updated payment method is now the default, make sure others are not
              if (paymentMethodData.isDefault && paymentMethodData.isDefault === true) {
                return {
                  ...pm,
                  isDefault: false,
                };
              }
              
              return pm;
            });
            
            return {
              paymentMethods: updatedPaymentMethods,
              isLoading: false,
            };
          });
          
          return updatedPaymentMethod;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update payment method', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      deletePaymentMethod: async (paymentMethodId) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          await deletePaymentMethod(user.id, paymentMethodId);
          
          set((state) => {
            const wasDefault = state.paymentMethods.find(pm => pm.id === paymentMethodId)?.isDefault;
            const filteredPaymentMethods = state.paymentMethods.filter(pm => pm.id !== paymentMethodId);
            
            // If we deleted the default payment method and have others, make the first one default
            if (wasDefault && filteredPaymentMethods.length > 0) {
              filteredPaymentMethods[0].isDefault = true;
            }
            
            return {
              paymentMethods: filteredPaymentMethods,
              isLoading: false,
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete payment method', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      getDefaultPaymentMethod: () => {
        const { paymentMethods } = get();
        return paymentMethods.find(pm => pm.isDefault) || paymentMethods[0] || null;
      },
    }),
    {
      name: 'laundry-payment-method-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);