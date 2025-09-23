'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { 
  Paperclip, 
  Image, 
  File, 
  X, 
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function FileUpload({ 
  onFileSelect, 
  maxFiles = 5, 
  maxSize = 10,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*']
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      return `File type not supported. Allowed: ${acceptedTypes.join(', ')}`
    }

    return null
  }

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: File[] = []
    const newErrors: Record<string, string> = {}

    Array.from(selectedFiles).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        newErrors[file.name] = error
      } else {
        newFiles.push(file)
      }
    })

    // Check max files limit
    if (files.length + newFiles.length > maxFiles) {
      newErrors['limit'] = `Maximum ${maxFiles} files allowed`
    }

    setErrors(newErrors)
    
    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      onFileSelect(updatedFiles)
    }
  }, [files, maxFiles, maxSize, acceptedTypes, onFileSelect])

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFileSelect(updatedFiles)
  }

  const simulateUpload = async (file: File) => {
    return new Promise<void>((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve()
        }
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
      }, 200)
    })
  }

  const handleUpload = async () => {
    setUploading(true)
    setErrors({})

    try {
      for (const file of files) {
        await simulateUpload(file)
      }
      
      // Clear files after successful upload
      setFiles([])
      onFileSelect([])
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        data-testid="file-input"
      />

      {/* Upload Button */}
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || files.length >= maxFiles}
        className="w-full"
      >
        <Paperclip className="h-4 w-4 mr-2" />
        Attach Files
        {files.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            {files.length}
          </Badge>
        )}
      </Button>

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="space-y-1" role="alert">
          {Object.entries(errors).map(([key, error]) => (
            <div key={key} className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-600">
                {getFileIcon(file)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                
                {/* Upload Progress */}
                {uploading && uploadProgress[file.name] !== undefined && (
                  <div className="mt-2" aria-live="polite">
                    <Progress value={uploadProgress[file.name]} className="h-1" />
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={uploading}
                className="p-1"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
