import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'user' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'user' | 'admin';
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'user' | 'admin';
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          stock: number;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          created_by: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          stock: number;
          status?: 'pending' | 'approved' | 'rejected';
          created_by: string;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          category?: string;
          stock?: number;
          status?: 'pending' | 'approved' | 'rejected';
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total_amount: number;
          status: 'pending' | 'processing' | 'shipped' | 'delivered';
          shipping_address: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          total_amount: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered';
          shipping_address: string;
        };
        Update: {
          status?: 'pending' | 'processing' | 'shipped' | 'delivered';
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
        };
        Insert: {
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
        };
        Update: {
          quantity?: number;
          price?: number;
        };
      };
    };
  };
};