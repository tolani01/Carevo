'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔧 SIMPLE LOGIN: Attempting login with:', { username, password });

    // Simple authentication - accept any username/password for demo
    if (username.trim() && password.trim()) {
      console.log('✅ SIMPLE LOGIN: Valid credentials, logging in...');
      
      // Create user info based on username
      const testUserInfo = {
        id: `user-${username.toLowerCase().replace(/\s+/g, '-')}`,
        email: `${username.toLowerCase().replace(/\s+/g, '')}@carevo.dev`,
        role: 'provider',
        organization_id: 'demo-org',
        first_name: username.split(' ')[0] || 'Demo',
        last_name: username.split(' ').slice(1).join(' ') || 'User',
        phone: '+1 (555) 123-4567'
      };
      
      // Store in localStorage
      localStorage.setItem('test_user', JSON.stringify(testUserInfo));
      
      // Set cookie
      document.cookie = `test_user=${JSON.stringify(testUserInfo)}; path=/; max-age=86400`;
      
      console.log('🚀 SIMPLE LOGIN: Redirecting to /board...');
      
      // Force redirect
      window.location.href = '/board';
      
    } else {
      setError('Please enter both username and password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center glassmorphism-bg p-4">
      <div className="w-full max-w-md">
        {/* Modern Login Card */}
        <div className="glass-card p-8 space-y-6" role="main" aria-labelledby="login-title">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-mono-500 to-blue-mono-700 rounded-2xl flex items-center justify-center mb-4" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 id="login-title" className="text-2xl font-bold text-gray-900">Welcome to Carevo</h1>
            <p className="text-gray-600">Sign in to your command center</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h3>
            <p className="text-xs text-blue-700">
              <strong>Username:</strong> Any name (e.g., "Dr. Smith")<br/>
              <strong>Password:</strong> Any password<br/>
              <em>This is a demo - any credentials will work!</em>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-white/80">
            Secure • HIPAA Compliant • Modern
          </p>
        </div>
      </div>
    </div>
  );
}