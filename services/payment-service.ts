import { supabase, handleSupabaseError } from './supabase';

export const getUserPaymentMethods = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, paymentMethods: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const getPaymentMethodById = async (paymentMethodId: string) => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .single();
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, paymentMethod: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const createPaymentMethod = async (userId: string, paymentData: any) => {
  try {
    // If this is the first payment method or marked as default, unset any existing default
    if (paymentData.is_default) {
      await unsetDefaultPaymentMethods(userId);
    }
    
    // If this is the first payment method, make it default regardless
    if (paymentData.is_first) {
      paymentData.is_default = true;
      delete paymentData.is_first;
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        type: paymentData.type,
        card_last_four: paymentData.card_last_four || null,
        card_brand: paymentData.card_brand || null,
        card_exp_month: paymentData.card_exp_month || null,
        card_exp_year: paymentData.card_exp_year || null,
        is_default: paymentData.is_default || false,
      })
      .select()
      .single();
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, paymentMethod: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const updatePaymentMethod = async (paymentMethodId: string, userId: string, paymentData: any) => {
  try {
    // If being set as default, unset any existing default
    if (paymentData.is_default) {
      await unsetDefaultPaymentMethods(userId);
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .update({
        type: paymentData.type,
        card_last_four: paymentData.card_last_four || null,
        card_brand: paymentData.card_brand || null,
        card_exp_month: paymentData.card_exp_month || null,
        card_exp_year: paymentData.card_exp_year || null,
        is_default: paymentData.is_default,
      })
      .eq('id', paymentMethodId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, paymentMethod: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const deletePaymentMethod = async (paymentMethodId: string, userId: string) => {
  try {
    // Check if this is the default payment method
    const { data: paymentData, error: checkError } = await supabase
      .from('payment_methods')
      .select('is_default')
      .eq('id', paymentMethodId)
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      return { success: false, error: handleSupabaseError(checkError) };
    }
    
    // Delete the payment method
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    // If this was the default payment method, set a new default if any payment methods remain
    if (paymentData.is_default) {
      await setNewDefaultPaymentMethod(userId);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const setPaymentMethodAsDefault = async (paymentMethodId: string, userId: string) => {
  try {
    // Unset any existing default payment methods
    await unsetDefaultPaymentMethods(userId);
    
    // Set the new default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .eq('user_id', userId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

// Helper function to unset all default payment methods
const unsetDefaultPaymentMethods = async (userId: string) => {
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', userId)
    .eq('is_default', true);
  
  if (error) {
    console.error('Error unsetting default payment methods:', error);
  }
};

// Helper function to set a new default payment method if needed
const setNewDefaultPaymentMethod = async (userId: string) => {
  // Get all payment methods for the user
  const { data, error } = await supabase
    .from('payment_methods')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error || !data || data.length === 0) {
    return;
  }
  
  // Set the first one as default
  const { error: updateError } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', data[0].id);
  
  if (updateError) {
    console.error('Error setting new default payment method:', updateError);
  }
};