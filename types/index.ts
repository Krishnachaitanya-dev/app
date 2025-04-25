export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  pricePerUnit: number;
  unit: string;
  estimatedTime: number;
}

export interface Order {
  id: string;
  userId: string;
  services: OrderService[];
  status: OrderStatus;
  pickupDetails: {
    date: string;
    timeSlot: string;
    address: Address;
    actualPickupTime?: string;
  };
  deliveryDetails: {
    date: string;
    timeSlot: string;
    address: Address;
    actualDeliveryTime?: string;
  };
  paymentDetails: {
    method: PaymentMethod;
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
  };
  specialInstructions?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderService {
  serviceId: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  category?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'processing'
  | 'ready_for_delivery'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Address {
  id: string;
  name: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardLastFour?: string;
  cardBrand?: string;
  last4?: string;
  expiryDate?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: Address[];
  paymentMethods: PaymentMethod[];
  preferences?: {
    detergentType?: string;
    fabricSoftener?: boolean;
    waterTemperature?: string;
    dryingPreference?: string;
    ironingPreference?: string;
    foldingPreference?: string;
    notifications?: boolean;
  };
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
  read: boolean;
  data?: {
    orderId?: string;
    [key: string]: any;
  };
  createdAt: string;
  relatedId?: string;
  relatedType?: string;
}

export interface SupportMessage {
  id: string;
  userId: string;
  agentId?: string;
  message: string;
  timestamp: string;
  isUser: boolean;
}