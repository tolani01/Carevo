'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PHIAlertProps {
  isVisible: boolean;
  onDismiss: () => void;
  className?: string;
}

export function PHIAlert({ isVisible, onDismiss, className }: PHIAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsDismissed(false);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss();
  };

  if (!isVisible || isDismissed) return null;

  return (
    <Alert className={cn("border-blue-mono-200 bg-blue-mono-50 mb-4", className)}>
      <Info className="h-4 w-4 text-blue-mono-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-mono-600" />
            <p className="font-medium text-blue-mono-800">
              PHI-Lite Mode Active
            </p>
          </div>
          <p className="text-sm text-blue-mono-700 mt-1">
            When creating tasks, use only patient initials and DOB (e.g., "J.S. 08/14"). 
            Avoid entering full names, SSNs, or detailed medical information.
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDismiss}
          className="text-blue-mono-600 hover:text-blue-mono-800 ml-4"
        >
          <X className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// Hook to manage PHI alert state
export function usePHIAlert() {
  const [showAlert, setShowAlert] = useState(false);

  const showPHIAlert = () => {
    setShowAlert(true);
  };

  const hidePHIAlert = () => {
    setShowAlert(false);
  };

  return {
    showAlert,
    showPHIAlert,
    hidePHIAlert
  };
}
