'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  Brain, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

interface AISettingsProps {
  onSave: (settings: AISettings) => void
  currentSettings: AISettings
}

interface AISettings {
  enabled: boolean
  categorization: boolean
  relatedTasks: boolean
  workflowSuggestions: boolean
  autoTagging: boolean
  model: string
  temperature: number
  maxTokens: number
  cacheResponses: boolean
  privacyMode: boolean
}

export function AISettings({ onSave, currentSettings }: AISettingsProps) {
  const [settings, setSettings] = useState<AISettings>(currentSettings)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  const updateSetting = (key: keyof AISettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(settings)
    } catch (error) {
      console.error('Error saving AI settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const testAIConnection = async () => {
    setIsTesting(true)
    setTestResult('')
    
    try {
      // Test AI service connection
      const response = await fetch('/api/ai/test')
      const result = await response.json()
      
      if (result.success) {
        setTestResult('AI service is working correctly')
      } else {
        setTestResult('AI service test failed')
      }
    } catch (error) {
      setTestResult('AI service is not available')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6" data-testid="ai-settings">
      {/* AI Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${settings.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Brain className={`h-5 w-5 ${settings.enabled ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="font-medium">Local AI Service</p>
                <p className="text-sm text-gray-600">
                  {settings.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testAIConnection}
                disabled={isTesting}
                data-testid="test-ai-connection"
              >
                {isTesting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  'Test Connection'
                )}
              </Button>
              {testResult && (
                <Badge variant={testResult.includes('working') ? 'default' : 'destructive'}>
                  {testResult}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai-enabled">Enable AI Features</Label>
              <p className="text-sm text-gray-600">Turn on AI-powered task intelligence</p>
            </div>
            <Switch
              id="ai-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
              data-testid="ai-enabled-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="categorization">Smart Categorization</Label>
              <p className="text-sm text-gray-600">Automatically categorize tasks</p>
            </div>
            <Switch
              id="categorization"
              checked={settings.categorization}
              onCheckedChange={(checked) => updateSetting('categorization', checked)}
              disabled={!settings.enabled}
              data-testid="categorization-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="related-tasks">Related Task Suggestions</Label>
              <p className="text-sm text-gray-600">Suggest similar or related tasks</p>
            </div>
            <Switch
              id="related-tasks"
              checked={settings.relatedTasks}
              onCheckedChange={(checked) => updateSetting('relatedTasks', checked)}
              disabled={!settings.enabled}
              data-testid="related-tasks-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="workflow-suggestions">Workflow Suggestions</Label>
              <p className="text-sm text-gray-600">Generate step-by-step workflows</p>
            </div>
            <Switch
              id="workflow-suggestions"
              checked={settings.workflowSuggestions}
              onCheckedChange={(checked) => updateSetting('workflowSuggestions', checked)}
              disabled={!settings.enabled}
              data-testid="workflow-suggestions-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-tagging">Auto Tagging</Label>
              <p className="text-sm text-gray-600">Automatically suggest relevant tags</p>
            </div>
            <Switch
              id="auto-tagging"
              checked={settings.autoTagging}
              onCheckedChange={(checked) => updateSetting('autoTagging', checked)}
              disabled={!settings.enabled}
              data-testid="auto-tagging-switch"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="privacy-mode">Privacy Mode</Label>
              <p className="text-sm text-gray-600">Process data locally only</p>
            </div>
            <Switch
              id="privacy-mode"
              checked={settings.privacyMode}
              onCheckedChange={(checked) => updateSetting('privacyMode', checked)}
              data-testid="privacy-mode-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="cache-responses">Cache Responses</Label>
              <p className="text-sm text-gray-600">Cache AI responses for better performance</p>
            </div>
            <Switch
              id="cache-responses"
              checked={settings.cacheResponses}
              onCheckedChange={(checked) => updateSetting('cacheResponses', checked)}
              data-testid="cache-responses-switch"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={() => setSettings(currentSettings)}
          data-testid="reset-settings"
        >
          Reset
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          data-testid="save-settings"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
