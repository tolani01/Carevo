'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  UserCircle,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserDropdownProps {
  userName: string;
  userRole: string;
  userPhone: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

export function UserDropdown({
  userName,
  userRole,
  userPhone,
  onProfile,
  onSettings,
  onLogout
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfile = () => {
    setIsOpen(false);
    onProfile?.() || router.push('/profile');
  };

  const handleSettings = () => {
    setIsOpen(false);
    onSettings?.() || router.push('/admin');
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.() || router.push('/logout');
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'owner': return 'Owner';
      case 'provider': return 'Healthcare Provider';
      case 'auditor': return 'Auditor';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'owner':
        return <Shield className="h-4 w-4" />;
      default:
        return <UserCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 w-auto px-3 flex items-center space-x-2 hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-mono-500 to-blue-mono-700 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {userName}
          </div>
          <div className="text-xs text-gray-500 truncate max-w-[120px]">
            {getRoleDisplay(userRole)}
          </div>
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )} 
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[60]">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-mono-500 to-blue-mono-700 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {userName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {userPhone}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  {getRoleIcon(userRole)}
                  <span className="text-xs text-gray-600">
                    {getRoleDisplay(userRole)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleProfile}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
            >
              <User className="h-4 w-4 text-gray-400" />
              <span>View Profile</span>
            </button>

            {(userRole === 'admin' || userRole === 'owner') && (
              <button
                onClick={handleSettings}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                <span>Admin Settings</span>
              </button>
            )}

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
