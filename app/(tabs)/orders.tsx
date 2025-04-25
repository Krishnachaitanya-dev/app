import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import theme from '@/constants/theme';
import { useOrderStore } from '@/store/order-store';
import OrderCard from '@/components/OrderCard';
import Button from '@/components/Button';
import { Plus, Package } from 'lucide-react-native';

export default function OrdersScreen() {
  const { orders, fetchOrders, isLoading } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const activeOrders = orders.filter(order => 
    order.status !== 'delivered' && order.status !== 'cancelled'
  );
  
  const completedOrders = orders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  );
  
  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;
  
  const handleOrderPress = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };
  
  const handleNewOrder = () => {
    router.push('/order/new');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'active' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.activeTabText,
            ]}
          >
            Active ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'completed' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' && styles.activeTabText,
            ]}
          >
            Completed ({completedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : displayOrders.length > 0 ? (
        <FlatList
          data={displayOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => handleOrderPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Package size={60} color={theme.colors.textLight} />
          <Text style={styles.emptyTitle}>
            No {activeTab} orders
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'active'
              ? "You don't have any active orders at the moment"
              : "You haven't completed any orders yet"}
          </Text>
          {activeTab === 'active' && (
            <Button
              title="Place New Order"
              onPress={handleNewOrder}
              variant="outline"
              style={styles.newOrderButton}
              rightIcon={<Plus size={20} color={theme.colors.primary} />}
            />
          )}
        </View>
      )}
      
      {activeTab === 'active' && displayOrders.length > 0 && (
        <View style={styles.floatingButtonContainer}>
          <Button
            title="Place New Order"
            onPress={handleNewOrder}
            fullWidth
            rightIcon={<Plus size={20} color={theme.colors.white} />}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.s,
    alignItems: 'center',
    borderRadius: theme.borderRadius.m,
  },
  activeTab: {
    backgroundColor: theme.colors.primary + '20',
  },
  tabText: {
    fontSize: theme.fontSizes.m,
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: theme.spacing.l,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  emptySubtitle: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  newOrderButton: {
    marginTop: theme.spacing.m,
  },
  floatingButtonContainer: {
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