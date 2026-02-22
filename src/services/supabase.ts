import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use service role key for server-side operations to bypass RLS when needed
// or to handle administrative tasks.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
