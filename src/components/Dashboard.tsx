import { useRecoilValueLoadable } from "recoil";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Trophy,
  Target,
  Flame,
  Clock,
  TrendingUp,
  BookOpen,
  Loader2,
} from "lucide-react";
import { dashboardSelector } from "../state/selectors/dashboardSelectors";
import { useAuth } from "../hooks/useAuth";

interface DashboardProps {
  onSelectQuestion: (questionId: string) => void;
  hasUnlocked: boolean;
}

export function Dashboard({ onSelectQuestion, hasUnlocked }: DashboardProps) {
  const { user } = useAuth();
  const dashboardLoadable = useRecoilValueLoadable(dashboardSelector(!!user));

  const getLevelColor = (level: string) => {
    switch (level) {
      case "junior":
        return "bg-green-100 text-green-700 border-green-300";
      case "mid":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "senior":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Handle loading state
  if (dashboardLoadable.state === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (dashboardLoadable.state === "hasError") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">
              Failed to load dashboard data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dashboard = dashboardLoadable.contents;

  // Provide default values to ensure dashboard always renders, even with zeros/empty data
  const {
    totals = {
      completedQuestions: 0,
      freeQuestionsUsed: 0,
      freeQuestionLimit: 3,
    },
    streak = { currentDays: 0 },
    timing = { avgTimeMinutes: null },
    progressByLevel = [],
    topLanguages = [],
    recentActivity = [],
    recommendedNext = [],
  } = dashboard || {};

  const formatTime = (minutes: number | null) => {
    if (minutes === null) return "N/A";
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl mb-1 sm:mb-2">Your Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track your progress and keep learning
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm">
                Total Completed
              </CardTitle>
              <Trophy className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">
                {totals.completedQuestions}
              </div>
              <p className="text-xs text-gray-600 mt-1">questions completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm">
                Free Questions
              </CardTitle>
              <Target className="w-4 h-4 text-green-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">
                {totals.freeQuestionsUsed}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                out of {totals.freeQuestionLimit} free
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm">
                Current Streak
              </CardTitle>
              <Flame className="w-4 h-4 text-orange-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{streak.currentDays}</div>
              <p className="text-xs text-gray-600 mt-1">days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm">Avg. Time</CardTitle>
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">
                {formatTime(timing.avgTimeMinutes)}
              </div>
              <p className="text-xs text-gray-600 mt-1">per question</p>
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
              <CardDescription>
                See how you're doing at each level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {progressByLevel.map((levelProgress) => (
                <div key={levelProgress.level}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getLevelColor(levelProgress.level)}
                        variant="outline"
                      >
                        {levelProgress.level === "junior"
                          ? "Junior"
                          : levelProgress.level === "mid"
                          ? "Mid-Level"
                          : "Senior"}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {levelProgress.completed}/{levelProgress.total}
                      </span>
                    </div>
                    <span className="text-sm">{levelProgress.percentage}%</span>
                  </div>
                  <Progress value={levelProgress.percentage} className="h-2" />
                </div>
              ))}
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
                  {topLanguages.map((lang) => (
                    <div
                      key={lang.language}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{lang.language}</span>
                      <Badge variant="secondary">{lang.count}</Badge>
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
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => onSelectQuestion(activity.id.toString())}
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{activity.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={`${getLevelColor(
                              activity.level
                            )} text-xs`}
                            variant="outline"
                          >
                            {activity.level}
                          </Badge>
                          <span className="text-xs text-gray-600">
                            {activity.language}
                          </span>
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
              {recommendedNext.length > 0 ? (
                <div className="space-y-3">
                  {recommendedNext.map((question) => (
                    <div
                      key={question.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => onSelectQuestion(question.id.toString())}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{question.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={`${getLevelColor(
                              question.level
                            )} text-xs`}
                            variant="outline"
                          >
                            {question.level}
                          </Badge>
                          <span className="text-xs text-gray-600">
                            {question.language}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600 mb-4">
                    {hasUnlocked
                      ? "You've completed all available questions!"
                      : "Unlock premium to see more recommendations"}
                  </p>
                  {!hasUnlocked && <Button size="sm">Unlock Premium</Button>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
