'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsOptions {
  onNewTask?: () => void;
  onAssign?: () => void;
  onSetDue?: () => void;
  onSetWaiting?: () => void;
  onCommandPalette?: () => void;
  onSearch?: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts({
  onNewTask,
  onAssign,
  onSetDue,
  onSetWaiting,
  onCommandPalette,
  onSearch,
  disabled = false
}: KeyboardShortcutsOptions) {
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return;
    
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    // Command/Ctrl + K for command palette
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onCommandPalette?.();
      return;
    }

    // Command/Ctrl + / for search
    if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSearch?.();
      return;
    }

    // Single key shortcuts (only when not holding modifiers)
    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          onNewTask?.();
          break;
        case 'a':
          e.preventDefault();
          onAssign?.();
          break;
        case 'd':
          e.preventDefault();
          onSetDue?.();
          break;
        case 'w':
          e.preventDefault();
          onSetWaiting?.();
          break;
        case 'escape':
          // Close any open modals or drawers
          const escapeEvent = new CustomEvent('keyboard-escape');
          window.dispatchEvent(escapeEvent);
          break;
      }
    }
  }, [onNewTask, onAssign, onSetDue, onSetWaiting, onCommandPalette, onSearch, disabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    // Expose methods for manual triggering
    triggerNewTask: onNewTask,
    triggerAssign: onAssign,
    triggerSetDue: onSetDue,
    triggerSetWaiting: onSetWaiting,
    triggerCommandPalette: onCommandPalette,
    triggerSearch: onSearch
  };
}
