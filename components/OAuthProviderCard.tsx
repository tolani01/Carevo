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
  Key,
  Loader2
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
  const [error, setError] = useState('')

  const handleAction = async (action: 'connect' | 'disconnect') => {
    setIsLoading(true)
    setError('')
    
    try {
      if (action === 'connect') {
        await onConnect(provider.id)
      } else {
        await onDisconnect(provider.id)
      }
    } catch (error: any) {
      console.error(`Error ${action}ing provider:`, error)
      setError(error.message || `Failed to ${action} ${provider.name}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManage = () => {
    onManage(provider.id)
  }

  return (
    <Card 
      className={`border-2 transition-colors ${
        provider.connected 
          ? 'border-green-200 bg-green-50 hover:border-green-300' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      data-testid={`oauth-card-${provider.id}`}
    >
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
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Last Used */}
        {provider.connected && provider.lastUsed && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Last used:</span> {new Date(provider.lastUsed).toLocaleDateString()}
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
                onClick={handleManage}
                className="flex-1"
                disabled={isLoading}
                aria-label={`Manage ${provider.name} connection`}
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
                data-testid={`oauth-disconnect-${provider.id}`}
                aria-label={`Disconnect ${provider.name}`}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : null}
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              onClick={() => handleAction('connect')}
              disabled={isLoading}
              className="flex-1"
              data-testid={`oauth-connect-${provider.id}`}
              aria-label={`Connect ${provider.name}`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              {isLoading ? 'Connecting...' : `Connect with ${provider.name}`}
            </Button>
          )}
        </div>

        {/* External Link for More Info */}
        {!provider.connected && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => window.open(`https://${provider.name.toLowerCase()}.com/privacy`, '_blank')}
              aria-label={`Learn more about ${provider.name} privacy policy`}
            >
              Learn more about privacy <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
