-- ============================================================================
-- SECURE ORDER CREATION POLICIES
-- ============================================================================

-- First, remove the insecure anonymous insert policy
DROP POLICY IF EXISTS "Anonymous users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anonymous users can create order items" ON public.order_items;

-- ============================================================================
-- OPTION 1: API-ONLY ORDER CREATION (RECOMMENDED)
-- ============================================================================
-- Orders can only be created through your API endpoints, not direct DB access
-- Your API uses service role which bypasses RLS, ensuring proper validation

-- Remove anonymous insert permissions entirely
REVOKE INSERT ON public.orders FROM anon;
REVOKE INSERT ON public.order_items FROM anon;

-- Only authenticated users (admins) and service role can create orders
CREATE POLICY "Only authenticated users can create orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only authenticated users can create order items" ON public.order_items
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================================
-- OPTION 2: STRIPE-VALIDATED ORDER CREATION (ALTERNATIVE)
-- ============================================================================
-- If you prefer to allow anonymous creation but with strict validation:

/*
-- Uncomment this section if you want to allow anonymous creation with validation

-- Allow anonymous order creation only with valid Stripe session
CREATE POLICY "Anonymous users can create orders with Stripe session" ON public.orders
  FOR INSERT TO anon WITH CHECK (
    stripe_session_id IS NOT NULL 
    AND stripe_session_id LIKE 'cs_%'  -- Stripe checkout session format
    AND order_status = 'pending'
    AND customer_email IS NOT NULL 
    AND customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Allow anonymous order items creation only for valid orders
CREATE POLICY "Anonymous users can create order items for valid orders" ON public.order_items
  FOR INSERT TO anon WITH CHECK (
    quantity > 0 
    AND product_price > 0 
    AND line_total > 0
    AND product_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.stripe_session_id IS NOT NULL
    )
  );

-- Re-grant insert permissions if using Option 2
GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.order_items TO anon;
*/

-- ============================================================================
-- ADDITIONAL SECURITY MEASURES
-- ============================================================================

-- Ensure only your application can update orders (prevent tampering)
CREATE POLICY "Orders can only be updated by authenticated users" ON public.orders
  FOR UPDATE TO authenticated USING (true);

-- Prevent unauthorized order status changes
CREATE POLICY "Order status changes require authentication" ON public.orders
  FOR UPDATE TO authenticated 
  USING (true)
  WITH CHECK (
    -- Only allow valid status transitions
    CASE 
      WHEN OLD.order_status = 'pending' THEN NEW.order_status IN ('confirmed', 'cancelled')
      WHEN OLD.order_status = 'confirmed' THEN NEW.order_status IN ('processing', 'cancelled')
      WHEN OLD.order_status = 'processing' THEN NEW.order_status IN ('shipped', 'cancelled')
      WHEN OLD.order_status = 'shipped' THEN NEW.order_status IN ('delivered')
      ELSE NEW.order_status = OLD.order_status  -- No changes from terminal states
    END
  );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Test these queries to verify security:

-- 1. This should FAIL (anonymous user trying to create order directly):
-- INSERT INTO public.orders (customer_email, order_status) VALUES ('test@test.com', 'pending');

-- 2. This should SUCCEED (your API creates orders with service role):
-- Your /api/orders endpoint uses service role and bypasses RLS

-- 3. Verify current policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies WHERE tablename IN ('orders', 'order_items'); 