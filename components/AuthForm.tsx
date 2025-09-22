'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Phone, Shield } from 'lucide-react';

interface AuthFormProps {
  mode?: 'phone' | 'otp';
  phone?: string;
  onSubmit: (value: string) => void;
}

export function AuthForm({ mode = 'phone', phone, onSubmit }: AuthFormProps) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputKey, setInputKey] = useState(0); // Force re-render to clear autofill

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    setLoading(true);
    try {
      await onSubmit(value);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'otp') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Enter verification code</h3>
            {(() => {
              const cleanPhone = phone?.replace(/\D/g, '') || '';
              const isTestNumber = cleanPhone === '8176906509';
              
              if (isTestNumber) {
                return (
                  <>
                    <p className="text-sm text-gray-600 mt-1">Test Account: Use any 6-digit code</p>
                    <p className="text-xs text-green-600 mt-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      🎯 Test Mode: Any 6 digits work (e.g., 123456)
                    </p>
                  </>
                );
              } else if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_SMS_ENABLED !== 'true') {
                return (
                  <>
                    <p className="text-sm text-gray-600 mt-1">Development mode: Use any 6-digit code</p>
                    <p className="text-xs text-blue-600 mt-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      💡 Try: 123456 or any 6 digits
                    </p>
                  </>
                );
              } else {
                return (
                  <p className="text-sm text-gray-600 mt-1">Enter the 6-digit code sent to your phone</p>
                );
              }
            })()}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="123456"
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="glass-input text-center text-3xl tracking-[0.5em] font-mono font-bold"
                maxLength={6}
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              {value.length > 0 && (
                <p className="text-xs text-gray-500 text-center">
                  {value.length}/6 digits • {value.length === 6 ? '✓ Ready to verify' : 'Enter more digits'}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="glass-button w-full py-3 text-base font-medium" 
              disabled={loading || value.length !== 6}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
          </form>
        </div>
      );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <Phone className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Enter your phone number</h3>
        <p className="text-sm text-gray-600 mt-1">We'll send you a verification code</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            key={`phone-${inputKey}`}
            id={`phone-${inputKey}`}
            name={`phone-${inputKey}`}
            type="text"
            placeholder="Enter your phone number"
            value={value}
            onChange={(e) => {
              let input = e.target.value;
              console.log('Phone input changed:', input);
              
              // Remove all non-digits
              const digits = input.replace(/\D/g, '');
              console.log('Digits only:', digits);
              
              // Only allow digits, max 10 digits (US phone number)
              const limitedDigits = digits.slice(0, 10);
              
              // Simple format: just show digits
              setValue(limitedDigits);
            }}
            onFocus={(e) => {
              console.log('Phone input focused:', e.target.value);
              // Clear any autofill values on focus
              if (e.target.value === '1111' || e.target.value.includes('1111')) {
                console.log('Clearing autofill value');
                setValue('');
                setInputKey(prev => prev + 1); // Force re-render
              }
            }}
            onBlur={(e) => {
              console.log('Phone input blurred:', e.target.value);
            }}
            className="glass-input"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            required
          />
        </div>
        <Button type="submit" className="glass-button w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Verification Code
        </Button>
      </form>
    </div>
  );
}
