export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          street: string
          city: string
          state: string
          zip_code: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          street: string
          city: string
          state: string
          zip_code: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          street?: string
          city?: string
          state?: string
          zip_code?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          created_at: string
          related_id?: string
          related_type?: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          read?: boolean
          created_at?: string
          related_id?: string
          related_type?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          created_at?: string
          related_id?: string
          related_type?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total_amount: number
          special_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          total_amount: number
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total_amount?: number
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_services: {
        Row: {
          id: string
          order_id: string
          service_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          service_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          service_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      order_details: {
        Row: {
          id: string
          order_id: string
          pickup_address_id: string
          pickup_date: string
          pickup_time_slot: string
          delivery_address_id: string
          delivery_date: string
          delivery_time_slot: string
          payment_method_id: string
          payment_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          pickup_address_id: string
          pickup_date: string
          pickup_time_slot: string
          delivery_address_id: string
          delivery_date: string
          delivery_time_slot: string
          payment_method_id: string
          payment_status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          pickup_address_id?: string
          pickup_date?: string
          pickup_time_slot?: string
          delivery_address_id?: string
          delivery_date?: string
          delivery_time_slot?: string
          payment_method_id?: string
          payment_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          type: string
          card_last_four: string | null
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          card_last_four?: string | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          card_last_four?: string | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone: string
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image_url: string | null
          category: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image_url?: string | null
          category: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image_url?: string | null
          category?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      time_slots: {
        Row: {
          id: string
          start_time: string
          end_time: string
          is_active: boolean
        }
        Insert: {
          id?: string
          start_time: string
          end_time: string
          is_active?: boolean
        }
        Update: {
          id?: string
          start_time?: string
          end_time?: string
          is_active?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Add User type based on the users table
export type User = Database['public']['Tables']['users']['Row'];

// Add UserCredentials type for authentication
export interface UserCredentials {
  email: string;
  password: string;
}