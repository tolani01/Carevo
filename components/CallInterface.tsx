'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { NotificationContainer } from './NotificationToast'
import { useNotifications } from '../lib/hooks/use-notifications'
import { 
  Phone, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  Users,
  Settings
} from 'lucide-react'

interface CallInterfaceProps {
  isOpen: boolean
  onClose: () => void
  channel: any
  callType: 'voice' | 'video'
  onEndCall?: () => void
}

export function CallInterface({ 
  isOpen, 
  onClose, 
  channel, 
  callType, 
  onEndCall 
}: CallInterfaceProps) {
  const { notifications, removeNotification, clearAll, showSuccess, showError, showInfo, showWithButtons } = useNotifications()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isSpeakerOff, setIsSpeakerOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [participants, setParticipants] = useState(channel.members || [])
  const [permissionStatus, setPermissionStatus] = useState<{
    microphone: 'granted' | 'denied' | 'prompt' | 'unknown'
    camera: 'granted' | 'denied' | 'prompt' | 'unknown'
  }>({
    microphone: 'denied', // Reset to denied so we can test
    camera: 'denied'      // Reset to denied so we can test
  })
  const [permissionError, setPermissionError] = useState<string>('')
  const [showParticipants, setShowParticipants] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const callStartTime = useRef<Date>(new Date())
  const localStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Start call timer
      const timer = setInterval(() => {
        setCallDuration(Math.floor((new Date().getTime() - callStartTime.current.getTime()) / 1000))
      }, 1000)

      // Check existing permissions first
      checkPermissions()
      
      // Request media permissions
      requestMediaPermissions()

      return () => {
        clearInterval(timer)
        // Clean up media streams when call ends
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop())
          localStreamRef.current = null
        }
      }
    }
  }, [isOpen, callType])

  const checkPermissions = async () => {
    try {
      // Check microphone permission
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      setPermissionStatus(prev => ({ ...prev, microphone: micPermission.state as any }))
      
      // Check camera permission (only for video calls)
      if (callType === 'video') {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName })
        setPermissionStatus(prev => ({ ...prev, camera: cameraPermission.state as any }))
      }
    } catch (error) {
      console.log('Permission API not supported, will request permissions directly')
    }
  }

  const requestMediaPermissions = async () => {
    setPermissionError('')
    
    console.log('%c🧹 CLEARING ALL NOTIFICATIONS FIRST', 'background: #FF5722; color: white; padding: 2px 5px; border-radius: 3px;')
    // Clear any existing notifications first
    clearAll()
    
    // Wait a moment then show the permission request
    setTimeout(() => {
      console.log('%c🎯 SHOWING PERMISSION REQUEST', 'background: #9C27B0; color: white; padding: 2px 5px; border-radius: 3px;')
      
      // Create button handlers
      const disallowHandler = () => {
        console.log('%c🔴 DISALLOW CLICKED!', 'background: #F44336; color: white; padding: 2px 5px; border-radius: 3px;')
        handlePermissionDenied()
      }
      
      const allowHandler = () => {
        console.log('%c🟢 ALLOW CLICKED!', 'background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;')
        handlePermissionAllowed()
      }
      
      // Show permission request notification with Allow/Disallow buttons
      const permissionId = showWithButtons(
        'info',
        'Permission Required',
        `${callType === 'video' ? 'Camera and microphone' : 'Microphone'} access is required for this ${callType} call.\n\nClick "Allow" to grant access or "Disallow" to cancel.`,
        [
          {
            text: 'Disallow',
            variant: 'outline',
            onClick: disallowHandler
          },
          {
            text: 'Allow',
            variant: 'default',
            onClick: allowHandler
          }
        ],
        0 // No auto-dismiss
      )
      
      console.log('%c📋 PERMISSION DIALOG CREATED WITH ID:', 'background: #9C27B0; color: white; padding: 2px 5px; border-radius: 3px;', permissionId)
    }, 300)
  }

  const handlePermissionDenied = () => {
    console.log('%c🚫 USER DENIED PERMISSION', 'background: #F44336; color: white; padding: 2px 5px; border-radius: 3px;')
    
    // User denied permission
    setPermissionStatus({
      microphone: 'denied',
      camera: callType === 'video' ? 'denied' : 'unknown'
    })
    
    console.log('%c📤 CLEARING NOTIFICATIONS AND SHOWING ERROR', 'background: #FF9800; color: white; padding: 2px 5px; border-radius: 3px;')
    // Clear notifications and show error
    clearAll()
    setTimeout(() => {
      showError(
        'Permission Denied',
        `${callType === 'video' ? 'Camera and microphone' : 'Microphone'} access was denied.\n\nTo enable calling features later:\n• Click the camera/microphone icon in your browser address bar\n• Select "Allow" for this site\n• Refresh the page and try again`,
        0
      )
    }, 200)
  }

  const handlePermissionAllowed = () => {
    console.log('%c✅ USER ALLOWED PERMISSION', 'background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;')
    
    // Clear notifications first
    clearAll()
    
    // Show loading state
    setTimeout(() => {
      console.log('%c⏳ SHOWING LOADING MESSAGE', 'background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;')
      showInfo(
        'Requesting Access',
        'Please allow access in your browser when prompted...',
        0
      )
    }, 100)
    
    // Request actual system permissions
    setTimeout(() => {
      console.log('%c🔐 REQUESTING BROWSER PERMISSIONS', 'background: #673AB7; color: white; padding: 2px 5px; border-radius: 3px;')
      requestBrowserPermissions()
    }, 500)
  }

  const requestBrowserPermissions = async () => {
    try {
      console.log('Requesting system media permissions...')
      
      // Clear any existing notifications
      clearAll()
      
      // Request microphone permission (required for both voice and video calls)
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      }

      // Add video constraints for video calls
      if (callType === 'video') {
        constraints.video = {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      }

      // This will trigger the OS-level permission dialog
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream

      // Set up local video for video calls
      if (callType === 'video' && localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        localVideoRef.current.play()
      }

      // Update permission status
      setPermissionStatus({
        microphone: 'granted',
        camera: callType === 'video' ? 'granted' : 'unknown'
      })

      console.log('System permissions granted successfully')
      
      // Show success notification
      setTimeout(() => {
        showSuccess(
          'Access Granted',
          `${callType === 'video' ? 'Camera and microphone' : 'Microphone'} access granted!\n\nYour ${callType} call is ready to start.`,
          0 // No auto-dismiss
        )
      }, 200)
      
    } catch (error: any) {
      console.error('System permission error:', error)
      
      // Clear any existing notifications first
      clearAll()
      
      let errorMessage = 'System permission denied.\n\n'
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'You denied access in the system permission dialog.\n\nTo fix this:\n• Click the camera/microphone icon in your browser address bar\n• Select "Allow" for this site\n• Or check your system privacy settings\n• Refresh the page and try again'
        setPermissionStatus({
          microphone: 'denied',
          camera: callType === 'video' ? 'denied' : 'unknown'
        })
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No microphone or camera found.\n• Check that your devices are connected\n• Try a different browser\n• Check system audio/video settings'
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Device is busy.\n• Close other applications using camera/microphone\n• Restart your browser\n• Try again'
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Camera quality too high. Trying lower quality...'
        // Retry with lower constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: callType === 'video' ? { width: 640, height: 480 } : false
          })
          localStreamRef.current = fallbackStream
          if (callType === 'video' && localVideoRef.current) {
            localVideoRef.current.srcObject = fallbackStream
            localVideoRef.current.play()
          }
          setPermissionStatus({
            microphone: 'granted',
            camera: callType === 'video' ? 'granted' : 'unknown'
          })
          
          setTimeout(() => {
            showSuccess(
              'Access Granted',
              `${callType === 'video' ? 'Camera and microphone' : 'Microphone'} access granted with lower quality.\n\nYour ${callType} call is ready.`,
              0 // No auto-dismiss
            )
          }, 200)
          return
        } catch (fallbackError) {
          errorMessage += '\n\nFallback also failed. Please check your device settings.'
        }
      } else {
        errorMessage += `Unexpected error: ${error.message}\n\nPlease try refreshing the page.`
      }
      
      setTimeout(() => {
        showError(
          'Permission Error',
          errorMessage,
          0 // No auto-dismiss
        )
      }, 200)
    }
  }

  const requestPermissionAgain = () => {
    setPermissionError('')
    requestMediaPermissions()
  }

  const handleMuteToggle = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = isMuted // Enable if currently muted, disable if currently enabled
      })
    }
    setIsMuted(!isMuted)
    console.log('Microphone', isMuted ? 'enabled' : 'disabled')
  }

  const handleVideoToggle = () => {
    if (callType === 'video' && localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = isVideoOff // Enable if currently off, disable if currently on
      })
    }
    setIsVideoOff(!isVideoOff)
    console.log('Camera', isVideoOff ? 'enabled' : 'disabled')
  }

  const handleSpeakerToggle = () => {
    setIsSpeakerOff(!isSpeakerOff)
    // In a real implementation, this would control the speaker
    console.log('Speaker', isSpeakerOff ? 'enabled' : 'disabled')
  }

  const handleParticipantsToggle = () => {
    setShowParticipants(!showParticipants)
    console.log('Participants panel', showParticipants ? 'closed' : 'opened')
  }

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings)
    console.log('Settings panel', showSettings ? 'closed' : 'opened')
  }

  const handleEndCall = () => {
    // Stop all media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      localStreamRef.current = null
    }
    
    // Reset states
    setIsMuted(false)
    setIsVideoOff(false)
    setIsSpeakerOff(false)
    setPermissionError('')
    setPermissionStatus({
      microphone: 'unknown',
      camera: 'unknown'
    })
    
    onEndCall?.()
    onClose()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0" aria-describedby="call-interface-description">
          <DialogHeader className="sr-only">
            <DialogTitle>{callType === 'video' ? 'Video' : 'Voice'} Call Interface</DialogTitle>
          </DialogHeader>
          <div id="call-interface-description" className="sr-only">
            {callType === 'video' ? 'Video' : 'Voice'} call interface with {channel.name}
          </div>
          <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {channel.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{channel.name}</h3>
                <p className="text-sm text-gray-300">
                  {callType === 'video' ? 'Video Call' : 'Voice Call'} • {formatDuration(callDuration)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
                onClick={handleParticipantsToggle}
                title="Participants"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
                onClick={handleSettingsToggle}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
                onClick={onClose}
                title="Close"
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-1 bg-gray-900 relative">
            {/* Removed old permission error overlay - now using notifications */}

            {/* Permission Status Indicators */}
            <div className="absolute top-4 left-4 flex gap-2 z-5">
              <div className={`px-2 py-1 rounded text-xs ${
                permissionStatus.microphone === 'granted' 
                  ? 'bg-green-600 text-white' 
                  : permissionStatus.microphone === 'denied'
                  ? 'bg-red-600 text-white'
                  : 'bg-yellow-600 text-white'
              }`}>
                🎤 {permissionStatus.microphone === 'granted' ? 'Mic On' : 
                     permissionStatus.microphone === 'denied' ? 'Mic Denied' : 'Mic Pending'}
              </div>
              {callType === 'video' && (
                <div className={`px-2 py-1 rounded text-xs ${
                  permissionStatus.camera === 'granted' 
                    ? 'bg-green-600 text-white' 
                    : permissionStatus.camera === 'denied'
                    ? 'bg-red-600 text-white'
                    : 'bg-yellow-600 text-white'
                }`}>
                  📹 {permissionStatus.camera === 'granted' ? 'Camera On' : 
                       permissionStatus.camera === 'denied' ? 'Camera Denied' : 'Camera Pending'}
                </div>
              )}
            </div>

            {callType === 'video' ? (
              <div className="h-full flex">
                {/* Main Video */}
                <div className="flex-1 relative">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                  />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm">Remote Participant</p>
                  </div>
                </div>
                
                {/* Local Video */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                  />
                  <div className="absolute bottom-2 left-2 text-white text-xs">
                    You
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Voice Call</h3>
                  <p className="text-gray-300">Connecting to {channel.name}...</p>
                </div>
              </div>
            )}

            {/* Participants Panel */}
            {showParticipants && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-75 rounded-lg p-4 text-white max-w-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Participants ({participants.length})</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-gray-700 p-1"
                    onClick={handleParticipantsToggle}
                  >
                    ✕
                  </Button>
                </div>
                <div className="space-y-2">
                  {participants.map((participant: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{participant.name}</span>
                        <div className="text-xs text-gray-300">{participant.role}</div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-75 rounded-lg p-4 text-white max-w-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Call Settings</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-gray-700 p-1"
                    onClick={handleSettingsToggle}
                  >
                    ✕
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Microphone</span>
                    <div className={`w-3 h-3 rounded-full ${
                      permissionStatus.microphone === 'granted' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  {callType === 'video' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Camera</span>
                      <div className={`w-3 h-3 rounded-full ${
                        permissionStatus.camera === 'granted' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Speaker</span>
                    <div className={`w-3 h-3 rounded-full ${
                      !isSpeakerOff ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div className="pt-2 border-t border-gray-600">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-white border-gray-600 hover:bg-gray-700"
                      onClick={requestPermissionAgain}
                    >
                      Refresh Permissions
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-800 p-6">
            <div className="flex items-center justify-center gap-4">
              {/* Mute Button */}
              <Button
                onClick={handleMuteToggle}
                className={`w-12 h-12 rounded-full ${
                  isMuted 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              {/* Video Toggle (only for video calls) */}
              {callType === 'video' && (
                <Button
                  onClick={handleVideoToggle}
                  className={`w-12 h-12 rounded-full ${
                    isVideoOff 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
              )}

              {/* Speaker Toggle */}
              <Button
                onClick={handleSpeakerToggle}
                className={`w-12 h-12 rounded-full ${
                  isSpeakerOff 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isSpeakerOff ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              {/* End Call Button */}
              <Button
                onClick={handleEndCall}
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications - Outside Dialog to prevent conflicts */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  )
}
