'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AppContextType {
  user: any;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export function MinimalAppProvider({ children }: AppProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Minimal auth check - only localStorage
  useEffect(() => {
    console.log('MinimalAppProvider - Checking auth...');
    
    if (typeof window !== 'undefined') {
      const testUser = localStorage.getItem('test_user');
      if (testUser) {
        try {
          const parsedUser = JSON.parse(testUser);
          console.log('MinimalAppProvider - Found user:', parsedUser.id);
          setUser(parsedUser);
        } catch (error) {
          console.error('MinimalAppProvider - Parse error:', error);
          setUser(null);
        }
      } else {
        console.log('MinimalAppProvider - No user found');
        setUser(null);
      }
    }
    
    setLoading(false);
  }, []); // Empty dependency array - only run once

  const contextValue = {
    user,
    loading
  };

  // Show loading
  if (loading) {
    return (
      <AppContext.Provider value={contextValue}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AppContext.Provider>
    );
  }

  // Login page
  if (pathname === '/login') {
    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
  }

  // No user - redirect to login
  if (!user) {
    console.log('MinimalAppProvider - No user, redirecting to login');
    router.push('/login');
    return (
      <AppContext.Provider value={contextValue}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Redirecting to login...</h2>
          </div>
        </div>
      </AppContext.Provider>
    );
  }

  // Has user - show app
  console.log('MinimalAppProvider - Rendering app for user:', user.id);
  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        <main className="pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </AppContext.Provider>
  );
}

export function useMinimalApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useMinimalApp must be used within a MinimalAppProvider');
  }
  return context;
}
