import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Define fixed values for Supabase connection
const SUPABASE_URL = 'https://gihofdmqjwgkotwxdxms.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaG9mZG1xandna290d3hkeG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjc2ODUsImV4cCI6MjA1NzY0MzY4NX0.zYI7MLQutII3RGcORQsIq0jjPkOstQPb57Y0wXLSPiU';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
} 