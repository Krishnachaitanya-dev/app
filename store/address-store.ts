import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '@/types';
import { 
  fetchAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} from '@/services/address-service';
import { useAuthStore } from './auth-store';

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<Address>;
  updateAddress: (addressId: string, addressData: Partial<Address>) => Promise<Address>;
  deleteAddress: (addressId: string) => Promise<void>;
  getDefaultAddress: () => Address | null;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      isLoading: false,
      error: null,
      
      fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const addresses = await fetchAddresses(user.id);
          set({ addresses, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch addresses', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      addAddress: async (addressData) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const newAddress = await addAddress(user.id, addressData);
          
          set((state) => ({
            addresses: addressData.isDefault
              ? [
                  newAddress,
                  ...state.addresses.map(addr => ({
                    ...addr,
                    isDefault: false,
                  })),
                ]
              : [newAddress, ...state.addresses],
            isLoading: false,
          }));
          
          return newAddress;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add address', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateAddress: async (addressId, addressData) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const updatedAddress = await updateAddress(user.id, addressId, addressData);
          
          set((state) => {
            const updatedAddresses = state.addresses.map(addr => {
              if (addr.id === addressId) {
                return updatedAddress;
              }
              
              // If the updated address is now the default, make sure others are not
              if (addressData.isDefault && addressData.isDefault === true) {
                return {
                  ...addr,
                  isDefault: false,
                };
              }
              
              return addr;
            });
            
            return {
              addresses: updatedAddresses,
              isLoading: false,
            };
          });
          
          return updatedAddress;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update address', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      deleteAddress: async (addressId) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          await deleteAddress(user.id, addressId);
          
          set((state) => {
            const wasDefault = state.addresses.find(addr => addr.id === addressId)?.isDefault;
            const filteredAddresses = state.addresses.filter(addr => addr.id !== addressId);
            
            // If we deleted the default address and have other addresses, make the first one default
            if (wasDefault && filteredAddresses.length > 0) {
              filteredAddresses[0].isDefault = true;
            }
            
            return {
              addresses: filteredAddresses,
              isLoading: false,
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete address', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      getDefaultAddress: () => {
        const { addresses } = get();
        return addresses.find(addr => addr.isDefault) || addresses[0] || null;
      },
    }),
    {
      name: 'laundry-address-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);