'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Key, 
  Monitor, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin
} from 'lucide-react';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface Passkey {
  id: string;
  name: string;
  createdAt: string;
  lastUsed: string;
}

export function SecurityTab() {
  const [passkeysEnabled, setPasskeysEnabled] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Chrome on MacBook Pro',
      location: 'San Francisco, CA',
      lastActive: '2024-01-15T10:30:00Z',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      lastActive: '2024-01-15T09:15:00Z',
      current: false
    },
    {
      id: '3',
      device: 'Chrome on Windows PC',
      location: 'New York, NY',
      lastActive: '2024-01-14T16:20:00Z',
      current: false
    }
  ]);

  const [passkeys, setPasskeys] = useState<Passkey[]>([
    {
      id: '1',
      name: 'MacBook Pro Touch ID',
      createdAt: '2024-01-10T00:00:00Z',
      lastUsed: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'iPhone Face ID',
      createdAt: '2024-01-12T00:00:00Z',
      lastUsed: '2024-01-15T09:15:00Z'
    }
  ]);

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const handleRevokeAllSessions = () => {
    setSessions(sessions.filter(session => session.current));
  };

  const handleDeletePasskey = (passkeyId: string) => {
    setPasskeys(passkeys.filter(passkey => passkey.id !== passkeyId));
  };

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security</h2>
        <p className="text-gray-600">Manage authentication and security settings</p>
      </div>

      {/* Passkey Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Passkey Authentication</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Passkeys</h3>
              <p className="text-sm text-gray-600">
                Allow users to sign in with biometric authentication
              </p>
            </div>
            <Switch
              checked={passkeysEnabled}
              onCheckedChange={setPasskeysEnabled}
            />
          </div>
          
          {passkeysEnabled && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Passkeys are enabled for your organization
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Active Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{session.device}</span>
                      {session.current && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatLastActive(session.lastActive)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
            
            {sessions.filter(s => !s.current).length > 0 && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleRevokeAllSessions}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Revoke All Other Sessions
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Passkey Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Registered Passkeys</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {passkeys.map((passkey) => (
              <div
                key={passkey.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Key className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{passkey.name}</div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(passkey.createdAt).toLocaleDateString()}
                      {passkey.lastUsed && (
                        <span className="ml-2">
                          • Last used {formatLastActive(passkey.lastUsed)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePasskey(passkey.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <Button variant="outline">
                <Key className="mr-2 h-4 w-4" />
                Add New Passkey
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Security Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-orange-800">
                  Unusual Login Activity
                </div>
                <div className="text-sm text-orange-700">
                  Login from New York, NY detected. If this wasn't you, please review your sessions.
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  2 hours ago
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-green-800">
                  Passkey Added Successfully
                </div>
                <div className="text-sm text-green-700">
                  New passkey "iPhone Face ID" has been registered for your account.
                </div>
                <div className="text-xs text-green-600 mt-1">
                  3 days ago
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

