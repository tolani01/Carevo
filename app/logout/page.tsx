'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(true);

  useEffect(() => {
    // Frontend-only sign out placeholder: clear client state and redirect
    try {
      sessionStorage.clear();
      localStorage.removeItem('carevo_auth');
      localStorage.removeItem('carevo_user');
    } catch {}

    const t = setTimeout(() => {
      router.replace('/login');
    }, 1200);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LogOut className="h-5 w-5" />
            <span>Sign out</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing you out…</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => router.replace('/login')}
              className="flex-1"
            >
              Sign out now
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Go back
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Note: This signs you out on this device only. Backend session revocation will be wired later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


