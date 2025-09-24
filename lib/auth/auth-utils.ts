// import { createClient } from '@/lib/supabase/client'
import { UserRole } from '@/lib/types/database'

// const supabase = createClient()

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  organization_id?: string
  first_name?: string
  last_name?: string
  phone?: string
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  // Check if we have a test user in localStorage (client-side only)
  if (typeof window !== 'undefined') {
    const testUser = localStorage.getItem('test_user');
    if (testUser) {
      console.log('getCurrentUser - Found test user in localStorage:', testUser);
      return JSON.parse(testUser);
    }
  }
  
  console.log('getCurrentUser - No user found');
  return null
}

export async function signOut() {
  // TEMPORARILY DISABLED - Using simple auth instead of Supabase
  // const supabase = createClient()
  // await supabase.auth.signOut()
  if (typeof window !== 'undefined') {
    localStorage.removeItem('test_user');
    document.cookie = 'test_user=; path=/; max-age=0'; // Clear test user cookie
  }
}

export async function signInWithPhone(phone: string) {
  // TEMPORARILY DISABLED - Using simple auth instead of Supabase
  // const supabase = createClient()
  
  // Check for hardcoded test phone number (same logic as verifyOTP)
  const cleanPhone = phone.replace(/\D/g, '');
  const isTestNumber = cleanPhone.includes('8176906509') || 
    (phone.includes('(817)') && phone.includes('690-6509'));
  
  if (isTestNumber) {
    // For test number, always use development mode regardless of SMS settings
    console.log('Test number detected in signInWithPhone:', cleanPhone);
    return { error: null, isDevelopment: true, isTestNumber: true };
  }
  
  // Check if we're in development mode
  const smsEnabled = process.env.NEXT_PUBLIC_SUPABASE_SMS_ENABLED === 'true' || 
    (typeof window !== 'undefined' && localStorage.getItem('supabase_sms_enabled') === 'true');
  const isDevelopment = process.env.NODE_ENV === 'development' && !smsEnabled
  
  // Mock SMS sending for demo purposes
  console.log(`Mock SMS OTP sent to ${phone}`)
  return { error: null, isDevelopment: true, isTestNumber: false }
}

export async function verifyOTP(phone: string, token: string) {
  console.log('🔍 verifyOTP called with:', { phone, token });
  // TEMPORARILY DISABLED - Using simple auth instead of Supabase
  // const supabase = createClient()
  
  // FORCE TEST MODE FOR ANY PHONE CONTAINING 8176906509
  const cleanPhone = phone.replace(/\D/g, '');
  const isTestNumber = cleanPhone.includes('8176906509') || cleanPhone.includes('8176906509');
  
  // Also check for formatted versions
  const formattedTest = phone.includes('(817)') && phone.includes('690-6509');
  const finalTestNumber = isTestNumber || formattedTest;
  
  console.log('verifyOTP - Phone analysis:', { 
    originalPhone: phone, 
    cleanPhone, 
    isTestNumber,
    formattedTest,
    finalTestNumber,
    targetNumber: '8176906509'
  });
  
  if (finalTestNumber) {
    // SIMPLE TEST MODE - just return success for any 6-digit code
    console.log('Test number OTP verification (bypassing SMS mode):', { token, length: token.length, isDigits: /^\d+$/.test(token) });
    console.log('✅ Test number detected, processing...');
    
    if (token.length === 6 && /^\d+$/.test(token)) {
      console.log('✅ Test authentication successful!');
      
      // Create a mock user object for testing
      const mockUser = {
        id: 'test-user-8176906509',
        email: 'test8176906509@gmail.com',
        phone: phone,
        created_at: new Date().toISOString(),
      };
      
      const mockData = {
        user: mockUser,
        session: {
          access_token: 'test-token',
          refresh_token: 'test-refresh-token',
          user: mockUser
        }
      };
      
      return { data: mockData, error: null, isDevelopment: true, isTestNumber: true };
    } else {
      return { 
        data: null, 
        error: { message: 'Invalid code. Use any 6-digit number for test account.' }, 
        isDevelopment: true, 
        isTestNumber: true 
      };
    }
  }
  
  // Check if we're in development mode
  const smsEnabled = process.env.NEXT_PUBLIC_SUPABASE_SMS_ENABLED === 'true' || 
    (typeof window !== 'undefined' && localStorage.getItem('supabase_sms_enabled') === 'true');
  const isDevelopment = process.env.NODE_ENV === 'development' && !smsEnabled
  
  // Mock OTP verification for demo purposes
  console.log(`Mock OTP verification for ${phone} with token ${token}`)
  
  // Simple validation - any 6-digit code works
  if (token.length === 6 && /^\d+$/.test(token)) {
    const mockUser = {
      id: `demo-user-${phone.replace(/\D/g, '')}`,
      email: `demo${phone.replace(/\D/g, '')}@carevo.dev`,
      phone: phone,
      created_at: new Date().toISOString(),
    };
    
    const mockData = {
      user: mockUser,
      session: {
        access_token: 'demo-token',
        refresh_token: 'demo-refresh-token',
        user: mockUser
      }
    };
    
    return { data: mockData, error: null, isDevelopment: true, isTestNumber: false };
  } else {
    return { 
      data: null, 
      error: { message: 'Invalid code. Use any 6-digit number for demo.' }, 
      isDevelopment: true, 
      isTestNumber: false 
    };
  }
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'org_owner_admin': 8,
    'provider': 7,
    'nurse_ma': 6,
    'front_desk': 5,
    'billing_specialist': 4,
    'pa_coordinator': 3,
    'lab_results': 2,
    'auditor_ro': 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canManageUsers(userRole: UserRole): boolean {
  return userRole === 'org_owner_admin'
}

export function canCreateTasks(userRole: UserRole): boolean {
  return userRole !== 'auditor_ro'
}

export function canViewAllTasks(userRole: UserRole): boolean {
  return userRole === 'org_owner_admin' || userRole === 'auditor_ro'
}

export function canEditTasks(userRole: UserRole): boolean {
  return userRole !== 'auditor_ro'
}
