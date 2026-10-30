import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
export { isSupabaseConfigured } from './config'

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (browserClient) return browserClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                      'placeholder-key'

  browserClient = createBrowserClient<Database>(supabaseUrl, supabaseKey)
  return browserClient
}
