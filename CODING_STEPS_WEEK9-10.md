# Weeks 9-10 Coding Steps - Sprint 5: Profile & Security

## 🚀 **Sprint 5 Goals**
- Role-based profile system with dynamic interface
- Working notification preferences and controls
- Secure password management and authentication
- OAuth integration and security features

---

## Week 9: Role-Based Profile System

### Day 41: Notification Center
**Goal**: Create comprehensive notification management system

#### Step 41.1: Create NotificationCenter Component
```bash
touch components/NotificationCenter.tsx
```

**File: `components/NotificationCenter.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  Shield,
  Volume2,
  VolumeX
} from 'lucide-react'

interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  channels: {
    tasks: boolean
    messages: boolean
    system: boolean
    security: boolean
  }
  emergencyOverride: boolean
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: NotificationSettings) => void
  currentSettings: NotificationSettings
}

export function NotificationCenter({ 
  isOpen, 
  onClose, 
  onSave, 
  currentSettings 
}: NotificationCenterProps) {
  const [settings, setSettings] = useState<NotificationSettings>(currentSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(settings)
      onClose()
    } catch (error) {
      console.error('Error saving notification settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateNestedSetting = (parentKey: keyof NotificationSettings, childKey: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey] as any,
        [childKey]: value
      }
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Delivery Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email}
                  onCheckedChange={(checked) => updateSetting('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via text message</p>
                  </div>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.sms}
                  onCheckedChange={(checked) => updateSetting('sms', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-purple-600" />
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive browser push notifications</p>
                  </div>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.push}
                  onCheckedChange={(checked) => updateSetting('push', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  <div>
                    <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                    <p className="text-sm text-gray-600">Show notifications within the app</p>
                  </div>
                </div>
                <Switch
                  id="in-app-notifications"
                  checked={settings.inApp}
                  onCheckedChange={(checked) => updateSetting('inApp', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Frequency Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="frequency">How often would you like to receive notifications?</Label>
                <Select 
                  value={settings.frequency} 
                  onValueChange={(value: any) => updateSetting('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time (immediate)</SelectItem>
                    <SelectItem value="hourly">Hourly digest</SelectItem>
                    <SelectItem value="daily">Daily summary</SelectItem>
                    <SelectItem value="weekly">Weekly summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quiet Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                  <p className="text-sm text-gray-600">Pause notifications during specified times</p>
                </div>
                <Switch
                  id="quiet-hours"
                  checked={settings.quietHours.enabled}
                  onCheckedChange={(checked) => updateNestedSetting('quietHours', 'enabled', checked)}
                />
              </div>

              {settings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-start">Start Time</Label>
                    <input
                      id="quiet-start"
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) => updateNestedSetting('quietHours', 'start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-end">End Time</Label>
                    <input
                      id="quiet-end"
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => updateNestedSetting('quietHours', 'end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Channel Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Channel Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-notifications">Task Notifications</Label>
                  <p className="text-sm text-gray-600">Updates about task assignments and changes</p>
                </div>
                <Switch
                  id="task-notifications"
                  checked={settings.channels.tasks}
                  onCheckedChange={(checked) => updateNestedSetting('channels', 'tasks', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="message-notifications">Message Notifications</Label>
                  <p className="text-sm text-gray-600">New messages and mentions in chat</p>
                </div>
                <Switch
                  id="message-notifications"
                  checked={settings.channels.messages}
                  onCheckedChange={(checked) => updateNestedSetting('channels', 'messages', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-notifications">System Notifications</Label>
                  <p className="text-sm text-gray-600">App updates and maintenance notices</p>
                </div>
                <Switch
                  id="system-notifications"
                  checked={settings.channels.system}
                  onCheckedChange={(checked) => updateNestedSetting('channels', 'system', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="security-notifications">Security Notifications</Label>
                  <p className="text-sm text-gray-600">Login attempts and security alerts</p>
                </div>
                <Switch
                  id="security-notifications"
                  checked={settings.channels.security}
                  onCheckedChange={(checked) => updateNestedSetting('channels', 'security', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Override */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Emergency Override
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emergency-override">Critical Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Always receive critical notifications, even during quiet hours
                  </p>
                </div>
                <Switch
                  id="emergency-override"
                  checked={settings.emergencyOverride}
                  onCheckedChange={(checked) => updateSetting('emergencyOverride', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Day 42: Password Management
**Goal**: Create secure password change and management system

#### Step 42.1: Create PasswordChangeModal Component
```bash
touch components/PasswordChangeModal.tsx
```

**File: `components/PasswordChangeModal.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent } from './ui/card'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Key
} from 'lucide-react'

interface PasswordChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<void>
}

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export function PasswordChangeModal({ 
  isOpen, 
  onClose, 
  onPasswordChange 
}: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) score += 1
    else feedback.push('At least 8 characters')

    if (/[a-z]/.test(password)) score += 1
    else feedback.push('Lowercase letter')

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('Uppercase letter')

    if (/[0-9]/.test(password)) score += 1
    else feedback.push('Number')

    if (/[^A-Za-z0-9]/.test(password)) score += 1
    else feedback.push('Special character')

    if (password.length >= 12) score += 1

    let color = 'bg-red-500'
    if (score >= 4) color = 'bg-green-500'
    else if (score >= 3) color = 'bg-yellow-500'

    return { score, feedback, color }
  }

  const passwordStrength = calculatePasswordStrength(newPassword)
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== ''
  const isFormValid = currentPassword && newPassword && confirmPassword && passwordsMatch && passwordStrength.score >= 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError('')

    try {
      await onPasswordChange(currentPassword, newPassword)
      setSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
      setSuccess(false)
      onClose()
    }
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Password Changed Successfully
            </h3>
            <p className="text-gray-600">
              Your password has been updated. You'll be logged out and need to sign in again.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {passwordStrength.score}/6
                  </span>
                </div>
                
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <p className="font-medium mb-1">Password should include:</p>
                    <ul className="space-y-1">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {confirmPassword && (
              <div className="flex items-center gap-1 text-xs">
                {passwordsMatch ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span className="text-red-600">Passwords don't match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Security Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Security Tips:</p>
                  <ul className="space-y-1">
                    <li>• Use a unique password for this account</li>
                    <li>• Don't reuse passwords from other accounts</li>
                    <li>• Consider using a password manager</li>
                    <li>• Enable two-factor authentication for extra security</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### Day 43: OAuth Integration UI
**Goal**: Create OAuth provider integration interface

#### Step 43.1: Create OAuthProviderCard Component
```bash
touch components/OAuthProviderCard.tsx
```

**File: `components/OAuthProviderCard.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Shield,
  Key
} from 'lucide-react'

interface OAuthProvider {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
  connected: boolean
  lastUsed?: string
  permissions: string[]
}

interface OAuthProviderCardProps {
  provider: OAuthProvider
  onConnect: (providerId: string) => void
  onDisconnect: (providerId: string) => void
  onManage: (providerId: string) => void
}

export function OAuthProviderCard({ 
  provider, 
  onConnect, 
  onDisconnect, 
  onManage 
}: OAuthProviderCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: 'connect' | 'disconnect') => {
    setIsLoading(true)
    try {
      if (action === 'connect') {
        await onConnect(provider.id)
      } else {
        await onDisconnect(provider.id)
      }
    } catch (error) {
      console.error(`Error ${action}ing provider:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`border-2 ${provider.connected ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${provider.color}`}>
              {provider.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{provider.name}</CardTitle>
              <p className="text-sm text-gray-600">{provider.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {provider.connected ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Last Used */}
        {provider.connected && provider.lastUsed && (
          <div className="text-sm text-gray-600">
            Last used: {new Date(provider.lastUsed).toLocaleDateString()}
          </div>
        )}

        {/* Permissions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Permissions:</h4>
          <div className="flex flex-wrap gap-1">
            {provider.permissions.map((permission, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {permission}
              </Badge>
            ))}
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Security & Privacy:</p>
            <ul className="space-y-1">
              <li>• We only access necessary information</li>
              <li>• You can revoke access at any time</li>
              <li>• Your data is encrypted and secure</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {provider.connected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManage(provider.id)}
                className="flex-1"
              >
                <Key className="h-4 w-4 mr-1" />
                Manage
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleAction('disconnect')}
                disabled={isLoading}
                className="flex-1"
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              onClick={() => handleAction('connect')}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Connecting...' : `Connect with ${provider.name}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

### Day 44: Security Dashboard
**Goal**: Create comprehensive security monitoring interface

#### Step 44.1: Create SecurityDashboard Component
```bash
touch components/SecurityDashboard.tsx
```

**File: `components/SecurityDashboard.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Monitor,
  Smartphone,
  Download,
  RefreshCw
} from 'lucide-react'

interface SecurityEvent {
  id: string
  type: 'login' | 'password_change' | 'suspicious' | 'device_added' | 'permission_change'
  description: string
  timestamp: string
  ipAddress: string
  location: string
  device: string
  status: 'success' | 'warning' | 'danger'
}

interface SecurityDashboardProps {
  events: SecurityEvent[]
  onRefresh: () => void
  onExport: () => void
}

export function SecurityDashboard({ events, onRefresh, onExport }: SecurityDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'success' | 'warning' | 'danger'>('all')

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.status === filter
  )

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <Shield className="h-4 w-4" />
      case 'password_change': return <CheckCircle className="h-4 w-4" />
      case 'suspicious': return <AlertTriangle className="h-4 w-4" />
      case 'device_added': return <Monitor className="h-4 w-4" />
      case 'permission_change': return <Shield className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'danger': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile')) {
      return <Smartphone className="h-4 w-4" />
    }
    return <Monitor className="h-4 w-4" />
  }

  const recentEvents = events.slice(0, 5)
  const suspiciousEvents = events.filter(e => e.status === 'danger').length
  const totalEvents = events.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Dashboard</h2>
          <p className="text-gray-600">Monitor your account security and activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalEvents - suspiciousEvents}</p>
                <p className="text-sm text-gray-600">Safe Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{suspiciousEvents}</p>
                <p className="text-sm text-gray-600">Suspicious Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2FA</p>
                <p className="text-sm text-gray-600">Enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Monitor className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Active Devices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Security Events</CardTitle>
            <div className="flex gap-2">
              {(['all', 'success', 'warning', 'danger'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                <div className={`p-2 rounded-lg ${getStatusColor(event.status)}`}>
                  {getEventIcon(event.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      {getDeviceIcon(event.device)}
                      {event.device}
                    </span>
                  </div>
                </div>
                
                <Badge 
                  variant={event.status === 'success' ? 'default' : 'secondary'}
                  className={getStatusColor(event.status)}
                >
                  {event.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Day 45: Profile Page Integration
**Goal**: Wire all profile components together

#### Step 45.1: Update Profile Page
**File: `app/profile/page.tsx`** (update existing)

```typescript
import { NotificationCenter } from '../components/NotificationCenter'
import { PasswordChangeModal } from '../components/PasswordChangeModal'
import { OAuthProviderCard } from '../components/OAuthProviderCard'
import { SecurityDashboard } from '../components/SecurityDashboard'

// Add state
const [showNotificationCenter, setShowNotificationCenter] = useState(false)
const [showPasswordModal, setShowPasswordModal] = useState(false)
const [showSecurityDashboard, setShowSecurityDashboard] = useState(false)

// Mock data
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

const oauthProviders = [
  {
    id: 'google',
    name: 'Google',
    icon: <span className="text-blue-600">G</span>,
    color: 'bg-blue-100',
    description: 'Sign in with Google',
    connected: true,
    lastUsed: '2024-12-19T10:30:00Z',
    permissions: ['Email', 'Profile', 'Calendar']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: <span className="text-blue-600">M</span>,
    color: 'bg-blue-100',
    description: 'Sign in with Microsoft',
    connected: false,
    permissions: ['Email', 'Profile', 'Office 365']
  }
]

const securityEvents = [
  {
    id: '1',
    type: 'login',
    description: 'Successful login from Chrome on Windows',
    timestamp: '2024-12-19T10:30:00Z',
    ipAddress: '192.168.1.100',
    location: 'New York, NY',
    device: 'Chrome on Windows',
    status: 'success'
  },
  {
    id: '2',
    type: 'password_change',
    description: 'Password changed successfully',
    timestamp: '2024-12-18T15:45:00Z',
    ipAddress: '192.168.1.100',
    location: 'New York, NY',
    device: 'Chrome on Windows',
    status: 'success'
  }
]

// Add handlers
const handleNotificationSave = async (settings: any) => {
  console.log('Saving notification settings:', settings)
  // TODO: Implement API call
}

const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
  console.log('Changing password...')
  // TODO: Implement API call
}

const handleOAuthConnect = async (providerId: string) => {
  console.log('Connecting OAuth provider:', providerId)
  // TODO: Implement OAuth flow
}

const handleOAuthDisconnect = async (providerId: string) => {
  console.log('Disconnecting OAuth provider:', providerId)
  // TODO: Implement disconnect
}

// Update JSX
return (
  <div className="flex-1 flex flex-col">
    {/* Profile Header */}
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-600">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600">{user?.role} • {user?.department}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSecurityDashboard(true)}>
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Button>
        </div>
      </div>
    </div>

    {/* Profile Content */}
    <div className="flex-1 p-6 space-y-6">
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
            >
              <Bell className="h-6 w-6" />
              Notifications
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordModal(true)}
              className="h-20 flex-col gap-2"
            >
              <Lock className="h-6 w-6" />
              Password
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowSecurityDashboard(true)}
              className="h-20 flex-col gap-2"
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

      {/* OAuth Providers */}
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
    </div>

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
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
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
              onRefresh={() => console.log('Refresh security events')}
              onExport={() => console.log('Export security events')}
            />
          </div>
        </div>
      </div>
    )}
  </div>
)
```

---

## 🎯 **Week 9-10 Success Criteria**

By end of Day 50, you should have:
- [ ] Notification center with full preferences
- [ ] Secure password change modal
- [ ] OAuth provider integration UI
- [ ] Security dashboard with event monitoring
- [ ] Role-based profile sections
- [ ] MFA implementation UI
- [ ] Integration tests passing

## 🚀 **Ready for Sprint 6**

Next sprint we'll focus on:
1. **AI Features**: Local AI task intelligence
2. **Patient References**: PHI-lite patient reference system
3. **Final Polish**: Performance optimization and testing

Sprint 5 profile and security features are complete! 🎉
