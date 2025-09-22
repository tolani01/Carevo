// Quick test to check if database tables exist
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uaizskfvzcnfbexsliwx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaXpza2Z2emNuZmJleHNsaXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDY2OTksImV4cCI6MjA3NDEyMjY5OX0.pHIRy3UGGFHw8vLAyaoYxwfl-j7e3u_MzmpXSx3uI7w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Database error:', error.message);
      console.log('🔧 You need to run the database migration!');
      console.log('📋 Go to: https://supabase.com/dashboard/project/uaizskfvzcnfbexsliwx');
      console.log('📋 Navigate to: SQL Editor');
      console.log('📋 Run the contents of: lib/database/setup.sql');
    } else {
      console.log('✅ Database connection successful!');
      console.log('✅ Tables exist and are accessible');
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
