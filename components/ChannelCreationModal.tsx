'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  X, 
  Users, 
  Hash, 
  Shield, 
  UserCircle,
  Check,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'provider' | 'auditor';
  department?: string;
  avatar?: string;
  isOnline?: boolean;
}

interface ChannelCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (channelData: {
    name: string;
    description: string;
    type: 'public' | 'private';
    members: string[];
  }) => void;
}

// Mock users data - in real app, this would come from API
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@carevo.dev',
    role: 'provider',
    department: 'Cardiology',
    isOnline: true
  },
  {
    id: '2',
    name: 'Nurse Mike Chen',
    email: 'mike.chen@carevo.dev',
    role: 'provider',
    department: 'Nursing',
    isOnline: true
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@carevo.dev',
    role: 'provider',
    department: 'Pediatrics',
    isOnline: false
  },
  {
    id: '4',
    name: 'Lisa Wang',
    email: 'lisa.wang@carevo.dev',
    role: 'admin',
    department: 'Administration',
    isOnline: true
  },
  {
    id: '5',
    name: 'Tom Anderson',
    email: 'tom.anderson@carevo.dev',
    role: 'provider',
    department: 'Lab',
    isOnline: false
  },
  {
    id: '6',
    name: 'Maria Garcia',
    email: 'maria.garcia@carevo.dev',
    role: 'provider',
    department: 'Billing',
    isOnline: true
  }
];

export function ChannelCreationModal({ isOpen, onClose, onCreateChannel }: ChannelCreationModalProps) {
  const [step, setStep] = useState<'details' | 'members'>('details');
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [channelType, setChannelType] = useState<'public' | 'private'>('private');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setChannelName('');
      setChannelDescription('');
      setChannelType('private');
      setSelectedMembers([]);
      setSearchQuery('');
      setSelectedDepartment('all');
    }
  }, [isOpen]);

  const departments = ['all', 'Nursing', 'Cardiology', 'Pediatrics', 'Lab', 'Billing', 'Administration'];
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleNext = () => {
    if (step === 'details' && channelName.trim()) {
      setStep('members');
    }
  };

  const handleCreate = () => {
    if (channelName.trim() && selectedMembers.length > 0) {
      onCreateChannel({
        name: channelName.trim(),
        description: channelDescription.trim(),
        type: channelType,
        members: selectedMembers
      });
      onClose();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'owner':
        return <Shield className="h-4 w-4" />;
      default:
        return <UserCircle className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
      case 'owner':
        return 'bg-purple-100 text-purple-700';
      case 'provider':
        return 'bg-blue-100 text-blue-700';
      case 'auditor':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Hash className="h-4 w-4 text-white" />
            </div>
            <span>Create New Channel</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {step === 'details' ? (
            <div className="space-y-6">
              {/* Channel Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name *
                </label>
                <Input
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="e.g., Cardiology Team, Patient Room 201"
                  className="w-full"
                />
              </div>

              {/* Channel Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  placeholder="What is this channel for?"
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Channel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Channel Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="channelType"
                      value="private"
                      checked={channelType === 'private'}
                      onChange={(e) => setChannelType(e.target.value as 'public' | 'private')}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Private Channel</div>
                      <div className="text-sm text-gray-500">Only invited members can join</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="channelType"
                      value="public"
                      checked={channelType === 'public'}
                      onChange={(e) => setChannelType(e.target.value as 'public' | 'private')}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Public Channel</div>
                      <div className="text-sm text-gray-500">Anyone in the organization can join</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!channelName.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Next: Add Members
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex space-x-2 overflow-x-auto">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm whitespace-nowrap",
                        selectedDepartment === dept
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {dept === 'all' ? 'All Departments' : dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Members Count */}
              {selectedMembers.length > 0 && (
                <div className="flex items-center space-x-2 p-3 bg-indigo-50 rounded-lg">
                  <Users className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-900">
                    {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              )}

              {/* Users List */}
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleMemberToggle(user.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                      selectedMembers.includes(user.id)
                        ? "bg-indigo-100 border border-indigo-200"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 truncate">
                          {user.name}
                        </span>
                        <Badge className={cn("text-xs", getRoleColor(user.role))}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {user.department} • {user.email}
                      </div>
                    </div>
                    
                    {selectedMembers.includes(user.id) && (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep('details')}
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={selectedMembers.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Channel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
