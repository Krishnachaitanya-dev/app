import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '@/types';
import theme from '@/constants/theme';
import { ChevronRight, Package } from 'lucide-react-native';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'confirmed':
        return theme.colors.primary;
      case 'picked_up':
        return theme.colors.primary;
      case 'processing':
        return theme.colors.secondary;
      case 'ready_for_delivery':
        return theme.colors.secondary;
      case 'out_for_delivery':
        return theme.colors.secondary;
      case 'delivered':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textLight;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusText = (status: Order['status']) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(order)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.idContainer}>
          <Package size={16} color={theme.colors.primary} />
          <Text style={styles.orderId}>{order.id}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Services:</Text>
          <Text style={styles.infoValue}>
            {order.services.map(s => s.serviceName).join(', ')}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Items:</Text>
          <Text style={styles.infoValue}>
            {order.services.reduce((total, service) => total + service.quantity, 0)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>${order.totalAmount.toFixed(2)}</Text>
        <ChevronRight size={20} color={theme.colors.textLight} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  orderId: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statusContainer: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.s,
  },
  statusText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '600',
  },
  content: {
    marginBottom: theme.spacing.m,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  infoLabel: {
    width: 80,
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: theme.fontSizes.s,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.m,
  },
  totalLabel: {
    fontSize: theme.fontSizes.m,
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  totalValue: {
    flex: 1,
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.primary,
    marginLeft: theme.spacing.s,
  },
});

export default OrderCard;