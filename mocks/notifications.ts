import { Notification } from '@/types';

export const notifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Order Confirmed',
    message: 'Your order #ORD-2023-001 has been confirmed. We will pick up your laundry on the scheduled date.',
    type: 'order',
    read: false,
    orderId: 'ORD-2023-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Special Offer',
    message: 'Get 20% off on all dry cleaning services this weekend! Use code WEEKEND20 at checkout.',
    type: 'promotion',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Order Picked Up',
    message: 'Your laundry has been picked up and is on its way to our facility for processing.',
    type: 'order',
    read: true,
    orderId: 'ORD-2023-002',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Order Ready for Delivery',
    message: 'Your order #ORD-2023-002 is ready and scheduled for delivery tomorrow.',
    type: 'order',
    read: true,
    orderId: 'ORD-2023-002',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
  },
  {
    id: '5',
    userId: 'user1',
    title: 'App Update Available',
    message: 'A new version of the app is available with improved features and bug fixes.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: '6',
    userId: 'user1',
    title: 'Holiday Schedule',
    message: 'Please note that we will have limited service during the upcoming holiday weekend.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    id: '7',
    userId: 'user1',
    title: 'Loyalty Reward',
    message: 'Congratulations! You\'ve earned a free wash & fold service after your 10th order.',
    type: 'promotion',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
  },
];