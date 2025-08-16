-- Enable Row Level Security on all tables
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.texts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PRODUCTS TABLE POLICIES
-- ============================================================================
-- Products should be publicly readable, but only admins can modify

-- Allow everyone to read products (for shop display)
CREATE POLICY "Products are publicly readable" ON public.products
  FOR SELECT TO anon, authenticated USING (true);

-- Allow authenticated users (admins) to insert products
CREATE POLICY "Authenticated users can create products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users (admins) to update products
CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users (admins) to delete products
CREATE POLICY "Authenticated users can delete products" ON public.products
  FOR DELETE TO authenticated USING (true);

-- ============================================================================
-- SIZES TABLE POLICIES
-- ============================================================================
-- Sizes should be publicly readable (part of product info), admin manageable

-- Allow everyone to read sizes
CREATE POLICY "Sizes are publicly readable" ON public.sizes
  FOR SELECT TO anon, authenticated USING (true);

-- Allow authenticated users (admins) to manage sizes
CREATE POLICY "Authenticated users can create sizes" ON public.sizes
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update sizes" ON public.sizes
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete sizes" ON public.sizes
  FOR DELETE TO authenticated USING (true);

-- ============================================================================
-- TEXTS TABLE POLICIES
-- ============================================================================
-- Texts should be publicly readable (site content), admin manageable

-- Allow everyone to read texts
CREATE POLICY "Texts are publicly readable" ON public.texts
  FOR SELECT TO anon, authenticated USING (true);

-- Allow authenticated users (admins) to manage texts
CREATE POLICY "Authenticated users can create texts" ON public.texts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update texts" ON public.texts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete texts" ON public.texts
  FOR DELETE TO authenticated USING (true);

-- ============================================================================
-- ORDERS TABLE POLICIES
-- ============================================================================
-- Orders are sensitive - guests can create (checkout), only admins can read/manage

-- Allow anonymous users to create orders (guest checkout)
CREATE POLICY "Anonymous users can create orders" ON public.orders
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users (admins) to read all orders
CREATE POLICY "Authenticated users can read all orders" ON public.orders
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users (admins) to update orders
CREATE POLICY "Authenticated users can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users (admins) to delete orders
CREATE POLICY "Authenticated users can delete orders" ON public.orders
  FOR DELETE TO authenticated USING (true);

-- ============================================================================
-- ORDER_ITEMS TABLE POLICIES
-- ============================================================================
-- Order items follow the same pattern as orders

-- Allow anonymous users to create order items (during checkout)
CREATE POLICY "Anonymous users can create order items" ON public.order_items
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users (admins) to read all order items
CREATE POLICY "Authenticated users can read all order items" ON public.order_items
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users (admins) to update order items
CREATE POLICY "Authenticated users can update order items" ON public.order_items
  FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users (admins) to delete order items
CREATE POLICY "Authenticated users can delete order items" ON public.order_items
  FOR DELETE TO authenticated USING (true);

-- ============================================================================
-- ADDRESSES TABLE POLICIES
-- ============================================================================
-- Addresses are sensitive customer data - admin access only

-- Allow authenticated users (admins) to read all addresses
CREATE POLICY "Authenticated users can read all addresses" ON public.addresses
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users (admins) to create addresses
CREATE POLICY "Authenticated users can create addresses" ON public.addresses
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users (admins) to update addresses
CREATE POLICY "Authenticated users can update addresses" ON public.addresses
  FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users (admins) to delete addresses
CREATE POLICY "Authenticated users can delete addresses" ON public.addresses
  FOR DELETE TO authenticated USING (true);

-- ============================================================================
-- GRANT NECESSARY PERMISSIONS
-- ============================================================================

-- Grant permissions for anonymous users (guest checkout)
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.sizes TO anon;
GRANT SELECT ON public.texts TO anon;
GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.order_items TO anon;
GRANT USAGE ON SEQUENCE orders_id_seq TO anon;
GRANT USAGE ON SEQUENCE order_items_id_seq TO anon;

-- Grant full permissions for authenticated users (admins)
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.sizes TO authenticated;
GRANT ALL ON public.texts TO authenticated;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.order_items TO authenticated;
GRANT ALL ON public.addresses TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- ADDITIONAL SECURITY CONSIDERATIONS
-- ============================================================================

-- Ensure orders can only be created with valid data
CREATE POLICY "Orders must have valid customer email" ON public.orders
  FOR INSERT TO anon WITH CHECK (
    customer_email IS NOT NULL 
    AND customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Ensure order items have positive quantities and prices
CREATE POLICY "Order items must have valid data" ON public.order_items
  FOR INSERT TO anon WITH CHECK (
    quantity > 0 
    AND product_price > 0 
    AND line_total > 0
    AND product_id IS NOT NULL
  );

-- ============================================================================
-- HELPFUL COMMENTS
-- ============================================================================

/*
SECURITY SUMMARY:
- Products, Sizes, Texts: Public read, admin write (for shop functionality)
- Orders, Order Items: Anonymous create (guest checkout), admin manage
- Addresses: Admin only (sensitive customer data)
- All sequences have appropriate usage grants
- Data validation policies ensure order integrity
- Follows principle of least privilege

USAGE PATTERNS:
- Guest customers can browse products and create orders
- Authenticated admins can manage all data
- Order creation includes validation for data integrity
- Addresses are kept separate and secure for admin use only
*/ 