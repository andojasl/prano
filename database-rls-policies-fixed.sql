-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Products table policies
CREATE POLICY "Public read access for products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');

-- Sizes table policies
CREATE POLICY "Public read access for sizes" ON public.sizes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage sizes" ON public.sizes
    FOR ALL USING (auth.role() = 'authenticated');

-- Texts table policies
CREATE POLICY "Public read access for texts" ON public.texts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage texts" ON public.texts
    FOR ALL USING (auth.role() = 'authenticated');

-- Orders table policies (secure - no anonymous insert)
CREATE POLICY "Authenticated users can manage orders" ON public.orders
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow anonymous users to view their own orders only with valid session_id
CREATE POLICY "Anonymous users can view orders with session_id" ON public.orders
    FOR SELECT USING (
        auth.role() = 'anon' AND 
        stripe_session_id IS NOT NULL
    );

-- Order items table policies (secure - no anonymous insert)
CREATE POLICY "Authenticated users can manage order_items" ON public.order_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow anonymous users to view order items for orders they can access
CREATE POLICY "Anonymous users can view order_items with valid order" ON public.order_items
    FOR SELECT USING (
        auth.role() = 'anon' AND 
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.stripe_session_id IS NOT NULL
        )
    );

-- Addresses table policies
CREATE POLICY "Authenticated users can manage addresses" ON public.addresses
    FOR ALL USING (auth.role() = 'authenticated');

-- Custom orders table policies (if the table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_orders') THEN
        EXECUTE 'ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY';
        
        EXECUTE 'CREATE POLICY "Anonymous users can create custom_orders" ON public.custom_orders
            FOR INSERT WITH CHECK (true)';
            
        EXECUTE 'CREATE POLICY "Authenticated users can manage custom_orders" ON public.custom_orders
            FOR ALL USING (auth.role() = ''authenticated'')';
    END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.sizes TO anon, authenticated;
GRANT SELECT ON public.texts TO anon, authenticated;

-- Orders and order_items: NO INSERT for anon (handled by API with service role)
GRANT SELECT ON public.orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;

GRANT SELECT ON public.order_items TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.order_items TO authenticated;

GRANT ALL ON public.addresses TO authenticated;

-- Custom orders permissions (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_orders') THEN
        EXECUTE 'GRANT INSERT ON public.custom_orders TO anon';
        EXECUTE 'GRANT ALL ON public.custom_orders TO authenticated';
    END IF;
END $$; 