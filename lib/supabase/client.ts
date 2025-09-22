import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uaizskfvzcnfbexsliwx.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaXpza2Z2emNuZmJleHNsaXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDY2OTksImV4cCI6MjA3NDEyMjY5OX0.pHIRy3UGGFHw8vLAyaoYxwfl-j7e3u_MzmpXSx3uI7w';

  return createBrowserClient(supabaseUrl, supabaseKey);
}
