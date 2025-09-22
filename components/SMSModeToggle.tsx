'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function SMSModeToggle() {
  const [smsEnabled, setSmsEnabled] = useState(false);

  useEffect(() => {
    // Check current mode
    const isEnabled = localStorage.getItem('supabase_sms_enabled') === 'true';
    setSmsEnabled(isEnabled);
  }, []);

  const toggleMode = () => {
    const newMode = !smsEnabled;
    setSmsEnabled(newMode);
    localStorage.setItem('supabase_sms_enabled', newMode.toString());
    
    // Show alert with instructions
    if (newMode) {
      alert('SMS Mode Enabled!\n\nTo use real SMS:\n1. Set up Twilio in Supabase Dashboard\n2. Add NEXT_PUBLIC_SUPABASE_SMS_ENABLED=true to .env.local\n3. Restart the development server');
    } else {
      alert('Development Mode Enabled!\n\nUsing email fallback - no SMS costs');
    }
    
    // Reload page to apply changes
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={toggleMode}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <span>SMS Mode:</span>
        <Badge variant={smsEnabled ? "default" : "secondary"}>
          {smsEnabled ? "ON" : "OFF"}
        </Badge>
      </Button>
    </div>
  );
}
