'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  X, 
  Users, 
  UserCircle,
  Shield,
  Check,
  Calendar,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User, mockUsers, getRoleDisplay, getRoleColor } from '@/lib/types/users';

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignmentData: {
    userId: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    note?: string;
  }) => void;
  taskTitle: string;
  currentAssignee?: User | null;
}

export function TaskAssignmentModal({ 
  isOpen, 
  onClose, 
  onAssign, 
  taskTitle,
  currentAssignee 
}: TaskAssignmentModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedUser(null);
      setDueDate('');
      setPriority('medium');
      setNote('');
      setSearchQuery('');
      setSelectedDepartment('all');
    }
  }, [isOpen]);

  const departments = ['all', 'Nursing', 'Cardiology', 'Pediatrics', 'Lab', 'Billing', 'Administration', 'Emergency', 'Surgery'];
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    const isNotCurrentAssignee = !currentAssignee || user.id !== currentAssignee.id;
    return matchesSearch && matchesDepartment && isNotCurrentAssignee;
  });

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleAssign = () => {
    if (selectedUser) {
      onAssign({
        userId: selectedUser.id,
        dueDate: dueDate || undefined,
        priority,
        note: note.trim() || undefined
      });
      onClose();
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Zap className="h-4 w-4" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Assign Task</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-6">
          {/* Task Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">Task</h3>
            <p className="text-sm text-gray-600">{taskTitle}</p>
            {currentAssignee && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-500">Currently assigned to:</span>
                <Badge className={cn("text-xs", getRoleColor(currentAssignee.role))}>
                  {currentAssignee.name}
                </Badge>
              </div>
            )}
          </div>

          {/* User Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to *
              </label>
              
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
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {dept === 'all' ? 'All Departments' : dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected User */}
              {selectedUser && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 truncate">
                          {selectedUser.name}
                        </span>
                        <Badge className={cn("text-xs", getRoleColor(selectedUser.role))}>
                          {selectedUser.role === 'admin' || selectedUser.role === 'owner' ? (
                            <Shield className="h-3 w-3 mr-1" />
                          ) : (
                            <UserCircle className="h-3 w-3 mr-1" />
                          )}
                          {getRoleDisplay(selectedUser.role)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {selectedUser.department} • {selectedUser.email}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(null)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Users List */}
              {!selectedUser && (
                <div className="max-h-60 overflow-y-auto space-y-1 mt-3">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors hover:bg-gray-50"
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
                            {user.role === 'admin' || user.role === 'owner' ? (
                              <Shield className="h-3 w-3 mr-1" />
                            ) : (
                              <UserCircle className="h-3 w-3 mr-1" />
                            )}
                            {getRoleDisplay(user.role)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {user.department} • {user.email}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assignment Details */}
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <Input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span>Low</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span>Medium</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span>High</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-red-600" />
                            <span>Urgent</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Note
                  </label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add any additional context or instructions..."
                    rows={3}
                    className="w-full"
                  />
                </div>

                {/* Assignment Summary */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Assignment Summary</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div><strong>Task:</strong> {taskTitle}</div>
                    <div><strong>Assign to:</strong> {selectedUser.name}</div>
                    <div><strong>Priority:</strong> 
                      <Badge className={cn("ml-2 text-xs", getPriorityColor(priority))}>
                        {getPriorityIcon(priority)}
                        <span className="ml-1 capitalize">{priority}</span>
                      </Badge>
                    </div>
                    {dueDate && <div><strong>Due:</strong> {new Date(dueDate).toLocaleString()}</div>}
                    {note && <div><strong>Note:</strong> {note}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedUser}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Assign Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
