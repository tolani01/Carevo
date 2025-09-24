'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HybridLoginForm } from '@/components/auth/HybridLoginForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (credentials: any) => {
    setLoading(true);
    setError('');

    console.log('🔧 HYBRID LOGIN: Attempting login with:', credentials);

    try {
      // Simple authentication - accept any credentials for demo
      console.log('✅ HYBRID LOGIN: Valid credentials, logging in...');
        
        // Create user info based on email
        const emailParts = credentials.email.split('@')[0];
        const testUserInfo = {
          id: `user-${emailParts.toLowerCase().replace(/\s+/g, '-')}`,
          email: credentials.email,
          role: 'provider',
          organization_id: 'demo-org',
          first_name: emailParts.split('.')[0] || 'Demo',
          last_name: emailParts.split('.')[1] || 'User',
          phone: '+1 (555) 123-4567',
          mfaEnabled: credentials.mfaCode ? true : false,
          mfaMethods: credentials.mfaCode ? ['sms'] : []
        };
        
        // Store in localStorage
        localStorage.setItem('test_user', JSON.stringify(testUserInfo));
        
        // Set cookie
        document.cookie = `test_user=${JSON.stringify(testUserInfo)}; path=/; max-age=86400`;
        
        console.log('🚀 HYBRID LOGIN: Redirecting to /board...');
        
        // Force redirect
        window.location.href = '/board';
    } catch (error: any) {
      console.error('❌ HYBRID LOGIN: Error:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthConnect = async (providerId: string) => {
    console.log('🔧 OAUTH: Attempting connection with:', providerId);
    setError(`${providerId} authentication is coming soon!`);
  };


  return (
    <div className="min-h-screen flex items-center justify-center glassmorphism-bg p-4">
      <div className="w-full max-w-md">

        {/* Hybrid Login Form */}
        <HybridLoginForm
          onLogin={handleLogin}
          onOAuthConnect={handleOAuthConnect}
          isLoading={loading}
          error={error}
        />

        {/* Demo Credentials */}
        <div className="mt-6 glass-card p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h3>
          <p className="text-xs text-blue-700">
            <strong>Email:</strong> Any email (e.g., "dr.smith@carevo.dev")<br/>
            <strong>Password:</strong> Any password<br/>
            <em>This is a demo - any credentials will work!</em>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-white/80">
            Secure • HIPAA Compliant • Modern • Hybrid Auth
          </p>
        </div>
      </div>
    </div>
  );
}