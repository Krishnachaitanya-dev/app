import { supabase, handleSupabaseError } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, services: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const getTimeSlots = async () => {
  try {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, timeSlots: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const createOrder = async (orderData: any) => {
  try {
    // Generate a UUID for the order
    const orderId = uuidv4();
    
    // Create the order
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: orderData.userId,
        status: 'pending',
        total_amount: orderData.totalAmount,
        special_instructions: orderData.specialInstructions || null,
      });
    
    if (orderError) {
      return { success: false, error: handleSupabaseError(orderError) };
    }
    
    // Create order details
    const { error: detailsError } = await supabase
      .from('order_details')
      .insert({
        order_id: orderId,
        pickup_address_id: orderData.pickupAddressId,
        pickup_date: orderData.pickupDate,
        pickup_time_slot: orderData.pickupTimeSlot,
        delivery_address_id: orderData.deliveryAddressId,
        delivery_date: orderData.deliveryDate,
        delivery_time_slot: orderData.deliveryTimeSlot,
        payment_method_id: orderData.paymentMethodId,
        payment_status: 'pending',
      });
    
    if (detailsError) {
      return { success: false, error: handleSupabaseError(detailsError) };
    }
    
    // Create order services
    const orderServices = orderData.services.map((service: any) => ({
      order_id: orderId,
      service_id: service.id,
      quantity: service.quantity,
      price: service.price,
    }));
    
    const { error: servicesError } = await supabase
      .from('order_services')
      .insert(orderServices);
    
    if (servicesError) {
      return { success: false, error: handleSupabaseError(servicesError) };
    }
    
    // Create notification for the user
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: orderData.userId,
        title: 'Order Placed',
        message: `Your order #${orderId.substring(0, 8)} has been placed successfully.`,
        type: 'order',
        related_id: orderId,
        related_type: 'order',
      });
    
    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Continue even if notification creation fails
    }
    
    return { success: true, orderId };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_details(*),
        order_services(
          *,
          service:services(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, orders: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_details(
          *,
          pickup_address:addresses!pickup_address_id(*),
          delivery_address:addresses!delivery_address_id(*),
          payment_method:payment_methods(*)
        ),
        order_services(
          *,
          service:services(*)
        )
      `)
      .eq('id', orderId)
      .single();
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, order: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const cancelOrder = async (orderId: string, userId: string) => {
  try {
    // Check if the order belongs to the user
    const { data: orderData, error: orderCheckError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();
    
    if (orderCheckError) {
      return { success: false, error: handleSupabaseError(orderCheckError) };
    }
    
    if (!orderData) {
      return { success: false, error: 'Order not found or does not belong to the user' };
    }
    
    // Check if the order can be cancelled (only pending or confirmed orders can be cancelled)
    if (orderData.status !== 'pending' && orderData.status !== 'confirmed') {
      return { success: false, error: 'This order cannot be cancelled at its current status' };
    }
    
    // Update the order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);
    
    if (updateError) {
      return { success: false, error: handleSupabaseError(updateError) };
    }
    
    // Create notification for the user
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Order Cancelled',
        message: `Your order #${orderId.substring(0, 8)} has been cancelled.`,
        type: 'order',
        related_id: orderId,
        related_type: 'order',
      });
    
    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Continue even if notification creation fails
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};