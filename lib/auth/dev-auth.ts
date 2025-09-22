import { createClient } from '@/lib/supabase/client'

// Development authentication helper
// This bypasses real SMS/email for local development

export async function devSignIn(phone: string) {
  const supabase = createClient()
  
  try {
    // Create a test user directly in Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${phone.replace(/\D/g, '')}@carevo.dev`,
      password: 'dev123456', // Simple dev password
    })

    if (error && error.message.includes('Invalid login credentials')) {
      // User doesn't exist, create them
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${phone.replace(/\D/g, '')}@carevo.dev`,
        password: 'dev123456',
        options: {
          data: {
            phone: phone,
          }
        }
      })

      if (signUpError) {
        return { error: signUpError }
      }

      // Auto-confirm the user (bypass email confirmation)
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        signUpData.user!.id,
        { email_confirm: true }
      )

      if (confirmError) {
        console.warn('Could not auto-confirm user:', confirmError)
      }

      return { data: signUpData, error: null }
    }

    return { data, error }
  } catch (error) {
    return { error }
  }
}

export async function devVerifyOTP(phone: string, code: string) {
  // For development, any 6-digit code works
  if (code.length === 6 && /^\d+$/.test(code)) {
    return await devSignIn(phone)
  }
  
  return { 
    error: { message: 'Invalid code. Use any 6-digit number for development.' } 
  }
}
