'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  Loader2
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

interface HybridLoginFormProps {
  onLogin: (credentials: any) => void
  onOAuthConnect: (providerId: string) => void
  isLoading?: boolean
  error?: string
}

export function HybridLoginForm({ 
  onLogin, 
  onOAuthConnect, 
  isLoading = false,
  error = ''
}: HybridLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // OAuth providers with real icons
  const oauthProviders: OAuthProvider[] = [
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: 'bg-blue-100',
      description: 'Sign in with Google',
      status: 'coming-soon',
      comingSoonDate: 'Q1 2025'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#F25022" d="M1 1h10v10H1z"/>
          <path fill="#7FBA00" d="M13 1h10v10H13z"/>
          <path fill="#00A4EF" d="M1 13h10v10H1z"/>
          <path fill="#FFB900" d="M13 13h10v10H13z"/>
        </svg>
      ),
      color: 'bg-blue-100',
      description: 'Sign in with Microsoft',
      status: 'coming-soon',
      comingSoonDate: 'Q1 2025'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      color: 'bg-gray-100',
      description: 'Sign in with Apple',
      status: 'disabled'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Use default values if fields are empty for demo purposes
    const demoEmail = email || 'demo@carevo.dev'
    const demoPassword = password || 'demo123'
    
    onLogin({ email: demoEmail, password: demoPassword })
  }

  const handleOAuthConnect = async (providerId: string) => {
    try {
      await onOAuthConnect(providerId)
    } catch (error) {
      console.error('OAuth connection failed:', error)
    }
  }


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Sign In to Carevo</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Secure healthcare task management
        </p>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <button
            type="button"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              // Use default values if fields are empty for demo purposes
              const demoEmail = email || 'demo@carevo.dev'
              const demoPassword = password || 'demo123'
              
              onLogin({ email: demoEmail, password: demoPassword })
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>


        {/* OAuth Providers - Ugly and minimal at bottom */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            {oauthProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleOAuthConnect(provider.id)}
                disabled
                className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 opacity-40 cursor-not-allowed text-xs"
                title={`${provider.name} (not available)`}
              >
                {provider.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Healthcare Security</p>
            <p>
              This application uses enterprise-grade security to protect patient data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
