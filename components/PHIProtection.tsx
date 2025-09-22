'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PHIProtectionProps {
  text: string;
  onTextChange?: (text: string) => void;
  showWarning?: boolean;
  className?: string;
}

// Common PHI patterns to detect
const phiPatterns = [
  // SSN patterns
  /\b\d{3}-\d{2}-\d{4}\b/g,
  /\b\d{3}\s\d{2}\s\d{4}\b/g,
  /\b\d{9}\b/g,
  
  // Phone numbers
  /\b\d{3}-\d{3}-\d{4}\b/g,
  /\b\(\d{3}\)\s\d{3}-\d{4}\b/g,
  /\b\d{3}\.\d{3}\.\d{4}\b/g,
  
  // Email addresses
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Medical record numbers (common patterns)
  /\bMRN\s*:?\s*\d+/gi,
  /\bPatient\s+ID\s*:?\s*\d+/gi,
  /\bAccount\s+Number\s*:?\s*\d+/gi,
  
  // Dates that might be DOB
  /\b(0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])[\/\-](19|20)\d{2}\b/g,
  /\b(0[1-9]|[12]\d|3[01])[\/\-](0[1-9]|1[0-2])[\/\-](19|20)\d{2}\b/g,
  
  // Full names (basic pattern)
  /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
  
  // Address patterns
  /\b\d+\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Circle|Cir|Court|Ct)\b/gi
];

export function PHIProtection({ 
  text, 
  onTextChange, 
  showWarning = true, 
  className 
}: PHIProtectionProps) {
  const [phiDetected, setPhiDetected] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!text) {
      setPhiDetected([]);
      setShowAlert(false);
      return;
    }

    const detected: string[] = [];
    
    phiPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        detected.push(...matches);
      }
    });

    setPhiDetected(detected);
    setShowAlert(detected.length > 0 && showWarning);
  }, [text, showWarning]);

  const handleTextChange = (newText: string) => {
    onTextChange?.(newText);
  };

  const sanitizeText = () => {
    let sanitized = text;
    
    // Replace detected PHI with placeholders
    phiDetected.forEach(phi => {
      if (phi.match(/\d{3}-\d{2}-\d{4}/)) {
        sanitized = sanitized.replace(phi, 'XXX-XX-XXXX');
      } else if (phi.match(/\d{3}-\d{3}-\d{4}/)) {
        sanitized = sanitized.replace(phi, 'XXX-XXX-XXXX');
      } else if (phi.match(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/)) {
        sanitized = sanitized.replace(phi, '[Patient Name]');
      } else if (phi.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)) {
        sanitized = sanitized.replace(phi, '[Email Address]');
      } else {
        sanitized = sanitized.replace(phi, '[PHI Data]');
      }
    });

    handleTextChange(sanitized);
    setShowAlert(false);
  };

  if (!showAlert) return null;

  return (
    <Alert className={cn("border-blue-mono-200 bg-blue-mono-50", className)}>
      <AlertTriangle className="h-4 w-4 text-blue-mono-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium text-blue-mono-800">
            Potential PHI Detected
          </p>
          <p className="text-sm text-blue-mono-700 mt-1">
            We detected {phiDetected.length} potential PHI element{phiDetected.length !== 1 ? 's' : ''} in your text. 
            Consider using patient initials and DOB only (e.g., "J.S. 08/14").
          </p>
          {phiDetected.length > 0 && (
            <div className="mt-2 text-xs text-blue-mono-600">
              <strong>Detected:</strong> {phiDetected.slice(0, 3).join(', ')}
              {phiDetected.length > 3 && ` and ${phiDetected.length - 3} more...`}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={sanitizeText}
            className="text-blue-mono-700 border-blue-mono-300 hover:bg-blue-mono-100"
          >
            <Shield className="h-3 w-3 mr-1" />
            Sanitize
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAlert(false)}
            className="text-blue-mono-600 hover:text-blue-mono-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Hook for PHI detection
export function usePHIDetection(text: string) {
  const [phiDetected, setPhiDetected] = useState<string[]>([]);
  const [hasPHI, setHasPHI] = useState(false);

  useEffect(() => {
    if (!text) {
      setPhiDetected([]);
      setHasPHI(false);
      return;
    }

    const detected: string[] = [];
    
    phiPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        detected.push(...matches);
      }
    });

    setPhiDetected(detected);
    setHasPHI(detected.length > 0);
  }, [text]);

  return { phiDetected, hasPHI };
}
