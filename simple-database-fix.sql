-- Simple fix: Remove the problematic trigger and generate order numbers in application code

-- Drop the problematic trigger and functions
DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
DROP FUNCTION IF EXISTS set_order_number();
DROP FUNCTION IF EXISTS generate_order_number();

-- That's it! Order numbers will now be generated in the Node.js application code 