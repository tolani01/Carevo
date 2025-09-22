'use client';

import { useState } from 'react';
import { useApp } from '@/components/AppProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Phone, 
  Shield, 
  Settings, 
  LogOut, 
  Edit,
  CheckCircle2,
  Clock,
  Bell
} from 'lucide-react';

export default function ProfilePage() {
  const { user, overdueCount, mentionCount } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    phone: user.phone,
    role: user.role
  });

  const handleSave = () => {
    // TODO: Implement actual profile update
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // TODO: Implement actual logout
    console.log('Logging out');
    window.location.href = '/login';
  };

  return (
    <div className="flex-1 flex flex-col profile-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-600">Manage your account settings</p>
          </div>
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
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
                  <div className="font-medium">Passkey Authentication</div>
                  <div className="text-sm text-gray-500">Biometric login available</div>
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
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notification Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
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
    </div>
  );
}
