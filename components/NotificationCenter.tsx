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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      await onSave(settings)
      setSaveStatus('success')
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
        setSaveStatus('idle')
      }, 1500)
    } catch (error) {
      console.error('Error saving notification settings:', error)
      setSaveStatus('error')
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

  const handleClose = () => {
    if (!isSaving) {
      setSettings(currentSettings) // Reset to original
      setSaveStatus('idle')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="notification-center">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </DialogTitle>
        </DialogHeader>
        
        {/* Save Status Announcement */}
        {saveStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md" role="status" aria-live="polite">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Notification settings saved successfully!</span>
            </div>
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert" aria-live="assertive">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">Failed to save settings. Please try again.</span>
            </div>
          </div>
        )}
        
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
                  aria-describedby="email-notifications-description"
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
                  aria-describedby="sms-notifications-description"
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
                  aria-describedby="push-notifications-description"
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
                  aria-describedby="in-app-notifications-description"
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
                  <SelectTrigger aria-label="Select notification frequency">
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
                  data-testid="quiet-toggle"
                  aria-describedby="quiet-hours-description"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-describedby="quiet-start-description"
                    />
                    <p id="quiet-start-description" className="text-xs text-gray-500">
                      When to start quiet hours
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-end">End Time</Label>
                    <input
                      id="quiet-end"
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => updateNestedSetting('quietHours', 'end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-describedby="quiet-end-description"
                    />
                    <p id="quiet-end-description" className="text-xs text-gray-500">
                      When to end quiet hours
                    </p>
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
                  aria-describedby="task-notifications-description"
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
                  aria-describedby="message-notifications-description"
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
                  aria-describedby="system-notifications-description"
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
                  aria-describedby="security-notifications-description"
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
                  aria-describedby="emergency-override-description"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            data-testid="notification-save"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
