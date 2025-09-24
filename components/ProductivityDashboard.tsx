'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award,
  Fire,
  Star,
  BarChart3,
  ExternalLink
} from 'lucide-react';

interface ProductivityStats {
  todayCompleted: number;
  thisWeekCompleted: number;
  thisMonthCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  averagePerDay: number;
  bestDay: { date: string; count: number };
  monthlyGoal: number;
  goalProgress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProductivityDashboardProps {
  userId?: string;
  onViewHistory?: () => void;
}

export function ProductivityDashboard({ userId, onViewHistory }: ProductivityDashboardProps) {
  const [stats, setStats] = useState<ProductivityStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        setLoading(true);
        
        // Mock productivity data - in real app, fetch from API
        const mockStats: ProductivityStats = {
          todayCompleted: 7,
          thisWeekCompleted: 23,
          thisMonthCompleted: 89,
          currentStreak: 12,
          longestStreak: 28,
          totalCompleted: 247,
          averagePerDay: 4.2,
          bestDay: { date: '2024-12-15', count: 12 },
          monthlyGoal: 100,
          goalProgress: 89
        };

        const mockAchievements: Achievement[] = [
          {
            id: 'streak-7',
            title: 'Week Warrior',
            description: 'Complete tasks for 7 consecutive days',
            icon: '🔥',
            unlockedAt: new Date('2024-12-20'),
            rarity: 'rare'
          },
          {
            id: 'productivity-master',
            title: 'Productivity Master',
            description: 'Complete 200 tasks total',
            icon: '🏆',
            unlockedAt: new Date('2024-12-18'),
            rarity: 'epic'
          },
          {
            id: 'speed-demon',
            title: 'Speed Demon',
            description: 'Complete 10 tasks in one day',
            icon: '⚡',
            unlockedAt: new Date('2024-12-15'),
            rarity: 'legendary'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStats(mockStats);
        setAchievements(mockAchievements);
      } catch (error) {
        console.error('Error fetching productivity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductivityData();
  }, [userId]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today!";
    if (streak < 3) return "Great start! Keep it going!";
    if (streak < 7) return "Building momentum! 🔥";
    if (streak < 14) return "You're on fire! 🔥🔥";
    if (streak < 30) return "Incredible streak! 🔥🔥🔥";
    return "Legendary consistency! 👑";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Productivity Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Productivity Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-600">Complete your first task to see your productivity stats!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Completions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.todayCompleted}</p>
                <p className="text-xs text-gray-500">tasks completed</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">{stats.currentStreak}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Fire className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">{stats.thisMonthCompleted}</p>
                <p className="text-xs text-gray-500">tasks completed</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Completed */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCompleted}</p>
                <p className="text-xs text-gray-500">all time</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Monthly Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Goal: {stats.monthlyGoal} tasks</span>
              <span className="text-sm text-gray-600">{stats.thisMonthCompleted} / {stats.monthlyGoal}</span>
            </div>
            <Progress value={(stats.goalProgress / stats.monthlyGoal) * 100} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {stats.monthlyGoal - stats.thisMonthCompleted} tasks remaining
              </span>
              <span className="font-medium text-green-600">
                {Math.round((stats.goalProgress / stats.monthlyGoal) * 100)}% complete
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Message */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Fire className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{getStreakMessage(stats.currentStreak)}</p>
              <p className="text-sm text-gray-600">
                {stats.currentStreak > 0 
                  ? `You've completed tasks for ${stats.currentStreak} consecutive days!`
                  : "Complete a task today to start your streak!"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{achievement.title}</span>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.averagePerDay}</p>
              <p className="text-sm text-gray-600">Avg per day</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.longestStreak}</p>
              <p className="text-sm text-gray-600">Best streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.bestDay.count}</p>
              <p className="text-sm text-gray-600">Best day</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.thisWeekCompleted}</p>
              <p className="text-sm text-gray-600">This week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={onViewHistory} className="flex-1">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Full History
        </Button>
        <Button variant="outline" className="flex-1">
          <ExternalLink className="h-4 w-4 mr-2" />
          Set Goals
        </Button>
      </div>
    </div>
  );
}
