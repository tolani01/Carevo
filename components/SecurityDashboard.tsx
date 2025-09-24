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
  RefreshCw,
  Filter
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
  const [isRefreshing, setIsRefreshing] = useState(false)

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
      case 'success': return 'text-green-600 bg-green-100 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'danger': return 'text-red-600 bg-red-100 border-red-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Safe'
      case 'warning': return 'Warning'
      case 'danger': return 'Suspicious'
      default: return 'Unknown'
    }
  }

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('android') || device.toLowerCase().includes('iphone')) {
      return <Smartphone className="h-4 w-4" />
    }
    return <Monitor className="h-4 w-4" />
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000) // Simulate refresh time
    }
  }

  const recentEvents = events.slice(0, 5)
  const suspiciousEvents = events.filter(e => e.status === 'danger').length
  const warningEvents = events.filter(e => e.status === 'warning').length
  const totalEvents = events.length

  return (
    <div className="space-y-6" data-testid="security-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Dashboard</h2>
          <p className="text-gray-600">Monitor your account security and activity</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh security events"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onExport}
            aria-label="Export security events"
          >
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
                <p className="text-2xl font-bold text-gray-900">{totalEvents - suspiciousEvents - warningEvents}</p>
                <p className="text-sm text-gray-600">Safe Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{warningEvents}</p>
                <p className="text-sm text-gray-600">Warnings</p>
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
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Security Events
            </CardTitle>
            <div className="flex gap-2">
              {(['all', 'success', 'warning', 'danger'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                  data-testid={`sec-filter-${status}`}
                  aria-label={`Filter by ${status} events`}
                >
                  {status}
                  {status !== 'all' && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 text-xs"
                    >
                      {status === 'success' ? totalEvents - suspiciousEvents - warningEvents :
                       status === 'warning' ? warningEvents :
                       status === 'danger' ? suspiciousEvents : totalEvents}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No {filter === 'all' ? '' : filter} events found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid="sec-event"
                >
                  <div className={`p-3 rounded-lg border ${getStatusColor(event.status)}`}>
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
                      <span className="text-xs text-gray-500">
                        IP: {event.ipAddress}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant="outline"
                      className={`${getStatusColor(event.status)} border`}
                    >
                      {getStatusLabel(event.status)}
                    </Badge>
                    <span className="text-xs text-gray-500 capitalize">
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Security Recommendations</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Review suspicious events immediately and change your password if needed</li>
                <li>• Enable two-factor authentication for additional security</li>
                <li>• Log out from devices you no longer use</li>
                <li>• Keep your browser and operating system updated</li>
                <li>• Use a password manager to generate strong, unique passwords</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
