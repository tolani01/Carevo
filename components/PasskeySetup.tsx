'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield, CheckCircle } from 'lucide-react';

interface PasskeySetupProps {
  onComplete: () => void;
}

export function PasskeySetup({ onComplete }: PasskeySetupProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSetupPasskey = async () => {
    setLoading(true);
    try {
      // Simulate passkey setup
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      console.error('Passkey setup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-green-800">Passkey Set Up Successfully!</CardTitle>
          <CardDescription>
            You can now use your device's biometric authentication to sign in quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Redirecting to your dashboard...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Set Up Passkey</CardTitle>
        <CardDescription>
          Add a passkey for faster, more secure sign-ins using your device's biometric authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
              1
            </div>
            <p className="text-sm text-muted-foreground">
              Click "Set Up Passkey" below
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
              2
            </div>
            <p className="text-sm text-muted-foreground">
              Follow your device's prompts to create a passkey
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
              3
            </div>
            <p className="text-sm text-muted-foreground">
              You'll be able to sign in with just your fingerprint or face
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleSetupPasskey} 
            className="w-full" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Set Up Passkey
          </Button>
          <Button 
            variant="outline" 
            onClick={onComplete} 
            className="w-full"
            disabled={loading}
          >
            Skip for Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

