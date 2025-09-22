'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Loader2 } from 'lucide-react';

interface SimplePhoneInputProps {
  onSubmit: (phone: string) => void;
}

export function SimplePhoneInput({ onSubmit }: SimplePhoneInputProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim() && phone.length === 10) {
      setLoading(true);
      try {
        await onSubmit(phone.trim());
      } finally {
        setLoading(false);
      }
    }
  };

  const formatPhone = (digits: string) => {
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with icon */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-mono-500 to-blue-mono-700">
          <Phone className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Enter your phone number</h3>
        <p className="text-sm text-gray-600 mt-1">We'll send you a verification code</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phone-input" className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">+1</span>
            </div>
            <Input
              id="phone-input"
              type="text"
              placeholder="(555) 123-4567"
              value={formatPhone(phone)}
              onChange={(e) => {
                // Remove all non-digits
                const digits = e.target.value.replace(/\D/g, '');
                setPhone(digits.slice(0, 10)); // Max 10 digits
              }}
              className="glass-input pl-10 text-lg font-medium tracking-wide"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              required
            />
          </div>
          {phone.length > 0 && (
            <p className="text-xs text-gray-500">
              {phone.length}/10 digits • {phone.length === 10 ? '✓ Complete' : 'Enter more digits'}
            </p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="glass-button w-full py-3 text-base font-medium"
          disabled={phone.length !== 10 || loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Verification Code
        </Button>
      </form>
      
      {/* Mode indicator */}
      <div className="text-center">
        {(() => {
          const isTestNumber = phone === '8176906509';
          
          if (isTestNumber) {
            return (
              <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <strong>🎯 Test Account:</strong> Hardcoded authentication enabled. No SMS needed.
              </p>
            );
          } else if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_SMS_ENABLED !== 'true') {
            return (
              <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <strong>Development Mode:</strong> No SMS will be sent. You'll proceed to OTP step.
              </p>
            );
          } else {
            return (
              <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <strong>Live SMS Mode:</strong> Real SMS will be sent to your phone.
              </p>
            );
          }
        })()}
      </div>
    </div>
  );
}
