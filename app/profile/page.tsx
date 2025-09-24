'use client'

import { useState } from 'react'
import { useApp } from '@/components/AppProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NotificationCenter } from '@/components/NotificationCenter'
import { PasswordChangeModal } from '@/components/PasswordChangeModal'
import { OAuthProviderCard } from '@/components/OAuthProviderCard'
import { SecurityDashboard } from '@/components/SecurityDashboard'
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
  const { user, overdueCount, mentionCount } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    role: user?.role || 'User'
  })

  // Modal states
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showSecurityDashboard, setShowSecurityDashboard] = useState(false)

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

  // Mock OAuth providers
  const oauthProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: <span className="text-blue-600 font-bold text-lg">G</span>,
      color: 'bg-blue-100',
      description: 'Sign in with Google',
      connected: true,
      lastUsed: '2024-12-19T10:30:00Z',
      permissions: ['Email', 'Profile', 'Calendar']
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: <span className="text-blue-600 font-bold text-lg">M</span>,
      color: 'bg-blue-100',
      description: 'Sign in with Microsoft',
      connected: false,
      permissions: ['Email', 'Profile', 'Office 365']
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: <span className="text-gray-900 font-bold text-lg">🍎</span>,
      color: 'bg-gray-100',
      description: 'Sign in with Apple',
      connected: false,
      permissions: ['Email', 'Profile']
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

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    console.log('Changing password...')
    // TODO: Implement API call
    return new Promise(resolve => setTimeout(resolve, 2000))
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

  return (
    <div className="flex-1 flex flex-col profile-page">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 p-6" data-testid="profile-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
              <p className="text-gray-600">{user?.role || 'User'} • {user?.department || 'Department'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSecurityDashboard(true)}
              data-testid="open-security-dashboard"
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
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
                  Notifications
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordModal(true)}
                  className="h-20 flex-col gap-2"
                  data-testid="open-password-modal"
                >
                  <Lock className="h-6 w-6" />
                  Password
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSecurityDashboard(true)}
                  className="h-20 flex-col gap-2"
                  data-testid="open-security-dashboard"
                >
                  <Shield className="h-6 w-6" />
                  Security
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                >
                  <Settings className="h-6 w-6" />
                  Settings
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
    </div>
  )
}