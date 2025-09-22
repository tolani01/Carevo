// Test Supabase connection and auth
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uaizskfvzcnfbexsliwx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaXpza2Z2emNuZmJleHNsaXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDY2OTksImV4cCI6MjA3NDEyMjY5OX0.pHIRy3UGGFHw8vLAyaoYxwfl-j7e3u_MzmpXSx3uI7w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  try {
    console.log('Testing Supabase auth...');
    
    const testEmail = 'test8176906509@gmail.com';
    const testPassword = 'test123456';
    
    // Try to sign up
    console.log('Attempting sign up...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    console.log('Sign up result:', { 
      user: signUpData?.user?.id, 
      error: signUpError?.message 
    });
    
    if (signUpError && !signUpError.message.includes('already registered')) {
      console.error('Sign up failed:', signUpError);
      return;
    }
    
    // Try to sign in
    console.log('Attempting sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    console.log('Sign in result:', { 
      user: signInData?.user?.id, 
      error: signInError?.message 
    });
    
    if (signInError) {
      console.error('Sign in failed:', signInError);
    } else {
      console.log('✅ Authentication successful!');
    }
    
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

testAuth();
