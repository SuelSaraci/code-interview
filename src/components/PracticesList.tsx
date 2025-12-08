import React, { useState, useMemo, useEffect } from "react";
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
import type { QuestionLevel, Practice } from "../services/types";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PracticesListProps {
  onUnlock: () => void;
  hasUnlocked: boolean;
  hasPremium?: boolean;
}

interface LockedPracticeCard {
  id: string;
  isLocked: true;
  level: QuestionLevel;
  language: string;
}

type PracticeOrLocked = Practice | LockedPracticeCard;

export function PracticesList({ onUnlock, hasUnlocked, hasPremium: hasPremiumProp }: PracticesListProps) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<QuestionLevel | "all">(
    "all"
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [resetLoading, setResetLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
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
  // Use prop if provided, otherwise fall back to data from API
  const hasPremium = hasPremiumProp ?? practicesData?.hasPremium ?? false;

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

  // Create dummy locked cards when hasPremium is false
  const lockedCards = useMemo((): LockedPracticeCard[] => {
    if (hasPremium) return [];
    
    // Create enough locked cards to fill the grid (at least 9-12 cards)
    // We'll create cards with different levels and languages for variety
    const levels: QuestionLevel[] = ["junior", "mid", "senior"];
    const languages = ["JavaScript", "Python", "React", "Node.js", "TypeScript", "Java", "SQL", "Ruby", "HTML", "CSS"];
    
    return Array.from({ length: 30 }, (_, i) => ({
      id: `locked-practice-${i}`,
      isLocked: true as const,
      level: levels[i % levels.length] as QuestionLevel,
      language: languages[i % languages.length],
    }));
  }, [hasPremium]);

  // Combine filtered practices with locked cards when hasPremium is false
  const allPracticesWithLocked = useMemo((): PracticeOrLocked[] => {
    if (hasPremium) {
      return filteredPractices;
    }
    // When hasPremium is false, show free practices first, then locked cards
    return [...filteredPractices, ...lockedCards];
  }, [filteredPractices, lockedCards, hasPremium]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLevel, selectedLanguage]);

  const totalPages = Math.ceil(allPracticesWithLocked.length / itemsPerPage);
  const paginatedPractices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allPracticesWithLocked.slice(startIndex, startIndex + itemsPerPage);
  }, [allPracticesWithLocked, currentPage, itemsPerPage]);

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
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl mb-1 sm:mb-2">
                Practice Questions
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {hasPremium
                  ? filteredPractices.length
                  : practicesData?.count || 0}{" "}
                practices available
              </p>
            </div>
            <div className="flex flex-col items-stretch sm:items-end gap-2">
              {!hasPremium && (
                <div className="text-left sm:text-right">
                  <Button
                    onClick={onUnlock}
                    className="gap-2 mb-1 w-full sm:w-auto"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      Unlock All Premium Practices
                    </span>
                    <span className="sm:hidden">Unlock Premium</span>
                  </Button>
                  <p className="text-xs sm:text-sm text-gray-600">
                    €2/month • All levels
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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
        {allPracticesWithLocked.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginatedPractices.map((practice) => {
              // Check if this is a locked card
              const isLockedCard = 'isLocked' in practice && practice.isLocked === true;
              
              if (isLockedCard) {
                const lockedCard = practice as LockedPracticeCard;
                return (
                  <Card
                    key={lockedCard.id}
                    className="relative border bg-white cursor-pointer hover:shadow-lg transition-shadow border-2 opacity-75"
                    onClick={() => onUnlock()}
                  >
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-700">€2/month</p>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg line-clamp-2 blur-sm">
                          Premium Practice
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2 blur-sm">
                        Practice your skills with this premium question
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge
                          className={getLevelColor(lockedCard.level)}
                          variant="outline"
                        >
                          {lockedCard.level}
                        </Badge>
                        <Badge variant="secondary" className="blur-sm">{lockedCard.language}</Badge>
                        <Badge variant="outline" className="text-xs blur-sm">
                          Medium
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              const realPractice = practice as Practice;
              const answered = realPractice.attempted;
              const answeredCorrect = realPractice.isCorrect === true;
              const answeredIncorrect = realPractice.isCorrect === false;

              const bgClass = answered
                ? answeredCorrect
                  ? "bg-green-50 border-green-200"
                  : answeredIncorrect
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
                : "bg-white";

              return (
                <Card
                  key={realPractice.id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow border-2 ${bgClass}`}
                  onClick={() => handlePracticeClick(realPractice.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {realPractice.title}
                      </CardTitle>
                      {realPractice.is_premium && !hasUnlocked && (
                        <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {realPractice.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge
                        className={getLevelColor(realPractice.level)}
                        variant="outline"
                      >
                        {realPractice.level}
                      </Badge>
                      <Badge variant="secondary">{realPractice.language}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {realPractice.difficulty}
                      </Badge>
                      {realPractice.attempted && (
                        <Badge
                          variant="outline"
                          className={
                            realPractice.isCorrect === true
                              ? "border-green-500 text-green-700"
                              : realPractice.isCorrect === false
                              ? "border-red-500 text-red-600"
                              : ""
                          }
                        >
                          {realPractice.isCorrect === true
                            ? "✓ Correct"
                            : realPractice.isCorrect === false
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from(
                      { length: totalPages },
                      (_, i) => i + 1
                    ).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
