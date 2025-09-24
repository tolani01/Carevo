'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/components/AppProvider'
import { useI18n } from '@/lib/hooks/use-translation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NotificationCenter } from '@/components/NotificationCenter'
import { PasswordChangeModal } from '@/components/PasswordChangeModal'
import { OAuthProviderCard } from '@/components/OAuthProviderCard'
import { SecurityDashboard } from '@/components/SecurityDashboard'
// import { ProductivityDashboard } from '@/components/ProductivityDashboard'
import { 
  User, 
  Phone, 
  Shield, 
  Settings, 
  LogOut, 
  Edit,
  CheckCircle2,
  Clock,
  Bell,
  Lock,
  Key
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, overdueCount, mentionCount } = useApp()
  const { t, changeLanguage, getCurrentLanguage, formatDate } = useI18n()
  const [isEditing, setIsEditing] = useState(false)
  
  // Debug logging
  console.log('ProfilePage - user:', user)
  console.log('ProfilePage - overdueCount:', overdueCount)
  console.log('ProfilePage - mentionCount:', mentionCount)
  
  const [profileData, setProfileData] = useState({
    name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : '',
    phone: user?.phone || '',
    role: user?.role || 'User'
  })

  // Modal states
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showSecurityDashboard, setShowSecurityDashboard] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  
  // App preferences state
  const [appPreferences, setAppPreferences] = useState({
    darkMode: false,
    language: 'en',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  // Load preferences on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('appPreferences')
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences)
      setAppPreferences(parsed)
      
      // Apply dark mode if saved
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  // Mock notification settings
  const notificationSettings = {
    email: true,
    sms: false,
    push: true,
    inApp: true,
    frequency: 'realtime' as const,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    },
    channels: {
      tasks: true,
      messages: true,
      system: true,
      security: true
    },
    emergencyOverride: true
  }

  // Mock OAuth providers - Security-focused approach
  const oauthProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: <span className="text-blue-600 font-bold text-lg">G</span>,
      color: 'bg-blue-100',
      description: 'Sign in with Google',
      connected: true,
      lastUsed: '2024-12-19T10:30:00Z',
      activePermissions: ['Email', 'Profile', 'Calendar'], // Only active permissions
      availablePermissions: ['Email', 'Profile', 'Calendar'] // For display purposes
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: <span className="text-blue-600 font-bold text-lg">M</span>,
      color: 'bg-blue-100',
      description: 'Sign in with Microsoft',
      connected: false,
      availablePermissions: ['Email', 'Profile', 'Office 365'] // Only available permissions
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: <span className="text-gray-900 font-bold text-lg">🍎</span>,
      color: 'bg-gray-100',
      description: 'Sign in with Apple',
      connected: false,
      availablePermissions: ['Email', 'Profile'] // Only available permissions
    }
  ]

  // Mock security events
  const securityEvents = [
    {
      id: '1',
      type: 'login' as const,
      description: 'Successful login from Chrome on Windows',
      timestamp: '2024-12-19T10:30:00Z',
      ipAddress: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on Windows',
      status: 'success' as const
    },
    {
      id: '2',
      type: 'password_change' as const,
      description: 'Password changed successfully',
      timestamp: '2024-12-18T15:45:00Z',
      ipAddress: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on Windows',
      status: 'success' as const
    },
    {
      id: '3',
      type: 'login' as const,
      description: 'Failed login attempt from unknown device',
      timestamp: '2024-12-17T22:15:00Z',
      ipAddress: '203.0.113.1',
      location: 'Unknown',
      device: 'Unknown Browser',
      status: 'danger' as const
    },
    {
      id: '4',
      type: 'device_added' as const,
      description: 'New device registered',
      timestamp: '2024-12-16T14:20:00Z',
      ipAddress: '192.168.1.101',
      location: 'New York, NY',
      device: 'iPhone Safari',
      status: 'warning' as const
    }
  ]

  const handleSave = () => {
    // TODO: Implement actual profile update
    console.log('Saving profile:', profileData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    // TODO: Implement actual logout
    console.log('Logging out')
    window.location.href = '/login'
  }

  // Event handlers
  const handleNotificationSave = async (settings: any) => {
    console.log('Saving notification settings:', settings)
    // TODO: Implement API call
    return new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handlePasswordChange = async (currentPassword: string, newPassword: string): Promise<void> => {
    console.log('Changing password...')
    // TODO: Implement API call
    return new Promise<void>(resolve => setTimeout(resolve, 2000))
  }

  const handleOAuthConnect = async (providerId: string) => {
    console.log('Connecting OAuth provider:', providerId)
    // TODO: Implement OAuth flow
    return new Promise(resolve => setTimeout(resolve, 1500))
  }

  const handleOAuthDisconnect = async (providerId: string) => {
    console.log('Disconnecting OAuth provider:', providerId)
    // TODO: Implement disconnect
    return new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleSecurityRefresh = () => {
    console.log('Refreshing security events')
    // TODO: Implement refresh
  }

  const handleSecurityExport = () => {
    console.log('Exporting security events')
    // TODO: Implement export
  }

  const handleViewHistory = () => {
    router.push('/history')
  }

  // App preferences handlers
  const handleDarkModeToggle = () => {
    const newDarkMode = !appPreferences.darkMode
    setAppPreferences(prev => ({ ...prev, darkMode: newDarkMode }))
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setAppPreferences(prev => ({ ...prev, language: newLanguage }))
    changeLanguage(newLanguage)
    console.log('Language changed to:', newLanguage)
  }

  const handleTimeZoneChange = (newTimeZone: string) => {
    setAppPreferences(prev => ({ ...prev, timeZone: newTimeZone }))
    localStorage.setItem('timeZone', newTimeZone)
    console.log('Time zone changed to:', newTimeZone)
  }

  const handleSavePreferences = () => {
    // Save all preferences to localStorage
    localStorage.setItem('appPreferences', JSON.stringify(appPreferences))
    console.log('Preferences saved:', appPreferences)
    setShowSettingsModal(false)
  }

  // Show loading state if user is not available
  if (!user) {
    return (
      <div className="flex-1 flex flex-col profile-page">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Loading Profile...</h1>
              <p className="text-gray-600">Please wait while we load your profile information.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col profile-page">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 p-6" data-testid="profile-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {user ? (user.first_name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'User'}
              </h1>
              <p className="text-gray-600">{user?.role || 'User'} • {user?.organization_id || 'Organization'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSecurityDashboard(true)}
              data-testid="open-security-dashboard"
            >
              <Shield className="h-4 w-4 mr-2" />
              {t('profile.security')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNotificationCenter(true)}
                  className="h-20 flex-col gap-2"
                  data-testid="open-notification-center"
                >
                  <Bell className="h-6 w-6" />
                  {t('profile.notifications')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordModal(true)}
                  className="h-20 flex-col gap-2"
                  data-testid="open-password-modal"
                >
                  <Lock className="h-6 w-6" />
                  {t('profile.password')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSecurityDashboard(true)}
                  className="h-20 flex-col gap-2"
                  data-testid="open-security-dashboard"
                >
                  <Shield className="h-6 w-6" />
                  {t('profile.security')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettingsModal(true)}
                  className="h-20 flex-col gap-2"
                  data-testid="open-settings-modal"
                >
                  <Settings className="h-6 w-6" />
                  {t('profile.settings')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-sm">
                    {profileData.role}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Contact your administrator to change your role
                  </span>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center space-x-2 pt-4">
                  <Button onClick={handleSave} className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Save Changes</span>
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Activity Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
                  <div className="text-sm text-red-700">Overdue Tasks</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mentionCount}</div>
                  <div className="text-sm text-blue-700">Unread Mentions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-green-700">Tasks Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {oauthProviders.map((provider) => (
                  <OAuthProviderCard
                    key={provider.id}
                    provider={provider}
                    onConnect={handleOAuthConnect}
                    onDisconnect={handleOAuthDisconnect}
                    onManage={(id) => console.log('Manage provider:', id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Phone Authentication</div>
                  <div className="text-sm text-gray-500">SMS-based login enabled</div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">TOTP app authentication</div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Enabled
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Account Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowNotificationCenter(true)}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notification Preferences
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowPasswordModal(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Productivity Dashboard */}
          {/* <ProductivityDashboard 
            userId={user?.id}
            onViewHistory={handleViewHistory}
          /> */}
        </div>
      </main>

      {/* Modals */}
      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onSave={handleNotificationSave}
        currentSettings={notificationSettings}
      />

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onPasswordChange={handlePasswordChange}
      />

      {showSecurityDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Security Dashboard</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowSecurityDashboard(false)}
                >
                  ✕
                </Button>
              </div>
              <SecurityDashboard
                events={securityEvents}
                onRefresh={handleSecurityRefresh}
                onExport={handleSecurityExport}
              />
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{t('profile.accountSettings')}</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowSettingsModal(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* General Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      {t('profile.generalSettings')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">{t('profile.displayName')}</Label>
                        <Input
                          id="displayName"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">{t('profile.phone')}</Label>
                        <Input
                          id="phoneNumber"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-sm">
                          {profileData.role}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Contact your administrator to change your role
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Settings Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowSettingsModal(false);
                          setShowNotificationCenter(true);
                        }}
                        className="h-16 flex-col gap-2"
                      >
                        <Bell className="h-6 w-6" />
                        Notification Preferences
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowSettingsModal(false);
                          setShowPasswordModal(true);
                        }}
                        className="h-16 flex-col gap-2"
                      >
                        <Lock className="h-6 w-6" />
                        Change Password
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowSettingsModal(false);
                          setShowSecurityDashboard(true);
                        }}
                        className="h-16 flex-col gap-2"
                      >
                        <Shield className="h-6 w-6" />
                        Security Settings
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowSettingsModal(false);
                          handleViewHistory();
                        }}
                        className="h-16 flex-col gap-2"
                      >
                        <Clock className="h-6 w-6" />
                        View History
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* App Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('profile.appPreferences')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{t('profile.darkMode')}</div>
                        <div className="text-sm text-gray-500">{t('profile.darkModeDescription')}</div>
                      </div>
                      <Button 
                        variant={appPreferences.darkMode ? "default" : "outline"} 
                        size="sm"
                        onClick={handleDarkModeToggle}
                        className="flex items-center gap-2"
                      >
                        {appPreferences.darkMode ? (
                          <>
                            <span className="text-lg">🌙</span>
                            {t('profile.dark')}
                          </>
                        ) : (
                          <>
                            <span className="text-lg">☀️</span>
                            {t('profile.light')}
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{t('profile.language')}</div>
                        <div className="text-sm text-gray-500">{t('profile.languageDescription')}</div>
                      </div>
                      <select 
                        value={getCurrentLanguage()}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{t('profile.timeZone')}</div>
                        <div className="text-sm text-gray-500">{t('profile.timeZoneDescription')}</div>
                      </div>
                      <select 
                        value={appPreferences.timeZone}
                        onChange={(e) => handleTimeZoneChange(e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSettingsModal(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={handleSavePreferences}>
                    {t('profile.saveChanges')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}