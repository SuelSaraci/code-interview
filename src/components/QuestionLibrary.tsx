import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import {
  Search,
  Filter,
  Lock,
  Shuffle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
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
import { Level, Language } from "../types";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
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
import { questionsQuerySelector } from "../state/selectors/questionsSelectors";
import { useAuth } from "../hooks/useAuth";
import { resetQuestionAttempts } from "../services/questionsService";
import { toast } from "sonner";
import { OnboardingModal } from "./OnboardingModal";
import type { QuestionLevel } from "../services/types";
import { questionsRefreshKeyState } from "../state/atoms/questionsAtoms";

const FILTERS_STORAGE_KEY = "question_library_filters_v1";

interface QuestionLibraryProps {
  onSelectQuestion: (questionId: string) => void;
  hasUnlocked: boolean;
  onUnlock: () => void;
  userPreferences?: { levels: Level[]; languages: Language[] };
}

export function QuestionLibrary({
  onSelectQuestion,
  hasUnlocked,
  onUnlock,
  userPreferences,
}: QuestionLibraryProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<QuestionLevel[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [customLanguages, setCustomLanguages] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [resetLoading, setResetLoading] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const setQuestionsRefreshKey = useSetRecoilState(questionsRefreshKeyState);

  // Load saved filters (or userPreferences) once on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(FILTERS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as {
            levels?: QuestionLevel[];
            languages?: string[];
            customLanguages?: string[];
          };
          if (parsed.levels && parsed.levels.length > 0) {
            setSelectedLevels(parsed.levels);
          } else if (userPreferences?.levels) {
            setSelectedLevels(userPreferences.levels as QuestionLevel[]);
          }
          if (parsed.languages && parsed.languages.length > 0) {
            setSelectedLanguages(parsed.languages);
          } else if (userPreferences?.languages) {
            setSelectedLanguages(userPreferences.languages);
          }
          if (parsed.customLanguages && parsed.customLanguages.length > 0) {
            setCustomLanguages(parsed.customLanguages);
          }
          return;
        }
      }
    } catch {
      // ignore parse errors and fall back to props
    }

    if (userPreferences?.levels) {
      setSelectedLevels(userPreferences.levels as QuestionLevel[]);
    }
    if (userPreferences?.languages) {
      setSelectedLanguages(userPreferences.languages);
      setCustomLanguages(userPreferences.languages);
    }
  }, [userPreferences]);

  // Fetch questions from API - MUST be called before any conditional returns
  const questionsLoadable = useRecoilValueLoadable(
    questionsQuerySelector({ enabled: !!user })
  );

  // Get questions data - handle all states
  const questionsData =
    questionsLoadable.state === "hasValue" ? questionsLoadable.contents : null;
  const questions = questionsData?.questions || [];

  // All hooks must be called unconditionally before any returns
  // Languages that exist in questions plus any custom languages from onboarding
  const availableLanguages = useMemo(() => {
    const unique = new Set<string>();
    questions.forEach((q) => unique.add(q.language));
    customLanguages.forEach((lang) => unique.add(lang));
    return Array.from(unique).sort();
  }, [questions, customLanguages]);

  const filteredQuestions = useMemo(() => {
    if (questions.length === 0) return [];
    const filtered = questions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.language.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(q.level);
      const matchesLanguage =
        selectedLanguages.length === 0 ||
        selectedLanguages.includes(q.language);

      return matchesSearch && matchesLevel && matchesLanguage;
    });
    return filtered;
  }, [questions, searchQuery, selectedLevels, selectedLanguages]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLevels, selectedLanguages]);

  // Persist filters to localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const payload = {
          levels: selectedLevels,
          languages: selectedLanguages,
          customLanguages,
        };
        window.localStorage.setItem(
          FILTERS_STORAGE_KEY,
          JSON.stringify(payload)
        );
      }
    } catch {
      // ignore write errors
    }
  }, [selectedLevels, selectedLanguages, customLanguages]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLevels, selectedLanguages]);

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

  // Handle loading state - AFTER all hooks
  if (questionsLoadable.state === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Handle error state - AFTER all hooks
  if (questionsLoadable.state === "hasError") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">
              Failed to load questions. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleLevel = (level: QuestionLevel) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
    setCurrentPage(1);
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
    setCurrentPage(1);
  };

  const getRandomFreeQuestion = () => {
    const freeQuestions = questions.filter((q) => !q.is_premium);
    if (freeQuestions.length > 0) {
      const randomQ =
        freeQuestions[Math.floor(Math.random() * freeQuestions.length)];
      navigate(`/questions/${randomQ.id}`);
    }
  };

  const lockedCount = questions.filter((q) => q.is_premium).length;

  const handleResetQuestions = async () => {
    setResetLoading(true);
    try {
      const res = await resetQuestionAttempts();
      toast.success("Question attempts reset", {
        description: `${res.deletedAttempts} attempts cleared for your account.`,
      });
      // Refetch questions so UI updates without full page reload
      setQuestionsRefreshKey((key) => key + 1);
    } catch (error: any) {
      toast.error("Failed to reset question attempts", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handlePreferencesComplete = (
    levels: Level[],
    languages: Language[]
  ) => {
    // Normalize levels to supported ones; accept all selected languages
    const normalizedLevels = (levels as QuestionLevel[]).filter((l) =>
      ["junior", "mid", "senior"].includes(l)
    );

    const uniqueLanguages = Array.from(new Set(languages));

    setSelectedLevels(normalizedLevels);
    // These are the currently active language filters
    setSelectedLanguages(uniqueLanguages);
    // Keep all languages ever added via modal so they remain visible in the sidebar
    setCustomLanguages((prev) =>
      Array.from(new Set([...prev, ...uniqueLanguages]))
    );
    setShowPreferencesModal(false);
  };

  // Filter Panel Component
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Level Filter */}
      <div>
        <Label className="mb-3 block">Level</Label>
        <div className="space-y-2">
          {(["junior", "mid", "senior"] as QuestionLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <Checkbox
                id={`level-${level}`}
                checked={selectedLevels.includes(level)}
                onCheckedChange={() => toggleLevel(level)}
              />
              <label
                htmlFor={`level-${level}`}
                className="text-sm capitalize cursor-pointer"
              >
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div>
        <Label className="mb-3 block">Language</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {availableLanguages.map((language) => (
            <div key={language} className="flex items-center gap-2">
              <Checkbox
                id={`lang-${language}`}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={() => toggleLanguage(language)}
              />
              <label
                htmlFor={`lang-${language}`}
                className="text-sm cursor-pointer"
              >
                {language}
              </label>
            </div>
          ))}
        </div>
      </div>

      {(selectedLevels.length > 0 || selectedLanguages.length > 0) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedLevels([]);
            setSelectedLanguages([]);
          }}
          className="w-full"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <OnboardingModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          onComplete={handlePreferencesComplete}
        />
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl mb-1 sm:mb-2">
                Question Library
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {filteredQuestions.length} questions available
              </p>
            </div>
            <div className="flex flex-col items-stretch sm:items-end gap-2">
              {!hasUnlocked && (
                <div className="text-left sm:text-right">
                  <Button
                    onClick={onUnlock}
                    className="gap-2 mb-1 w-full sm:w-auto"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      Unlock {lockedCount} Questions
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

          {/* Active Filters Display */}
          {(selectedLevels.length > 0 || selectedLanguages.length > 0) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  Active filters:
                </span>
                {selectedLevels.map((level) => (
                  <Badge
                    key={level}
                    className={`${getLevelColor(level)} text-xs`}
                    variant="outline"
                  >
                    {level}
                    <button
                      onClick={() => toggleLevel(level)}
                      className="ml-1.5 hover:bg-black/10 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedLanguages.map((language) => (
                  <Badge key={language} variant="outline" className="text-xs">
                    {language}
                    <button
                      onClick={() => toggleLanguage(language)}
                      className="ml-1.5 hover:bg-black/10 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedLevels([]);
                    setSelectedLanguages([]);
                  }}
                  className="h-6 text-xs"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {/* Mobile Filter Button */}
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 lg:hidden flex-1 sm:flex-none"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {(selectedLevels.length > 0 ||
                      selectedLanguages.length > 0) && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedLevels.length + selectedLanguages.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                onClick={() => setShowPreferencesModal(true)}
                className="gap-2 hidden lg:flex"
              >
                Add Languages
              </Button>

              {/* Desktop Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 hidden lg:flex"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

              <Button
                variant="outline"
                onClick={getRandomFreeQuestion}
                className="gap-2 flex-1 sm:flex-none"
              >
                <Shuffle className="w-4 h-4" />
                <span className="hidden sm:inline">Random Free</span>
                <span className="sm:hidden">Random</span>
              </Button>

              {/* Reset aligned with action buttons */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={resetLoading}
                    className="gap-2"
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        Reset
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Reset all question attempts?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently clear your attempt history and
                      correctness status for all questions. You will be able to
                      re-answer them as if they were new.
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
                        onClick={handleResetQuestions}
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
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0 hidden lg:block">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <FilterPanel />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Questions Grid */}
          <div className="flex-1 min-w-0">
            {filteredQuestions.length === 0 ? (
              <Card className="p-8 sm:p-12 text-center">
                <p className="text-gray-600 mb-2">No questions found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filters
                </p>
              </Card>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedQuestions.map((question) => {
                    const answered = question.attempted;
                    const answeredCorrect = question.isCorrect === true;
                    const answeredIncorrect = question.isCorrect === false;

                    const bgClass = answered
                      ? answeredCorrect
                        ? "bg-green-50 border-green-200"
                        : answeredIncorrect
                        ? "bg-red-50 border-red-200"
                        : "bg-yellow-50 border-yellow-200"
                      : "bg-white";

                    return (
                      <Card
                        key={question.id}
                        className={`relative border ${bgClass} ${
                          !question.is_premium || hasUnlocked
                            ? "cursor-pointer hover:shadow-lg"
                            : "opacity-75"
                        } transition-shadow border-2`}
                        onClick={() =>
                          (!question.is_premium || hasUnlocked) &&
                          navigate(`/questions/${question.id}`)
                        }
                      >
                        {question.is_premium && !hasUnlocked && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                            <div className="text-center">
                              <Lock className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-700">€2/month</p>
                            </div>
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge
                              className={getLevelColor(question.level)}
                              variant="outline"
                            >
                              {question.level}
                            </Badge>
                            {!question.is_premium ? (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700"
                              >
                                FREE
                              </Badge>
                            ) : !hasUnlocked ? (
                              <Lock className="w-4 h-4 text-gray-400" />
                            ) : null}
                          </div>
                          <CardTitle className="text-base leading-tight">
                            {question.title}
                          </CardTitle>
                          <CardDescription>
                            {question.language} • {question.duration} min
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Badge variant="outline" className="text-xs">
                              {question.difficulty}
                            </Badge>
                            {question.attempted && (
                              <Badge
                                variant="outline"
                                className={
                                  question.isCorrect === true
                                    ? "border-green-500 text-green-700"
                                    : question.isCorrect === false
                                    ? "border-red-500 text-red-600"
                                    : ""
                                }
                              >
                                {question.isCorrect === true
                                  ? "✓ Correct"
                                  : question.isCorrect === false
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
