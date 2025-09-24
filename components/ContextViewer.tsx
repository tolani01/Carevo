'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { FileText, Calendar, MessageSquare, User, Clock, Tag } from 'lucide-react'

interface ContextViewerProps {
  isOpen: boolean
  onClose: () => void
  contextData: any
}

export function ContextViewer({ isOpen, onClose, contextData }: ContextViewerProps) {
  const [activeTab, setActiveTab] = useState<'message' | 'task' | 'document'>('message')

  if (!contextData) return null

  const getContextType = () => {
    if (contextData.type === 'task') return 'task'
    if (contextData.type === 'document') return 'document'
    return 'message'
  }

  const renderMessageContext = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-gray-900">{contextData.sender}</span>
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {new Date(contextData.timestamp).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-800">{contextData.content}</p>
      </div>
      
      {contextData.attachments && contextData.attachments.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
          <div className="space-y-2">
            {contextData.attachments.map((attachment: any, index: number) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">{attachment.name}</span>
                <Badge variant="outline" className="text-xs">
                  {attachment.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderTaskContext = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-900">Task Details</span>
        </div>
        <h3 className="text-lg font-semibold text-blue-900 mb-2">{contextData.title}</h3>
        <p className="text-blue-800 mb-3">{contextData.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-900">Assignee:</span>
            <span className="ml-2 text-blue-800">{contextData.assignee}</span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Priority:</span>
            <Badge className="ml-2 bg-blue-100 text-blue-800">
              {contextData.priority}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-blue-900">Status:</span>
            <Badge className="ml-2 bg-green-100 text-green-800">
              {contextData.status}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-blue-900">Due Date:</span>
            <span className="ml-2 text-blue-800">
              {new Date(contextData.due_date).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {contextData.tags && contextData.tags.length > 0 && (
          <div className="mt-3">
            <span className="font-medium text-blue-900">Tags:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {contextData.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderDocumentContext = () => (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-green-600" />
          <span className="font-medium text-green-900">Document Details</span>
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">{contextData.title}</h3>
        <p className="text-green-800 mb-3">{contextData.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-green-900">Type:</span>
            <span className="ml-2 text-green-800">{contextData.documentType}</span>
          </div>
          <div>
            <span className="font-medium text-green-900">Size:</span>
            <span className="ml-2 text-green-800">{contextData.size}</span>
          </div>
          <div>
            <span className="font-medium text-green-900">Shared by:</span>
            <span className="ml-2 text-green-800">{contextData.sharedBy}</span>
          </div>
          <div>
            <span className="font-medium text-green-900">Shared on:</span>
            <span className="ml-2 text-green-800">
              {new Date(contextData.sharedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Context Viewer</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'message'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Message
            </button>
            <button
              onClick={() => setActiveTab('task')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'task'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Task
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'document'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Document
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'message' && renderMessageContext()}
            {activeTab === 'task' && renderTaskContext()}
            {activeTab === 'document' && renderDocumentContext()}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={onClose} className="flex-1">
              Open in App
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
