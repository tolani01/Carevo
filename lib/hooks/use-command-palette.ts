'use client';

import { useEffect } from 'react';

export function useCommandPalette() {
  const registerCommand = (command: string, handler: () => void) => {
    // Register command for future use
    console.log('Registering command:', command);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global keyboard shortcuts can be handled here
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Command palette will be opened by parent component
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { registerCommand };
}

