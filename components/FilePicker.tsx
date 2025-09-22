'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Paperclip
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItem {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

interface FilePickerProps {
  onFilesSelect?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export function FilePicker({ 
  onFilesSelect, 
  maxFiles = 5, 
  maxSize = 10, 
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  className 
}: FilePickerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: FileItem[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const error = validateFile(file);
      
      if (error) {
        newFiles.push({
          id: Date.now().toString() + i,
          file,
          status: 'error',
          error
        });
      } else {
        newFiles.push({
          id: Date.now().toString() + i,
          file,
          status: 'uploading',
          progress: 0
        });
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
    onFilesSelect?.(fileList);

    // Simulate upload progress
    newFiles.forEach(fileItem => {
      if (fileItem.status === 'uploading') {
        simulateUpload(fileItem.id);
      }
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'success', progress: 100 }
            : f
        ));
        clearInterval(interval);
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress }
            : f
        ));
      }
    }, 200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const fileList = e.dataTransfer.files;
    if (fileList.length > 0) {
      handleFiles(fileList);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      handleFiles(fileList);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="h-4 w-4 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <File className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragOver 
            ? "border-blue-400 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or click to select
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Max {maxFiles} files, {maxSize}MB each. Accepted: {acceptedTypes.join(', ')}
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
        >
          <Paperclip className="mr-2 h-4 w-4" />
          Choose Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Selected Files ({files.length}/{maxFiles})
            </h4>
            {files.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear All
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {files.map((fileItem) => (
              <Card key={fileItem.id}>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(fileItem.file.name)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileItem.file.name}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {formatFileSize(fileItem.file.size)}
                        </Badge>
                      </div>
                      
                      {fileItem.status === 'uploading' && (
                        <div className="mt-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${fileItem.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {Math.round(fileItem.progress || 0)}%
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {fileItem.status === 'success' && (
                        <div className="flex items-center space-x-1 mt-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">Uploaded successfully</span>
                        </div>
                      )}
                      
                      {fileItem.status === 'error' && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">{fileItem.error}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileItem.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

