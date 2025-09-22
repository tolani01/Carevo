'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  user: any;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export function UltraMinimalAppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Ultra minimal auth check - only localStorage, no router, no pathname
  useEffect(() => {
    console.log('UltraMinimalAppProvider - Checking auth...');
    
    if (typeof window !== 'undefined') {
      const testUser = localStorage.getItem('test_user');
      if (testUser) {
        try {
          const parsedUser = JSON.parse(testUser);
          console.log('UltraMinimalAppProvider - Found user:', parsedUser.id);
          setUser(parsedUser);
        } catch (error) {
          console.error('UltraMinimalAppProvider - Parse error:', error);
          setUser(null);
        }
      } else {
        console.log('UltraMinimalAppProvider - No user found');
        setUser(null);
      }
    }
    
    setLoading(false);
  }, []); // Empty dependency array

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

  // Always show children - no redirects, no conditions
  console.log('UltraMinimalAppProvider - Rendering children');
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

export function useUltraMinimalApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useUltraMinimalApp must be used within an UltraMinimalAppProvider');
  }
  return context;
}
