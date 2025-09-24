'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Copy,
  QrCode,
  Loader2
} from 'lucide-react'

interface MFASetupProps {
  onComplete: (methods: string[]) => void
  onCancel: () => void
}

export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const [step, setStep] = useState<'select' | 'sms' | 'email' | 'totp' | 'complete'>('select')
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])
  const [smsCode, setSmsCode] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [totpSecret, setTotpSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  // Mock TOTP secret generation
  useEffect(() => {
    if (step === 'totp') {
      // Generate a mock TOTP secret (in real app, this comes from backend)
      const secret = 'JBSWY3DPEHPK3PXP'
      setTotpSecret(secret)
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Carevo:user@example.com?secret=${secret}&issuer=Carevo`)
    }
  }, [step])

  const handleMethodSelect = (method: string) => {
    if (selectedMethods.includes(method)) {
      setSelectedMethods(selectedMethods.filter(m => m !== method))
    } else {
      setSelectedMethods([...selectedMethods, method])
    }
  }

  const handleContinue = () => {
    if (selectedMethods.length === 0) {
      setError('Please select at least one MFA method')
      return
    }
    
    if (selectedMethods.includes('sms')) {
      setStep('sms')
    } else if (selectedMethods.includes('email')) {
      setStep('email')
    } else if (selectedMethods.includes('totp')) {
      setStep('totp')
    } else {
      setStep('complete')
    }
  }

  const handleVerifyCode = async (method: 'sms' | 'email' | 'totp') => {
    setIsLoading(true)
    setError('')
    
    try {
      // Mock verification (in real app, this calls backend)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate verification success
      if (method === 'sms' && smsCode === '123456') {
        setStep('complete')
      } else if (method === 'email' && emailCode === '123456') {
        setStep('complete')
      } else if (method === 'totp' && totpCode === '123456') {
        setStep('complete')
      } else {
        setError('Invalid verification code')
      }
    } catch (error: any) {
      setError(error.message || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    onComplete(selectedMethods)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (step === 'select') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Set Up Multi-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose your preferred MFA methods for enhanced security:
          </p>
          
          <div className="space-y-3">
            {/* SMS Option */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethods.includes('sms') 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleMethodSelect('sms')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">SMS Verification</h3>
                    <p className="text-sm text-gray-600">Receive codes via text message</p>
                  </div>
                </div>
                {selectedMethods.includes('sms') && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>

            {/* Email Option */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethods.includes('email') 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleMethodSelect('email')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium">Email Verification</h3>
                    <p className="text-sm text-gray-600">Receive codes via email</p>
                  </div>
                </div>
                {selectedMethods.includes('email') && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>

            {/* TOTP Option */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethods.includes('totp') 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleMethodSelect('totp')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium">Authenticator App</h3>
                    <p className="text-sm text-gray-600">Google Authenticator, Authy, etc.</p>
                  </div>
                </div>
                {selectedMethods.includes('totp') && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleContinue} className="flex-1">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'sms') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            SMS Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            We'll send a verification code to your phone number.
          </p>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Test Mode:</strong> Use code <code className="bg-blue-200 px-1 rounded">123456</code>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Verification Code</label>
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value)}
              maxLength={6}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={() => handleVerifyCode('sms')} 
              disabled={isLoading || smsCode.length !== 6}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'email') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-600" />
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            We'll send a verification code to your email address.
          </p>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Test Mode:</strong> Use code <code className="bg-green-200 px-1 rounded">123456</code>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Verification Code</label>
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              maxLength={6}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={() => handleVerifyCode('email')} 
              disabled={isLoading || emailCode.length !== 6}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'totp') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-600" />
            Authenticator App Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Scan the QR code with your authenticator app or enter the secret manually.
          </p>
          
          <div className="text-center space-y-4">
            <div className="p-4 bg-white border rounded-lg inline-block">
              <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Secret Key</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={totpSecret}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(totpSecret)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Enter Verification Code</label>
            <Input
              type="text"
              placeholder="Enter 6-digit code from app"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              maxLength={6}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={() => handleVerifyCode('totp')} 
              disabled={isLoading || totpCode.length !== 6}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'complete') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            MFA Setup Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Your multi-factor authentication has been successfully configured.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Enabled Methods:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedMethods.map((method) => (
                <Badge key={method} variant="default" className="bg-green-100 text-green-800">
                  {method.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Security Note:</strong> Your account is now protected with multiple layers of security. 
              Keep your backup codes safe and consider enabling additional methods.
            </p>
          </div>

          <Button onClick={handleComplete} className="w-full">
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
