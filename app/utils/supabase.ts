import { createClient } from '@supabase/supabase-js';

// Capture auth type from URL hash BEFORE createClient processes and clears it.
export const pendingAuthType = typeof window !== 'undefined'
  ? new URLSearchParams(window.location.hash.substring(1)).get('type')
  : null;

const SUPABASE_URL = 'https://gihofdmqjwgkotwxdxms.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaG9mZG1xandna290d3hkeG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjc2ODUsImV4cCI6MjA1NzY0MzY4NX0.zYI7MLQutII3RGcORQsIq0jjPkOstQPb57Y0wXLSPiU';

// Create the Supabase client with proper headers configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
  },
  global: {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  },
});