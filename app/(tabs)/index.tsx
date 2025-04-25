import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import theme from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { useNotificationStore } from '@/store/notification-store';
import { services } from '@/mocks/services';
import { Bell, Plus, ArrowRight, Shirt, Zap, Droplets, Bed, Clock, MapPin, Calendar } from 'lucide-react-native';
import Button from '@/components/Button';
import ServiceCard from '@/components/ServiceCard';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { orders, fetchOrders } = useOrderStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  
  useEffect(() => {
    fetchOrders();
    fetchNotifications();
  }, []);
  
  const activeOrders = orders.filter(order => 
    order.status !== 'delivered' && order.status !== 'cancelled'
  );
  
  const getServiceIcon = (iconName: string) => {
    const iconProps = {
      size: 24,
      color: theme.colors.white,
      strokeWidth: 2,
    };

    switch (iconName) {
      case 'shirt':
        return <Shirt {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'droplets':
        return <Droplets {...iconProps} />;
      case 'bed':
        return <Bed {...iconProps} />;
      default:
        return <Shirt {...iconProps} />;
    }
  };
  
  const handleNewOrder = () => {
    router.push('/order/new');
  };
  
  const handleViewAllOrders = () => {
    router.push('/orders');
  };
  
  const handleViewOrder = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };
  
  const handleViewNotifications = () => {
    router.push('/notifications');
  };
  
  const handleServicePress = (serviceId: string) => {
    router.push({
      pathname: '/order/new',
      params: { serviceId },
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name.split(' ')[0]}</Text>
          <Text style={styles.subGreeting}>What would you like to clean today?</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleViewNotifications}
        >
          <Bell size={24} color={theme.colors.text} />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2671&auto=format&fit=crop' }}
            style={styles.bannerImage}
            resizeMode="cover"
            borderRadius={theme.borderRadius.l}
          >
            <LinearGradient
              colors={['rgba(15, 76, 129, 0.8)', 'rgba(15, 76, 129, 0.6)']}
              style={styles.bannerOverlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>ADVANCE WASH</Text>
                <Text style={styles.bannerSubtitle}>Professional Laundry Service</Text>
                <Button 
                  title="Book Now" 
                  onPress={handleNewOrder}
                  size="small"
                  variant="secondary"
                  rightIcon={<ArrowRight size={16} color={theme.colors.white} />}
                />
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
        
        <View style={styles.servicesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
          </View>
          
          <View style={styles.serviceGrid}>
            {services.slice(0, 4).map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceItem}
                onPress={() => handleServicePress(service.id)}
              >
                <View style={styles.serviceIconContainer}>
                  {getServiceIcon(service.icon)}
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={handleNewOrder}
          >
            <Text style={styles.viewAllText}>View All Services</Text>
            <ArrowRight size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.activeOrdersContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            {activeOrders.length > 0 && (
              <TouchableOpacity onPress={handleViewAllOrders}>
                <Text style={styles.viewAllLink}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {activeOrders.length > 0 ? (
            activeOrders.slice(0, 2).map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.activeOrderItem}
                onPress={() => handleViewOrder(order.id)}
              >
                <View style={styles.activeOrderInfo}>
                  <Text style={styles.activeOrderId}>{order.id}</Text>
                  <View style={[
                    styles.activeOrderStatus,
                    { backgroundColor: getStatusColor(order.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.activeOrderStatusText,
                      { color: getStatusColor(order.status) }
                    ]}>
                      {getStatusText(order.status)}
                    </Text>
                  </View>
                </View>
                <View style={styles.activeOrderDetails}>
                  <View style={styles.orderDetailRow}>
                    <Calendar size={14} color={theme.colors.textLight} />
                    <Text style={styles.activeOrderDate}>
                      {new Date(order.pickupDetails.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.orderDetailRow}>
                    <Clock size={14} color={theme.colors.textLight} />
                    <Text style={styles.activeOrderDate}>
                      {order.pickupDetails.timeSlot}
                    </Text>
                  </View>
                </View>
                <ArrowRight size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noOrdersContainer}>
              <Text style={styles.noOrdersText}>You don't have any active orders</Text>
              <Button 
                title="Place New Order" 
                onPress={handleNewOrder}
                variant="outline"
                rightIcon={<Plus size={20} color={theme.colors.primary} />}
              />
            </View>
          )}
        </View>
        
        <View style={styles.howItWorksContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>How It Works</Text>
          </View>
          
          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>Schedule Pickup</Text>
              <Text style={styles.stepDescription}>
                Choose a convenient time for us to collect your laundry
              </Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Professional Cleaning</Text>
              <Text style={styles.stepDescription}>
                We clean your items with care using premium products
              </Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Fast Delivery</Text>
              <Text style={styles.stepDescription}>
                Get your fresh, clean clothes delivered back to you
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.whyChooseUsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Why Choose AdvanceWash</Text>
          </View>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Zap size={20} color={theme.colors.white} />
              </View>
              <Text style={styles.featureTitle}>Fast Service</Text>
              <Text style={styles.featureDescription}>
                Quick turnaround times to fit your busy schedule
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Droplets size={20} color={theme.colors.white} />
              </View>
              <Text style={styles.featureTitle}>Eco-Friendly</Text>
              <Text style={styles.featureDescription}>
                Environmentally conscious cleaning products and methods
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <MapPin size={20} color={theme.colors.white} />
              </View>
              <Text style={styles.featureTitle}>Free Delivery</Text>
              <Text style={styles.featureDescription}>
                Complimentary pickup and delivery for your convenience
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.floatingButtonContainer}>
        <Button
          title="Book Laundry Service"
          onPress={handleNewOrder}
          fullWidth
          rightIcon={<Plus size={20} color={theme.colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
  
  function getStatusColor(status: string) {
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
  }
  
  function getStatusText(status: string) {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  greeting: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subGreeting: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bannerContainer: {
    margin: theme.spacing.l,
    height: 180,
    borderRadius: theme.borderRadius.l,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: theme.spacing.l,
  },
  bannerContent: {
    maxWidth: '70%',
  },
  bannerTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  bannerSubtitle: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.white,
    marginBottom: theme.spacing.m,
  },
  servicesContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    margin: theme.spacing.l,
    marginTop: 0,
    ...theme.shadows.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.text,
  },
  viewAllLink: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  serviceName: {
    fontSize: theme.fontSizes.s,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
  },
  viewAllText: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
  activeOrdersContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    margin: theme.spacing.l,
    marginTop: 0,
    ...theme.shadows.small,
  },
  activeOrderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activeOrderInfo: {
    width: 100,
  },
  activeOrderId: {
    fontSize: theme.fontSizes.s,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  activeOrderStatus: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.s,
    alignSelf: 'flex-start',
  },
  activeOrderStatusText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '500',
  },
  activeOrderDetails: {
    flex: 1,
    marginLeft: theme.spacing.m,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  activeOrderService: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  activeOrderDate: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
  },
  noOrdersContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.l,
  },
  noOrdersText: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.m,
  },
  howItWorksContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    margin: theme.spacing.l,
    marginTop: 0,
    ...theme.shadows.small,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  stepNumberText: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.white,
  },
  stepTitle: {
    fontSize: theme.fontSizes.s,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  stepDescription: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  whyChooseUsContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    margin: theme.spacing.l,
    marginTop: 0,
    ...theme.shadows.small,
  },
  featuresContainer: {
    flexDirection: 'column',
    gap: theme.spacing.m,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  featureDescription: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    flex: 2,
    lineHeight: 20,
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
    ...theme.shadows.medium,
  },
});