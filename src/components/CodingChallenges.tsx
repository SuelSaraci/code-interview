import { useState, useMemo } from 'react';
import { Code, Lock, Trophy, ArrowRight, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { CodingChallenge, Level } from '../types';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';

interface CodingChallengesProps {
  challenges: CodingChallenge[];
  hasUnlocked: boolean;
  onUnlock: () => void;
}

export function CodingChallenges({ challenges, hasUnlocked, onUnlock }: CodingChallengesProps) {
  const [selectedLevel, setSelectedLevel] = useState<Level>('junior');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-green-100 text-green-700 border-green-300';
      case 'mid': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'senior': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => c.level === selectedLevel);
  }, [challenges, selectedLevel]);

  const currentChallenge = filteredChallenges[currentChallengeIndex];
  const canAccess = currentChallenge?.isFree || hasUnlocked;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    setTotalAttempts(prev => prev + 1);
    
    if (selectedAnswer === currentChallenge.correctAnswerIndex) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentChallengeIndex < filteredChallenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Reset to first challenge
      setCurrentChallengeIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleLevelChange = (level: Level) => {
    setSelectedLevel(level);
    setCurrentChallengeIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  if (!currentChallenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Card className="p-8 text-center">
            <p className="text-gray-600">No challenges available for this level</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl mb-1 sm:mb-2">Coding Challenges</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Test your knowledge with multiple-choice coding questions
              </p>
            </div>
            {!hasUnlocked && (
              <Button onClick={onUnlock} className="gap-2 w-full sm:w-auto">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Unlock All Challenges</span>
                <span className="sm:hidden">Unlock Premium</span>
              </Button>
            )}
          </div>

          {/* Level Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['junior', 'mid', 'senior'] as Level[]).map(level => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                onClick={() => handleLevelChange(level)}
                className={`capitalize ${selectedLevel === level ? '' : getLevelColor(level)}`}
              >
                {level}
              </Button>
            ))}
          </div>

          {/* Progress Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-1">{currentChallengeIndex + 1}/{filteredChallenges.length}</div>
                  <p className="text-xs sm:text-sm text-gray-600">Challenge Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-1">{correctCount}/{totalAttempts}</div>
                  <p className="text-xs sm:text-sm text-gray-600">Correct Answers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-1">{accuracy}%</div>
                  <p className="text-xs sm:text-sm text-gray-600">Accuracy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Challenge Card */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className={`${!canAccess ? 'relative' : ''}`}>
              {!canAccess && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10 p-6">
                  <Lock className="w-12 h-12 text-blue-600 mb-3" />
                  <p className="text-lg mb-2 text-center">Premium Challenge</p>
                  <p className="text-sm text-gray-600 text-center mb-4">Unlock all challenges for €2/month</p>
                  <Button onClick={onUnlock}>Unlock Now</Button>
                </div>
              )}
              
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className={`${getLevelColor(currentChallenge.level)} text-xs`} variant="outline">
                    {currentChallenge.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{currentChallenge.language}</Badge>
                  <Badge variant="outline" className="text-xs">{currentChallenge.difficulty}</Badge>
                  {currentChallenge.isFree && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      FREE
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl sm:text-2xl">{currentChallenge.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm mb-2 text-gray-600">Challenge:</h3>
                  <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                    {currentChallenge.description}
                  </p>
                </div>

                {/* Options */}
                {canAccess && !showResult && (
                  <div>
                    <h3 className="text-sm mb-3 text-gray-600">Select your answer:</h3>
                    <RadioGroup
                      value={selectedAnswer?.toString()}
                      onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                    >
                      <div className="space-y-3">
                        {currentChallenge.options.map((option, index) => (
                          <div
                            key={index}
                            className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors ${
                              selectedAnswer === index
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label
                              htmlFor={`option-${index}`}
                              className="flex-1 cursor-pointer font-mono text-xs sm:text-sm leading-relaxed"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className="gap-2"
                        size="lg"
                      >
                        Submit Answer
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Result */}
                {canAccess && showResult && (
                  <div className="space-y-4">
                    {/* Correct/Incorrect Message */}
                    <Card
                      className={`border-2 ${
                        selectedAnswer === currentChallenge.correctAnswerIndex
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          {selectedAnswer === currentChallenge.correctAnswerIndex ? (
                            <>
                              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                              <div>
                                <p className="text-lg text-green-900">Correct! Well done!</p>
                                <p className="text-sm text-green-700">You selected the right answer</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                              <div>
                                <p className="text-lg text-red-900">Not quite right</p>
                                <p className="text-sm text-red-700">Review the explanation below</p>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Show all options with correct answer highlighted */}
                    <div>
                      <h3 className="text-sm mb-3 text-gray-600 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Answer Options:
                      </h3>
                      <div className="space-y-2">
                        {currentChallenge.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-2 ${
                              index === currentChallenge.correctAnswerIndex
                                ? 'border-green-500 bg-green-50'
                                : index === selectedAnswer
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {index === currentChallenge.correctAnswerIndex && (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              )}
                              {index === selectedAnswer && index !== currentChallenge.correctAnswerIndex && (
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              )}
                              <p className="flex-1 font-mono text-xs sm:text-sm">{option}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-blue-900 flex items-center gap-2 text-lg">
                          <Lightbulb className="w-5 h-5" />
                          Explanation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-blue-900">{currentChallenge.explanation}</p>
                      </CardContent>
                    </Card>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button onClick={handleNext} size="lg" className="gap-2">
                        {currentChallengeIndex < filteredChallenges.length - 1 ? 'Next Challenge' : 'Start Over'}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Accuracy</span>
                    <span>{accuracy}%</span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                </div>
                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correct:</span>
                    <span className="text-green-600">{correctCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Incorrect:</span>
                    <span className="text-red-600">{totalAttempts - correctCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span>{totalAttempts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Level</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getLevelColor(selectedLevel)} mb-3`} variant="outline">
                  {selectedLevel}
                </Badge>
                <p className="text-sm text-gray-600">
                  {selectedLevel === 'junior' && 'Perfect for beginners learning the fundamentals'}
                  {selectedLevel === 'mid' && 'Intermediate concepts and practical applications'}
                  {selectedLevel === 'senior' && 'Advanced topics and complex scenarios'}
                </p>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <span className="block mb-1">Available challenges:</span>
                    <span className="text-lg">{filteredChallenges.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Upsell */}
            {!hasUnlocked && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <Lock className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-sm text-blue-900 mb-2">Unlock Premium</p>
                  <p className="text-xs text-blue-700 mb-4">
                    Get access to all {challenges.filter(c => !c.isFree).length} premium challenges across all levels
                  </p>
                  <Button onClick={onUnlock} size="sm" className="w-full">
                    Upgrade for €2/month
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
