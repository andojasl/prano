import { createClient } from '@supabase/supabase-js'

/**
 * Service role client for backend operations that need to bypass RLS
 * Only use this for trusted server-side operations like order creation
 * NEVER expose the service role key to the client
 */
export function createServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service operations')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
} 