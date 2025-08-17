-- Check existing sequences
SELECT schemaname, sequencename 
FROM pg_sequences 
WHERE schemaname = 'public' AND sequencename LIKE '%orders%';

-- Check the actual sequence name for orders table
SELECT column_name, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'id';

-- Check all sequences in public schema
SELECT schemaname, sequencename 
FROM pg_sequences 
WHERE schemaname = 'public';
