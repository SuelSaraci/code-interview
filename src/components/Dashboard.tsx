import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Question } from '../types';
import { Trophy, Target, Flame, Clock, TrendingUp, BookOpen } from 'lucide-react';

interface DashboardProps {
  completedQuestions: string[];
  questions: Question[];
  onSelectQuestion: (questionId: string) => void;
  hasUnlocked: boolean;
}

export function Dashboard({ completedQuestions, questions, onSelectQuestion, hasUnlocked }: DashboardProps) {
  // Calculate stats
  const totalCompleted = completedQuestions.length;
  const freeCompleted = questions.filter(q => q.isFree && completedQuestions.includes(q.id)).length;
  
  const levelStats = {
    junior: {
      completed: questions.filter(q => q.level === 'junior' && completedQuestions.includes(q.id)).length,
      total: questions.filter(q => q.level === 'junior').length
    },
    mid: {
      completed: questions.filter(q => q.level === 'mid' && completedQuestions.includes(q.id)).length,
      total: questions.filter(q => q.level === 'mid').length
    },
    senior: {
      completed: questions.filter(q => q.level === 'senior' && completedQuestions.includes(q.id)).length,
      total: questions.filter(q => q.level === 'senior').length
    }
  };

  const languageStats: { [key: string]: number } = {};
  questions.forEach(q => {
    if (completedQuestions.includes(q.id)) {
      languageStats[q.language] = (languageStats[q.language] || 0) + 1;
    }
  });

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const recentQuestions = questions
    .filter(q => completedQuestions.includes(q.id))
    .slice(-5)
    .reverse();

  const recommendedQuestions = questions
    .filter(q => !completedQuestions.includes(q.id) && (q.isFree || hasUnlocked))
    .slice(0, 3);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-green-100 text-green-700 border-green-300';
      case 'mid': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'senior': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const calculateAccuracy = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl mb-1 sm:mb-2">Your Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your progress and keep learning</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm">Total Completed</CardTitle>
              <Trophy className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{totalCompleted}</div>
              <p className="text-xs text-gray-600 mt-1">
                {questions.length} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm">Free Questions</CardTitle>
              <Target className="w-4 h-4 text-green-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{freeCompleted}</div>
              <p className="text-xs text-gray-600 mt-1">
                out of 3 free
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm">Current Streak</CardTitle>
              <Flame className="w-4 h-4 text-orange-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">3</div>
              <p className="text-xs text-gray-600 mt-1">
                days in a row
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm">Avg. Time</CardTitle>
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">18m</div>
              <p className="text-xs text-gray-600 mt-1">
                per question
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Progress by Level */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progress by Level
              </CardTitle>
              <CardDescription>See how you're doing at each level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getLevelColor('junior')} variant="outline">
                      Junior
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {levelStats.junior.completed}/{levelStats.junior.total}
                    </span>
                  </div>
                  <span className="text-sm">
                    {calculateAccuracy(levelStats.junior.completed, levelStats.junior.total)}%
                  </span>
                </div>
                <Progress 
                  value={calculateAccuracy(levelStats.junior.completed, levelStats.junior.total)} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getLevelColor('mid')} variant="outline">
                      Mid-Level
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {levelStats.mid.completed}/{levelStats.mid.total}
                    </span>
                  </div>
                  <span className="text-sm">
                    {calculateAccuracy(levelStats.mid.completed, levelStats.mid.total)}%
                  </span>
                </div>
                <Progress 
                  value={calculateAccuracy(levelStats.mid.completed, levelStats.mid.total)} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getLevelColor('senior')} variant="outline">
                      Senior
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {levelStats.senior.completed}/{levelStats.senior.total}
                    </span>
                  </div>
                  <span className="text-sm">
                    {calculateAccuracy(levelStats.senior.completed, levelStats.senior.total)}%
                  </span>
                </div>
                <Progress 
                  value={calculateAccuracy(levelStats.senior.completed, levelStats.senior.total)} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Languages Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Top Languages</CardTitle>
              <CardDescription>Your most practiced languages</CardDescription>
            </CardHeader>
            <CardContent>
              {topLanguages.length > 0 ? (
                <div className="space-y-3">
                  {topLanguages.map(([language, count]) => (
                    <div key={language} className="flex items-center justify-between">
                      <span className="text-sm">{language}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center py-8">
                  No questions completed yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your last completed questions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentQuestions.length > 0 ? (
                <div className="space-y-3">
                  {recentQuestions.map(q => (
                    <div
                      key={q.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => onSelectQuestion(q.id)}
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{q.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getLevelColor(q.level)} variant="outline" className="text-xs">
                            {q.level}
                          </Badge>
                          <span className="text-xs text-gray-600">{q.language}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center py-8">
                  No completed questions yet. Start practicing!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recommended */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recommended Next
              </CardTitle>
              <CardDescription>Questions to try next</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendedQuestions.length > 0 ? (
                <div className="space-y-3">
                  {recommendedQuestions.map(q => (
                    <div
                      key={q.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => onSelectQuestion(q.id)}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{q.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getLevelColor(q.level)} variant="outline" className="text-xs">
                            {q.level}
                          </Badge>
                          <span className="text-xs text-gray-600">{q.language}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600 mb-4">
                    {hasUnlocked ? 'You\'ve completed all available questions!' : 'Unlock premium to see more recommendations'}
                  </p>
                  {!hasUnlocked && (
                    <Button size="sm">Unlock Premium</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
