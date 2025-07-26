/*
  # Ecommerce Platform Database Schema

  1. New Tables
    - `profiles` - User profiles with role management
    - `products` - Product catalog with approval system
    - `categories` - Product categories
    - `cart_items` - Shopping cart functionality
    - `orders` - Order management
    - `order_items` - Individual order items
    - `shipments` - Order tracking and shipment status

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure admin-only operations

  3. Functions
    - Auto-create profile on user registration
    - Order processing and inventory management
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE product_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE shipment_status AS ENUM ('preparing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role user_role DEFAULT 'user',
  avatar_url text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id),
  image_url text,
  stock_quantity integer DEFAULT 0,
  status product_status DEFAULT 'pending',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_postal_code text NOT NULL,
  shipping_country text NOT NULL,
  payment_method text DEFAULT 'card',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_price decimal(10,2) NOT NULL,
  quantity integer NOT NULL,
  subtotal decimal(10,2) NOT NULL
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number text UNIQUE NOT NULL,
  carrier text DEFAULT 'DHL Express',
  status shipment_status DEFAULT 'preparing',
  shipped_at timestamptz,
  estimated_delivery timestamptz,
  delivered_at timestamptz,
  current_location text DEFAULT 'Warehouse - Processing Center',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories policies
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products policies
CREATE POLICY "Anyone can read approved products"
  ON products FOR SELECT
  TO authenticated
  USING (status = 'approved' OR created_by = auth.uid());

CREATE POLICY "Admins can read all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cart policies
CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Order items policies
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Shipments policies
CREATE POLICY "Users can read own shipments"
  ON shipments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = shipments.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all shipments"
  ON shipments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Electronics', 'Latest gadgets and electronic devices', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'),
('Clothing', 'Fashion and style for everyone', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'),
('Home & Garden', 'Everything for your home and garden', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'),
('Sports', 'Sports equipment and accessories', 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, status) VALUES
('Wireless Headphones', 'Premium quality wireless headphones with noise cancellation', 299.99, (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1), 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 50, 'approved'),
('Smart Watch', 'Feature-rich smartwatch with health monitoring', 199.99, (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1), 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg', 30, 'approved'),
('Designer T-Shirt', 'Comfortable cotton t-shirt with modern design', 39.99, (SELECT id FROM categories WHERE name = 'Clothing' LIMIT 1), 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', 100, 'approved'),
('Running Shoes', 'Professional running shoes for athletes', 129.99, (SELECT id FROM categories WHERE name = 'Sports' LIMIT 1), 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 75, 'approved'),
('Coffee Maker', 'Automatic coffee maker for perfect coffee', 89.99, (SELECT id FROM categories WHERE name = 'Home & Garden' LIMIT 1), 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg', 25, 'approved');