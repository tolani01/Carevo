'use client'

import { useState, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  customButtons?: Array<{
    text: string
    variant?: 'default' | 'destructive' | 'outline'
    onClick: () => void
  }>
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((
    type: 'success' | 'info' | 'warning' | 'error',
    title: string,
    message: string,
    duration?: number
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration
    }
    
    setNotifications(prev => [...prev, notification])
    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Convenience methods
  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('success', title, message, duration)
  }, [addNotification])

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('info', title, message, duration)
  }, [addNotification])

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('warning', title, message, duration)
  }, [addNotification])

  const showError = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('error', title, message, duration)
  }, [addNotification])

  // Show notification with custom buttons
  const showWithButtons = useCallback((
    type: 'success' | 'info' | 'warning' | 'error',
    title: string,
    message: string,
    buttons: Array<{
      text: string
      variant?: 'default' | 'destructive' | 'outline'
      onClick: () => void
    }>,
    duration?: number
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      customButtons: buttons
    }
    
    setNotifications(prev => [...prev, notification])
    return id
  }, [])

  // Sequential notifications - show second notification after first is dismissed
  const showSequential = useCallback((
    firstNotification: { type: 'success' | 'info' | 'warning' | 'error', title: string, message: string },
    secondNotification: { type: 'success' | 'info' | 'warning' | 'error', title: string, message: string }
  ) => {
    // Clear any existing notifications first
    setNotifications([])
    
    // Show first notification
    const firstId = addNotification(
      firstNotification.type,
      firstNotification.title,
      firstNotification.message,
      0 // No auto-dismiss
    )

    // Create a custom remove function that triggers the second notification
    const sequentialRemove = (id: string) => {
      if (id === firstId) {
        // Remove the first notification
        setNotifications([])
        
        // Show second notification after a brief delay
        setTimeout(() => {
          addNotification(
            secondNotification.type,
            secondNotification.title,
            secondNotification.message,
            0 // No auto-dismiss
          )
        }, 200)
      } else {
        // For any other notification, just remove normally
        removeNotification(id)
      }
    }

    return { firstId, sequentialRemove }
  }, [addNotification, removeNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showInfo,
    showWarning,
    showError,
    showWithButtons,
    showSequential
  }
}
