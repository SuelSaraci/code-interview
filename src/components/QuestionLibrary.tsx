import { useState, useMemo } from 'react';
import { Search, Filter, Lock, Shuffle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Question, Level, Language } from '../types';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

interface QuestionLibraryProps {
  questions: Question[];
  onSelectQuestion: (questionId: string) => void;
  hasUnlocked: boolean;
  onUnlock: () => void;
  userPreferences?: { levels: Level[]; languages: Language[] };
}

export function QuestionLibrary({ questions, onSelectQuestion, hasUnlocked, onUnlock, userPreferences }: QuestionLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<Level[]>(userPreferences?.levels || []);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(userPreferences?.languages || []);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-green-100 text-green-700 border-green-300';
      case 'mid': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'senior': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredQuestions = useMemo(() => {
    const filtered = questions.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.language.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(q.level);
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(q.language);
      
      return matchesSearch && matchesLevel && matchesLanguage;
    });
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
    return filtered;
  }, [questions, searchQuery, selectedLevels, selectedLanguages]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  const toggleLevel = (level: Level) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
    setCurrentPage(1);
  };

  const toggleLanguage = (language: Language) => {
    setSelectedLanguages(prev =>
      prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
    );
    setCurrentPage(1);
  };

  const getRandomFreeQuestion = () => {
    const freeQuestions = questions.filter(q => q.isFree);
    if (freeQuestions.length > 0) {
      const randomQ = freeQuestions[Math.floor(Math.random() * freeQuestions.length)];
      onSelectQuestion(randomQ.id);
    }
  };

  const lockedCount = questions.filter(q => !q.isFree).length;

  // Filter Panel Component
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Level Filter */}
      <div>
        <Label className="mb-3 block">Level</Label>
        <div className="space-y-2">
          {(['junior', 'mid', 'senior'] as Level[]).map(level => (
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
        <div className="space-y-2">
          {(['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'TypeScript', 'Ruby'] as Language[]).map(language => (
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
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl mb-1 sm:mb-2">Question Library</h1>
              <p className="text-sm sm:text-base text-gray-600">
                {filteredQuestions.length} questions available
              </p>
            </div>
            {!hasUnlocked && (
              <div className="text-left sm:text-right">
                <Button onClick={onUnlock} className="gap-2 mb-2 w-full sm:w-auto">
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Unlock {lockedCount} Questions</span>
                  <span className="sm:hidden">Unlock Premium</span>
                </Button>
                <p className="text-xs sm:text-sm text-gray-600">€2/month • All levels</p>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedLevels.length > 0 || selectedLanguages.length > 0) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Active filters:</span>
                {selectedLevels.map(level => (
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
                {selectedLanguages.map(language => (
                  <Badge 
                    key={language}
                    variant="outline"
                    className="text-xs"
                  >
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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2">
              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 lg:hidden flex-1 sm:flex-none"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {(selectedLevels.length > 0 || selectedLanguages.length > 0) && (
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
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </Card>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedQuestions.map((question) => (
                  <Card
                    key={question.id}
                    className={`relative ${
                      question.isFree || hasUnlocked
                        ? 'cursor-pointer hover:shadow-lg'
                        : 'opacity-75'
                    } transition-shadow border-2`}
                    onClick={() =>
                      (question.isFree || hasUnlocked) && onSelectQuestion(question.id)
                    }
                  >
                    {!question.isFree && !hasUnlocked && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-700">€2/month</p>
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className={getLevelColor(question.level)} variant="outline">
                          {question.level}
                        </Badge>
                        {question.isFree ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            FREE
                          </Badge>
                        ) : !hasUnlocked ? (
                          <Lock className="w-4 h-4 text-gray-400" />
                        ) : null}
                      </div>
                      <CardTitle className="text-base leading-tight">{question.title}</CardTitle>
                      <CardDescription>
                        {question.language} • {question.timeMinutes} min
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {question.topic}
                        </Badge>
                        {question.company && (
                          <span className="text-xs text-gray-600">{question.company}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
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
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
