'use client';

import { useState } from 'react';
import { UsersTab } from '@/components/admin/UsersTab';
import { LocationsTab } from '@/components/admin/LocationsTab';
import { SecurityTab } from '@/components/admin/SecurityTab';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'locations' | 'security'>('users');

  return (
    <div className="h-screen flex flex-col glassmorphism-bg">
      {/* Modern Header */}
      <header className="glass-card border-b border-gray-200/20 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Manage your command center settings and users</p>
          </div>
        </div>
        <nav className="mt-4">
          <div className="flex space-x-8">
            {[
              { id: 'users', label: 'People' },
              { id: 'locations', label: 'Locations' },
              { id: 'security', label: 'Security' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="glass-card p-6">
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'locations' && <LocationsTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </main>
    </div>
  );
}

