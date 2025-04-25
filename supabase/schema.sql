-- Create tables for the laundry app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'card', 'upi', 'cash', etc.
  card_last_four TEXT,
  card_brand TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL, -- 'wash', 'dry-clean', 'iron', etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time slots table
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_time TEXT NOT NULL, -- '09:00 AM'
  end_time TEXT NOT NULL, -- '11:00 AM'
  is_active BOOLEAN DEFAULT TRUE
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'picked-up', 'processing', 'out-for-delivery', 'delivered', 'cancelled'
  total_amount DECIMAL(10, 2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order services table (many-to-many relationship between orders and services)
CREATE TABLE order_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order details table
CREATE TABLE order_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  pickup_address_id UUID REFERENCES addresses(id) ON DELETE RESTRICT,
  pickup_date TEXT NOT NULL, -- '2023-06-15'
  pickup_time_slot TEXT NOT NULL, -- '09:00 AM - 11:00 AM'
  delivery_address_id UUID REFERENCES addresses(id) ON DELETE RESTRICT,
  delivery_date TEXT NOT NULL, -- '2023-06-17'
  delivery_time_slot TEXT NOT NULL, -- '09:00 AM - 11:00 AM'
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE RESTRICT,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'order', 'promotion', 'system', etc.
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  related_id UUID, -- Can be order_id or any other related entity
  related_type TEXT -- 'order', 'payment', etc.
);

-- Create RLS policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Addresses policies
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Payment methods policies
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment methods"
  ON payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- Services policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = TRUE);

-- Time slots policies
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active time slots"
  ON time_slots FOR SELECT
  USING (is_active = TRUE);

-- Orders policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Order services policies
ALTER TABLE order_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order services"
  ON order_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_services.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order services"
  ON order_services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_services.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Order details policies
ALTER TABLE order_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order details"
  ON order_details FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_details.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order details"
  ON order_details FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_details.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own order details"
  ON order_details FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_details.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Notifications policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Insert sample data

-- Sample services
INSERT INTO services (id, name, description, price, category, image_url) VALUES
  (uuid_generate_v4(), 'Wash & Fold', 'Regular clothes washing and folding service', 80.00, 'wash', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'),
  (uuid_generate_v4(), 'Dry Cleaning', 'Professional dry cleaning for delicate fabrics', 150.00, 'dry-clean', 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'),
  (uuid_generate_v4(), 'Ironing', 'Professional ironing service', 60.00, 'iron', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'),
  (uuid_generate_v4(), 'Bedding & Linen', 'Washing and ironing for bed sheets, pillow covers, etc.', 120.00, 'wash', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'),
  (uuid_generate_v4(), 'Suit Cleaning', 'Specialized cleaning for suits and formal wear', 200.00, 'dry-clean', 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'),
  (uuid_generate_v4(), 'Saree & Ethnic Wear', 'Specialized cleaning for sarees and ethnic wear', 180.00, 'dry-clean', 'https://images.unsplash.com/photo-1610189844804-cda35a20c404?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'),
  (uuid_generate_v4(), 'Curtains & Drapes', 'Cleaning service for curtains and drapes', 150.00, 'wash', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3'),
  (uuid_generate_v4(), 'Express Service', 'Same day turnaround for urgent items', 150.00, 'premium', 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3');

-- Sample time slots
INSERT INTO time_slots (id, start_time, end_time) VALUES
  (uuid_generate_v4(), '09:00 AM', '11:00 AM'),
  (uuid_generate_v4(), '11:00 AM', '01:00 PM'),
  (uuid_generate_v4(), '01:00 PM', '03:00 PM'),
  (uuid_generate_v4(), '03:00 PM', '05:00 PM'),
  (uuid_generate_v4(), '05:00 PM', '07:00 PM');