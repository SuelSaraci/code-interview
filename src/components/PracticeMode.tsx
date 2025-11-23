import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Question } from '../types';
import { ArrowLeft, Clock, Lightbulb, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface PracticeModeProps {
  question: Question;
  onBack: () => void;
  onComplete: (questionId: string) => void;
  hasUnlocked: boolean;
  freeQuestionsUsed: number;
}

export function PracticeMode({ question, onBack, onComplete, hasUnlocked, freeQuestionsUsed }: PracticeModeProps) {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const isMultipleChoice = question.options && question.options.length > 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !submitted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-green-100 text-green-700 border-green-300';
      case 'mid': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'senior': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setIsRunning(false);
    onComplete(question.id);
  };

  const progressUsed = Math.min((freeQuestionsUsed / 3) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-3 sm:mb-4 -ml-2 sm:-ml-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Questions</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`${getLevelColor(question.level)} text-xs`} variant="outline">
                {question.level}
              </Badge>
              <Badge variant="outline" className="text-xs">{question.language}</Badge>
              <Badge variant="outline" className="text-xs">{question.difficulty}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-lg">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm">{formatTime(timeElapsed)}</span>
              </div>
              {question.techHint && hasUnlocked && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="gap-2"
                >
                  <Lightbulb className={`w-4 h-4 ${showHint ? 'text-yellow-500' : ''}`} />
                  <span className="hidden sm:inline">Tech Hint</span>
                  <span className="sm:hidden">Hint</span>
                </Button>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl mb-1 sm:mb-2">{question.title}</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Suggested time: {question.timeMinutes} minutes
            {question.company && ` • Asked at ${question.company}`}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Question Description */}
            <Card>
              <CardHeader>
                <CardTitle>Question</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{question.description}</p>
              </CardContent>
            </Card>

            {/* Tech Hint */}
            {showHint && question.techHint && hasUnlocked && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-900">
                    <Lightbulb className="w-5 h-5" />
                    Tech Hint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-900">{question.techHint}</p>
                </CardContent>
              </Card>
            )}

            {/* Answer Input */}
            {!submitted && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  {isMultipleChoice ? (
                    <>
                      <RadioGroup
                        value={selectedOption?.toString()}
                        onValueChange={(value) => setSelectedOption(parseInt(value))}
                      >
                        <div className="space-y-3">
                          {question.options!.map((option, index) => (
                            <div
                              key={index}
                              className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors ${
                                selectedOption === index
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                              <Label
                                htmlFor={`option-${index}`}
                                className="flex-1 cursor-pointer text-sm leading-relaxed"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                      <div className="mt-4 flex justify-end">
                        <Button onClick={handleSubmit} disabled={selectedOption === null} className="gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Submit Answer
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here... Explain your thinking and provide code examples if applicable."
                        className="min-h-48 sm:min-h-64 font-mono text-xs sm:text-sm"
                      />
                      <div className="mt-4 flex justify-end">
                        <Button onClick={handleSubmit} disabled={!answer.trim()} className="gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Submit Answer
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Results (after submission) */}
            {submitted && (
              <>
                {isMultipleChoice ? (
                  <>
                    {/* Result Card for Multiple Choice */}
                    <Card
                      className={`border-2 ${
                        selectedOption === question.correctAnswerIndex
                          ? 'border-green-500 bg-green-50'
                          : 'border-orange-500 bg-orange-50'
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          {selectedOption === question.correctAnswerIndex ? (
                            <>
                              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                              <div>
                                <p className="text-lg text-green-900">Correct! Well done!</p>
                                <p className="text-sm text-green-700">You selected the right answer</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0" />
                              <div>
                                <p className="text-lg text-orange-900">Review the correct answer</p>
                                <p className="text-sm text-orange-700">Compare your choice with the explanation below</p>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Show all options with correct answer highlighted */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Answer Options</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {question.options!.map((option, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border-2 ${
                                index === question.correctAnswerIndex
                                  ? 'border-green-500 bg-green-50'
                                  : index === selectedOption
                                  ? 'border-orange-300 bg-orange-50'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {index === question.correctAnswerIndex && (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                )}
                                {index === selectedOption && index !== question.correctAnswerIndex && (
                                  <XCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                )}
                                <p className="flex-1 text-sm">{option}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-900">
                          <CheckCircle className="w-5 h-5" />
                          Answer Submitted!
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-green-900 mb-4">
                          Great job! Review the sample answer below and compare it with your approach.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Your Answer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
                          {answer}
                        </pre>
                      </CardContent>
                    </Card>
                  </>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Sample Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
                      {question.sampleAnswer}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Explanation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{question.explanation}</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                      <AlertCircle className="w-5 h-5" />
                      Common Mistakes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-orange-900">
                      {question.commonMistakes.map((mistake, idx) => (
                        <li key={idx}>{mistake}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    Back to Library
                  </Button>
                  <Button onClick={() => window.location.reload()} className="flex-1">
                    <span className="hidden sm:inline">Try Another Question</span>
                    <span className="sm:hidden">Try Another</span>
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Free Questions Used</span>
                    <span>{freeQuestionsUsed}/3</span>
                  </div>
                  <Progress value={progressUsed} />
                </div>

                {!hasUnlocked && freeQuestionsUsed >= 3 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 mb-2">
                      You've used all free questions!
                    </p>
                    <p className="text-xs text-blue-700">
                      Unlock 200+ questions for just €2
                    </p>
                  </div>
                )}

                {hasUnlocked && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-900">
                      ✓ Premium Unlocked
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Question Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Topic:</span>
                  <span className="ml-2">{question.topic}</span>
                </div>
                <div>
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="ml-2">{question.difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <span className="ml-2">{question.timeMinutes} minutes</span>
                </div>
                {question.company && (
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <span className="ml-2">{question.company}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
