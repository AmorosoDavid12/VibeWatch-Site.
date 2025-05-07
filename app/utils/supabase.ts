import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to hardcoded values in development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gihofdmqjwgkotwxdxms.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaG9mZG1xandna290d3hkeG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjc2ODUsImV4cCI6MjA1NzY0MzY4NX0.zYI7MLQutII3RGcORQsIq0jjPkOstQPb57Y0wXLSPiU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 