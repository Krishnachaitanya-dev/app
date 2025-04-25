import { supabase, handleSupabaseError } from './supabase';

export const getUserAddresses = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, addresses: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const getAddressById = async (addressId: string) => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', addressId)
      .single();
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, address: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const createAddress = async (userId: string, addressData: any) => {
  try {
    // If this is the first address or marked as default, unset any existing default
    if (addressData.is_default) {
      await unsetDefaultAddresses(userId);
    }
    
    // If this is the first address, make it default regardless
    if (addressData.is_first) {
      addressData.is_default = true;
      delete addressData.is_first;
    }
    
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        name: addressData.name,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zip_code: addressData.zip_code,
        is_default: addressData.is_default || false,
      })
      .select()
      .single();
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, address: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const updateAddress = async (addressId: string, userId: string, addressData: any) => {
  try {
    // If being set as default, unset any existing default
    if (addressData.is_default) {
      await unsetDefaultAddresses(userId);
    }
    
    const { data, error } = await supabase
      .from('addresses')
      .update({
        name: addressData.name,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zip_code: addressData.zip_code,
        is_default: addressData.is_default,
      })
      .eq('id', addressId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, address: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const deleteAddress = async (addressId: string, userId: string) => {
  try {
    // Check if this is the default address
    const { data: addressData, error: checkError } = await supabase
      .from('addresses')
      .select('is_default')
      .eq('id', addressId)
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      return { success: false, error: handleSupabaseError(checkError) };
    }
    
    // Delete the address
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    // If this was the default address, set a new default if any addresses remain
    if (addressData.is_default) {
      await setNewDefaultAddress(userId);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const setAddressAsDefault = async (addressId: string, userId: string) => {
  try {
    // Unset any existing default addresses
    await unsetDefaultAddresses(userId);
    
    // Set the new default
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

// Helper function to unset all default addresses
const unsetDefaultAddresses = async (userId: string) => {
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', userId)
    .eq('is_default', true);
  
  if (error) {
    console.error('Error unsetting default addresses:', error);
  }
};

// Helper function to set a new default address if needed
const setNewDefaultAddress = async (userId: string) => {
  // Get all addresses for the user
  const { data, error } = await supabase
    .from('addresses')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error || !data || data.length === 0) {
    return;
  }
  
  // Set the first one as default
  const { error: updateError } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', data[0].id);
  
  if (updateError) {
    console.error('Error setting new default address:', updateError);
  }
};