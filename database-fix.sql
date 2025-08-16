-- Fix for ambiguous column reference in order number generation

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
DROP FUNCTION IF EXISTS set_order_number();
DROP FUNCTION IF EXISTS generate_order_number();

-- Recreate function to generate order numbers with explicit column references
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT := 'PRN';
  timestamp_part TEXT;
  random_part TEXT;
  new_order_number TEXT;
BEGIN
  -- Get timestamp part (YYYYMMDD)
  timestamp_part := TO_CHAR(NOW(), 'YYYYMMDD');
  
  -- Generate random 4-digit number
  random_part := LPAD((RANDOM() * 9999)::INTEGER::TEXT, 4, '0');
  
  -- Combine parts
  new_order_number := prefix || timestamp_part || random_part;
  
  -- Check if order number already exists, if so regenerate
  WHILE EXISTS (SELECT 1 FROM orders WHERE orders.order_number = new_order_number) LOOP
    random_part := LPAD((RANDOM() * 9999)::INTEGER::TEXT, 4, '0');
    new_order_number := prefix || timestamp_part || random_part;
  END LOOP;
  
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger function with explicit references
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number(); 