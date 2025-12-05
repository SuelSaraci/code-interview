import React, { useState, useMemo } from "react";
import { useRecoilValueLoadable, useSetRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { Search, Lock, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { practicesQuerySelector } from "../state/selectors/practicesSelectors";
import { useAuth } from "../hooks/useAuth";
import type { QuestionLevel } from "../services/types";
import { resetPracticeAttempts } from "../services/practicesService";
import { toast } from "sonner";
import { practicesRefreshKeyState } from "../state/atoms/practicesAtoms";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export function PracticesList() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<QuestionLevel | "all">(
    "all"
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [resetLoading, setResetLoading] = useState(false);
  const setPracticesRefreshKey = useSetRecoilState(practicesRefreshKeyState);
  // Subscribe to refresh key changes to ensure component re-renders when it updates
  const practicesRefreshKey = useRecoilValue(practicesRefreshKeyState);

  // Always call hooks in the same order – enable flag controls whether API is used
  const practicesLoadable = useRecoilValueLoadable(
    practicesQuerySelector({ enabled: !!user })
  );

  const practicesData =
    practicesLoadable.state === "hasValue" ? practicesLoadable.contents : null;
  const practices = practicesData?.practices || [];

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

  // Get unique languages from practices
  const languages = useMemo(() => {
    const unique = new Set(practices.map((p) => p.language));
    return Array.from(unique).sort();
  }, [practices]);

  // Filter practices
  const filteredPractices = useMemo(() => {
    return practices.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.language.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel = selectedLevel === "all" || p.level === selectedLevel;
      const matchesLanguage =
        selectedLanguage === "all" || p.language === selectedLanguage;

      return matchesSearch && matchesLevel && matchesLanguage;
    });
  }, [practices, searchQuery, selectedLevel, selectedLanguage]);

  const handlePracticeClick = (practiceId: number) => {
    navigate(`/practices/${practiceId}`);
  };

  const handleResetPractices = async () => {
    setResetLoading(true);
    try {
      const res = await resetPracticeAttempts();
      toast.success("Practice attempts reset", {
        description: `${res.deletedAttempts} attempts cleared for your account.`,
      });
      // Refetch practices so UI updates without full page reload
      setPracticesRefreshKey((key) => key + 1);
    } catch (error: any) {
      toast.error("Failed to reset practices", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  // Wait for auth before hitting protected API
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-gray-700 text-center mb-4">
              Please log in to view practice questions.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle loading state for practices
  if (practicesLoadable.state === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading practices...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (practicesLoadable.state === "hasError") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">
              Failed to load practices. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl mb-1 sm:mb-2">
              Practice Questions
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Test your knowledge with multiple choice questions
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={resetLoading}
                className="gap-2 w-full sm:w-auto"
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Reset Practice Attempts
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Reset all practice attempts?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently clear your attempt history and
                  correctness status for all practice questions. You will be
                  able to re-answer them as if they were new.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild disabled={resetLoading}>
                  <Button variant="outline" disabled={resetLoading}>
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild disabled={resetLoading}>
                  <Button
                    onClick={handleResetPractices}
                    disabled={resetLoading}
                    variant="destructive"
                  >
                    {resetLoading ? "Resetting..." : "Apply"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search practices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Level:</span>
              <div className="flex gap-2">
                <Button
                  variant={selectedLevel === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedLevel === "junior" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel("junior")}
                >
                  Junior
                </Button>
                <Button
                  variant={selectedLevel === "mid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel("mid")}
                >
                  Mid
                </Button>
                <Button
                  variant={selectedLevel === "senior" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel("senior")}
                >
                  Senior
                </Button>
              </div>
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md bg-white"
              >
                <option value="all">All</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Practices Grid */}
        {filteredPractices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPractices.map((practice) => {
              const answered = practice.attempted;
              const answeredCorrect = practice.isCorrect === true;
              const answeredIncorrect = practice.isCorrect === false;

              const bgClass = answered
                ? answeredCorrect
                  ? "bg-green-50 border-green-200"
                  : answeredIncorrect
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
                : "bg-white";

              return (
                <Card
                  key={practice.id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow border-2 ${bgClass}`}
                  onClick={() => handlePracticeClick(practice.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {practice.title}
                      </CardTitle>
                      {practice.is_premium && (
                        <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {practice.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge
                        className={getLevelColor(practice.level)}
                        variant="outline"
                      >
                        {practice.level}
                      </Badge>
                      <Badge variant="secondary">{practice.language}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {practice.difficulty}
                      </Badge>
                      {practice.attempted && (
                        <Badge
                          variant="outline"
                          className={
                            practice.isCorrect === true
                              ? "border-green-500 text-green-700"
                              : practice.isCorrect === false
                              ? "border-red-500 text-red-600"
                              : ""
                          }
                        >
                          {practice.isCorrect === true
                            ? "✓ Correct"
                            : practice.isCorrect === false
                            ? "✗ Incorrect"
                            : "Attempted"}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">
                No practices found. Try adjusting your filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
