import { User } from '@/types';

export const user: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: [
    {
      id: 'addr-1',
      label: 'Home',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      street: '456 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 'pm-1',
      type: 'card',
      last4: '4242',
      expiryDate: '04/25',
      isDefault: true,
    },
    {
      id: 'pm-2',
      type: 'paypal',
      isDefault: false,
    },
  ],
  preferences: {
    detergentType: 'regular',
    fabricSoftener: true,
    waterTemperature: 'cold',
    dryingPreference: 'tumble-dry',
    ironingPreference: 'yes',
    foldingPreference: 'standard',
    notifications: true,
  },
};