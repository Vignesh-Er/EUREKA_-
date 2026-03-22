// Supabase client — gracefully handles missing package
// Install with: npm install @supabase/supabase-js
// Then fill in .env.local with your project URL and anon key

let supabase: any = null
let hasSupabase = false

try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  if (url && key) {
    // Dynamic require to avoid build errors when package isn't installed
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(url, key)
    hasSupabase = true
  }
} catch {
  // Package not installed or credentials missing — demo mode
  supabase = null
  hasSupabase = false
}

export { supabase, hasSupabase }
