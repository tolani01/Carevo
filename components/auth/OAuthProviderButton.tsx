'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  ExternalLink, 
  Lock, 
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface OAuthProvider {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
  status: 'available' | 'coming-soon' | 'maintenance' | 'disabled'
  comingSoonDate?: string
}

interface OAuthProviderButtonProps {
  provider: OAuthProvider
  onConnect: (providerId: string) => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function OAuthProviderButton({ 
  provider, 
  onConnect, 
  variant = 'outline',
  size = 'default',
  className = ''
}: OAuthProviderButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClick = async () => {
    if (provider.status !== 'available') {
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      await onConnect(provider.id)
    } catch (error: any) {
      console.error(`Error connecting to ${provider.name}:`, error)
      setError(error.message || `Failed to connect to ${provider.name}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (provider.status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'coming-soon':
        return <Lock className="h-4 w-4 text-yellow-600" />
      case 'maintenance':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case 'disabled':
        return <Lock className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (provider.status) {
      case 'available':
        return 'Available'
      case 'coming-soon':
        return provider.comingSoonDate ? `Coming ${provider.comingSoonDate}` : 'Coming Soon'
      case 'maintenance':
        return 'Under Maintenance'
      case 'disabled':
        return 'Disabled'
      default:
        return ''
    }
  }

  const getStatusColor = () => {
    switch (provider.status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'coming-soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'disabled':
        return 'bg-gray-100 text-gray-500 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200'
    }
  }

  const isDisabled = provider.status !== 'available' || isLoading

  return (
    <div className="space-y-2">
      <Button
        onClick={handleClick}
        disabled={isDisabled}
        variant={variant}
        size={size}
        className={`w-full justify-start gap-3 ${className} ${
          isDisabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        data-testid={`oauth-button-${provider.id}`}
      >
        <div className="flex items-center gap-3">
          {provider.icon}
          <div className="flex-1 text-left">
            <div className="font-medium">{provider.name}</div>
            <div className="text-xs text-gray-500">{provider.description}</div>
          </div>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            getStatusIcon()
          )}
        </div>
      </Button>

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <Badge 
          variant="outline" 
          className={`text-xs ${getStatusColor()}`}
        >
          {getStatusText()}
        </Badge>
        
        {provider.status === 'coming-soon' && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={() => window.open(`https://${provider.name.toLowerCase()}.com/developers`, '_blank')}
          >
            Learn More <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-3 w-3 text-red-500" />
          <span className="text-xs text-red-700">{error}</span>
        </div>
      )}
    </div>
  )
}
