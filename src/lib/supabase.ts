import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'user' | 'admin';
          avatar_url: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'user' | 'admin';
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'user' | 'admin';
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          category_id: string | null;
          image_url: string | null;
          stock_quantity: number;
          status: 'pending' | 'approved' | 'rejected';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          category_id?: string | null;
          image_url?: string | null;
          stock_quantity?: number;
          status?: 'pending' | 'approved' | 'rejected';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          category_id?: string | null;
          image_url?: string | null;
          stock_quantity?: number;
          status?: 'pending' | 'approved' | 'rejected';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total_amount: number;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          shipping_address: string;
          shipping_city: string;
          shipping_postal_code: string;
          shipping_country: string;
          payment_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_amount: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          shipping_address: string;
          shipping_city: string;
          shipping_postal_code: string;
          shipping_country: string;
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_amount?: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          shipping_address?: string;
          shipping_city?: string;
          shipping_postal_code?: string;
          shipping_country?: string;
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
        };
      };
      shipments: {
        Row: {
          id: string;
          order_id: string;
          tracking_number: string;
          carrier: string;
          status: 'preparing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';
          shipped_at: string | null;
          estimated_delivery: string | null;
          delivered_at: string | null;
          current_location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          tracking_number: string;
          carrier?: string;
          status?: 'preparing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';
          shipped_at?: string | null;
          estimated_delivery?: string | null;
          delivered_at?: string | null;
          current_location?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          tracking_number?: string;
          carrier?: string;
          status?: 'preparing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';
          shipped_at?: string | null;
          estimated_delivery?: string | null;
          delivered_at?: string | null;
          current_location?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};