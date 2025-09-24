'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './ui/button'
import { X, Bell, BellOff, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface NotificationToastProps {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
  customButtons?: Array<{
    text: string
    variant?: 'default' | 'destructive' | 'outline'
    onClick: () => void
  }>
}

export function NotificationToast({ 
  id, 
  type, 
  title, 
  message, 
  duration = 0, // Set to 0 to disable auto-dismiss
  onClose,
  customButtons
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100)
    
    // Only auto-hide if duration is greater than 0
    let hideTimer: NodeJS.Timeout | null = null
    if (duration > 0) {
      hideTimer = setTimeout(() => {
        handleClose()
      }, duration)
    }

    return () => {
      clearTimeout(showTimer)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300) // Match animation duration
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-400" />
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-400" />
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-400" />
      case 'info':
      default:
        return <Info className="h-6 w-6 text-blue-400" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-400 shadow-green-300'
      case 'error':
        return 'bg-gradient-to-br from-red-50 to-red-100 border-red-400 shadow-red-300'
      case 'warning':
        return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400 shadow-yellow-300'
      case 'info':
      default:
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 shadow-blue-300'
    }
  }

  return (
    <div
      className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] max-w-md w-full mx-4
        transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        bg-gray-900 border-2 border-gray-600 rounded-lg shadow-2xl
      `}
    >
      {/* Content Container */}
      <div className="p-6 relative">
        {/* Header with Icon and Title - Centered */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <div className="p-2 rounded-full bg-gray-800">
              {getIcon()}
            </div>
          </div>
          <h4 className="font-bold text-white text-xl leading-tight mb-2 text-center">
            {title}
          </h4>
        </div>

        {/* Message Content - Centered */}
        <div className="mb-6">
          <p className="text-white leading-relaxed text-center whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Buttons - Bottom Right */}
        <div className="flex justify-end gap-3">
          {customButtons ? (
            customButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  console.log(`%c🔘 PERMISSION BUTTON CLICKED: ${button.text}`, 'background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;')
                  
                  e.preventDefault()
                  e.stopPropagation()
                  
                  if (typeof button.onClick === 'function') {
                    try {
                      console.log(`%c🚀 EXECUTING ${button.text.toUpperCase()} ACTION`, 'background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;')
                      button.onClick()
                      console.log(`%c✅ ${button.text.toUpperCase()} ACTION COMPLETED`, 'background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;')
                    } catch (error) {
                      console.error(`%c❌ ERROR IN ${button.text.toUpperCase()} ACTION`, 'background: #F44336; color: white; padding: 2px 5px; border-radius: 3px;', error)
                    }
                  } else {
                    console.error(`%c❌ ${button.text.toUpperCase()} FUNCTION NOT FOUND`, 'background: #F44336; color: white; padding: 2px 5px; border-radius: 3px;', button.onClick)
                  }
                }}
                className={`
                  font-medium py-2 px-6 rounded-md transition-colors cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${button.variant === 'destructive' 
                    ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                    : button.variant === 'outline'
                    ? 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 focus:ring-gray-500'
                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                  }
                `}
                style={{ 
                  pointerEvents: 'auto',
                  zIndex: 9999,
                  position: 'relative'
                }}
              >
                {button.text}
              </button>
            ))
          ) : (
            <button
              type="button"
              onClick={(e) => {
                console.log('🔘 Default OK button clicked')
                e.preventDefault()
                e.stopPropagation()
                handleClose()
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ 
                pointerEvents: 'auto',
                zIndex: 9999,
                position: 'relative'
              }}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface NotificationContainerProps {
  notifications: Array<{
    id: string
    type: 'success' | 'info' | 'warning' | 'error'
    title: string
    message: string
    duration?: number
  }>
  onRemove: (id: string) => void
}

export function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Only show the most recent notification to avoid overlapping
  const currentNotification = notifications[notifications.length - 1]
  
  if (!currentNotification || !mounted) {
    return null
  }

  // Render notification in a portal at document body level to avoid Dialog conflicts
  return createPortal(
    <NotificationToast
      key={currentNotification.id}
      {...currentNotification}
      onClose={onRemove}
    />,
    document.body
  )
}
