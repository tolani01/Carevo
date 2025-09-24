'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Phone, Calendar, Activity, MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'away';
  lastActive: string;
  joinedDate: string;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksOverdue: number;
  performance: {
    efficiency: number;
    onTimeCompletion: number;
    responseTime: string;
  };
}

interface UserDetailPageProps {
  params: { id: string };
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search context from URL params
  const fromSearch = searchParams.get('from') === 'search';
  const searchQuery = searchParams.get('query') || '';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Mock user data - in real app, fetch from API
        const mockUser: UserProfile = {
          id: params.id,
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@carevo.com',
          phone: '+1 (555) 123-4567',
          role: 'Physician',
          department: 'Internal Medicine',
          avatar: '/avatars/sarah-johnson.jpg',
          status: 'active',
          lastActive: '2024-12-23T16:30:00Z',
          joinedDate: '2023-01-15T00:00:00Z',
          tasksCompleted: 247,
          tasksInProgress: 12,
          tasksOverdue: 2,
          performance: {
            efficiency: 94,
            onTimeCompletion: 89,
            responseTime: '2.3 hours'
          }
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(mockUser);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleBack = () => {
    if (fromSearch && searchQuery) {
      // Return to search with query
      router.push(`/board?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // Return to board
      router.push('/board');
    }
  };

  const getStatusColor = (status: UserProfile['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'away': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <User className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">User not found</h2>
            <p className="text-gray-600 mb-4">The user you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {fromSearch ? 'Search' : 'Board'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {fromSearch ? 'Search Results' : 'Board'}
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{user.role}</span>
                  <span>•</span>
                  <span>{user.department}</span>
                  <span>•</span>
                  <span>Joined: {new Date(user.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge className={getStatusColor(user.status)}>
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <a href={`mailto:${user.email}`} className="text-sm text-blue-600 hover:underline">
                      {user.email}
                    </a>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Phone:</span>
                      <a href={`tel:${user.phone}`} className="text-sm text-blue-600 hover:underline">
                        {user.phone}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Last Active:</span>
                    <span className="text-sm font-medium">
                      {new Date(user.lastActive).toLocaleDateString()} at {new Date(user.lastActive).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(user.performance.efficiency)}`}>
                      {user.performance.efficiency}%
                    </div>
                    <div className="text-sm text-gray-600">Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(user.performance.onTimeCompletion)}`}>
                      {user.performance.onTimeCompletion}%
                    </div>
                    <div className="text-sm text-gray-600">On-Time Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.performance.responseTime}
                    </div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Task Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {user.tasksCompleted}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.tasksInProgress}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {user.tasksOverdue}
                    </div>
                    <div className="text-sm text-gray-600">Overdue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline">
                    View Tasks
                  </Button>
                  <Button variant="outline">
                    Schedule Meeting
                  </Button>
                  <Button variant="outline">
                    View Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Completed "Review Lab Results"</span>
                    <span className="text-gray-400 ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Started "Patient Follow-up"</span>
                    <span className="text-gray-400 ml-auto">4h ago</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                    <span>Replied to team message</span>
                    <span className="text-gray-400 ml-auto">6h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <a href="/user/user-2" className="text-blue-600 hover:underline">
                      Dr. Michael Chen
                    </a>
                    <span className="text-gray-400 ml-2">• Physician</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <a href="/user/user-3" className="text-blue-600 hover:underline">
                      Nurse Jennifer Lee
                    </a>
                    <span className="text-gray-400 ml-2">• Nurse</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <a href="/user/user-4" className="text-blue-600 hover:underline">
                      Dr. Robert Smith
                    </a>
                    <span className="text-gray-400 ml-2">• Specialist</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
