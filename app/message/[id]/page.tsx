'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, User, Clock, Reply, MoreHorizontal } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: string;
  senderRole: string;
  channel: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
  replies?: Message[];
}

interface MessageDetailPageProps {
  params: { id: string };
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search context from URL params
  const fromSearch = searchParams.get('from') === 'search';
  const searchQuery = searchParams.get('query') || '';

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        // Mock message data - in real app, fetch from API
        const mockMessage: Message = {
          id: params.id,
          content: 'Patient John Smith\'s lab results are ready for review. Please check the CBC and CMP results. The glucose levels are elevated at 180 mg/dL.',
          sender: 'Dr. Sarah Johnson',
          senderRole: 'Physician',
          channel: 'Clinical Team',
          timestamp: '2024-12-23T14:30:00Z',
          type: 'text',
          attachments: [
            {
              name: 'lab-results-john-smith.pdf',
              type: 'PDF',
              size: '2.3 MB',
              url: '/files/lab-results-john-smith.pdf'
            }
          ],
          replies: [
            {
              id: 'reply-1',
              content: 'Thanks for the update. I\'ll review the results and follow up with the patient.',
              sender: 'Dr. Michael Chen',
              senderRole: 'Physician',
              channel: 'Clinical Team',
              timestamp: '2024-12-23T15:45:00Z',
              type: 'text'
            }
          ]
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessage(mockMessage);
      } catch (err) {
        setError('Failed to load message details');
        console.error('Error fetching message:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [params.id]);

  const handleBack = () => {
    if (fromSearch && searchQuery) {
      // Return to search with query
      router.push(`/board?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // Return to chat
      router.push('/chat');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
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

  if (error || !message) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Message not found</h2>
            <p className="text-gray-600 mb-4">The message you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {fromSearch ? 'Search' : 'Chat'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { date, time } = formatTimestamp(message.timestamp);

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
            Back to {fromSearch ? 'Search Results' : 'Chat'}
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Message Details</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Message ID: {message.id}</span>
                <span>•</span>
                <span>Channel: {message.channel}</span>
                <span>•</span>
                <span>{date} at {time}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline">
                {message.type}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Message Content
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {message.sender.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{message.sender}</span>
                        <Badge variant="secondary" className="text-xs">
                          {message.senderRole}
                        </Badge>
                        <span className="text-sm text-gray-500">{time}</span>
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                            <span className="text-red-600 text-xs font-medium">PDF</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Replies */}
            {message.replies && message.replies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Replies ({message.replies.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {message.replies.map((reply) => {
                      const replyTime = formatTimestamp(reply.timestamp);
                      return (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {reply.sender.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{reply.sender}</span>
                              <Badge variant="secondary" className="text-xs">
                                {reply.senderRole}
                              </Badge>
                              <span className="text-xs text-gray-500">{replyTime.time}</span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reply Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline">
                    Forward
                  </Button>
                  <Button variant="outline">
                    Mark as Read
                  </Button>
                  <Button variant="outline">
                    Star Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Message Info */}
            <Card>
              <CardHeader>
                <CardTitle>Message Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Sender:</span>
                  <span className="text-sm font-medium">{message.sender}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Channel:</span>
                  <span className="text-sm font-medium">{message.channel}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Sent:</span>
                  <span className="text-sm font-medium">{date} at {time}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Related Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <a href="/message/msg-2" className="text-blue-600 hover:underline">
                      Patient Follow-up Discussion
                    </a>
                    <span className="text-gray-400 ml-2">• 2 hours ago</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <a href="/message/msg-3" className="text-blue-600 hover:underline">
                      Lab Results Notification
                    </a>
                    <span className="text-gray-400 ml-2">• 1 day ago</span>
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
