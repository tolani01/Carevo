'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  User, 
  Mail, 
  Phone,
  Shield,
  UserX,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  location?: string;
}

const roles = [
  'Owner',
  'Admin',
  'Location Manager',
  'Provider',
  'Nurse/MA',
  'Front Desk',
  'Billing Specialist',
  'PA Coordinator',
  'Lab/Results',
  'Auditor'
];

const locations = ['Main Clinic', 'North Branch', 'South Branch', 'Urgent Care'];

export function UsersTab() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. Sarah Smith',
      email: 'sarah.smith@clinic.com',
      phone: '+1 (555) 123-4567',
      role: 'Owner',
      status: 'active',
      lastActive: '2024-01-15T10:30:00Z',
      location: 'Main Clinic'
    },
    {
      id: '2',
      name: 'Dr. Michael Johnson',
      email: 'michael.johnson@clinic.com',
      phone: '+1 (555) 123-4568',
      role: 'Provider',
      status: 'active',
      lastActive: '2024-01-15T09:15:00Z',
      location: 'Main Clinic'
    },
    {
      id: '3',
      name: 'Nurse Jennifer Williams',
      email: 'jennifer.williams@clinic.com',
      phone: '+1 (555) 123-4569',
      role: 'Nurse/MA',
      status: 'active',
      lastActive: '2024-01-15T08:45:00Z',
      location: 'North Branch'
    },
    {
      id: '4',
      name: 'MA David Davis',
      email: 'david.davis@clinic.com',
      phone: '+1 (555) 123-4570',
      role: 'Front Desk',
      status: 'inactive',
      lastActive: '2024-01-10T16:20:00Z',
      location: 'South Branch'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    location: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    const matchesRole = !roleFilter || roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = !statusFilter || statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInviteUser = () => {
    if (!inviteData.name || !inviteData.email || !inviteData.phone || !inviteData.role) {
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: inviteData.name,
      email: inviteData.email,
      phone: inviteData.phone,
      role: inviteData.role,
      status: 'pending',
      lastActive: new Date().toISOString(),
      location: inviteData.location === 'none' ? undefined : inviteData.location
    };

    setUsers([...users, newUser]);
    setInviteData({ name: '', email: '', phone: '', role: '', location: '' });
    setShowInviteModal(false);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    if (role === 'Owner' || role === 'Admin') return 'bg-purple-100 text-purple-800';
    if (role === 'Provider') return 'bg-blue-100 text-blue-800';
    if (role === 'Nurse/MA') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">People</h2>
          <p className="text-gray-600">Manage team members and their roles</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500 flex items-center">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-2 h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="mr-2 h-4 w-4" />
                        {user.phone}
                      </div>
                      {user.location && (
                        <div className="text-sm text-gray-500">
                          📍 {user.location}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        Last active: {new Date(user.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleUserStatus(user.id)}
                    className={cn(
                      user.status === 'active' 
                        ? "text-red-600 hover:text-red-700" 
                        : "text-green-600 hover:text-green-700"
                    )}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Invite New User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  value={inviteData.phone}
                  onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={inviteData.role} onValueChange={(value) => setInviteData({ ...inviteData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Location (Optional)</label>
                <Select value={inviteData.location} onValueChange={(value) => setInviteData({ ...inviteData, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No location</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteUser}>
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

