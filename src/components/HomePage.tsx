import { Lock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Question } from '../types';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  questions: Question[];
  onStartFree: () => void;
  onSelectQuestion: (questionId: string) => void;
  onUnlock: () => void;
  hasUnlocked: boolean;
}

const generalHints = [
  {
    title: 'STAR Method',
    description: 'Structure behavioral answers: Situation → Task → Action → Result',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    title: 'Ask Clarifying Questions',
    description: 'Never assume. Always clarify requirements and edge cases before coding',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    title: 'Whiteboard Tips',
    description: 'Think out loud, start simple, test examples, iterate don\'t erase',
    color: 'bg-green-50 border-green-200'
  },
  {
    title: 'Time Complexity',
    description: 'Always analyze and state Big O notation for your solutions',
    color: 'bg-orange-50 border-orange-200'
  }
];

export function HomePage({ questions, onStartFree, onSelectQuestion, onUnlock, hasUnlocked }: HomePageProps) {
  const [currentHint, setCurrentHint] = useState(0);
  
  const freeQuestions = questions.filter(q => q.isFree).slice(0, 3);
  const lockedQuestions = questions.filter(q => !q.isFree).slice(0, 3);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior': return 'bg-green-100 text-green-700 border-green-300';
      case 'mid': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'senior': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const nextHint = () => {
    setCurrentHint((prev) => (prev + 1) % generalHints.length);
  };

  const prevHint = () => {
    setCurrentHint((prev) => (prev - 1 + generalHints.length) % generalHints.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Your Path to Interview Success</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-4">
            Ace Any Interview
            <br />
            Junior to Senior
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 px-4">
            Master HTML, CSS, JavaScript, Python, React, Node.js, and more
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-4">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-lg whitespace-nowrap">
              3 Free Questions
            </span>
            <span className="text-gray-400">then</span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg whitespace-nowrap">
              €2/month for All Levels
            </span>
          </div>

          <Button size="lg" onClick={onStartFree} className="gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            Start Free
          </Button>
        </div>

        {/* Hero Image */}
        <div className="mb-12 sm:mb-16 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1566915896913-549d796d2166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBjb2RpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYxOTU0MzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Developer workspace"
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
          />
        </div>

        {/* Free Questions */}
        <div className="mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl mb-1 sm:mb-2">Free Questions</h2>
              <p className="text-sm sm:text-base text-gray-600">Start your journey with these complimentary questions</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 w-fit">
              FREE
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {freeQuestions.map((question) => (
              <Card
                key={question.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2"
                onClick={() => onSelectQuestion(question.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={getLevelColor(question.level)} variant="outline">
                      {question.level}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      FREE
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{question.title}</CardTitle>
                  <CardDescription>
                    {question.language} • {question.timeMinutes} min
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{question.difficulty}</Badge>
                    {question.company && (
                      <span className="text-xs">Asked at {question.company}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Locked Questions */}
        <div className="mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl mb-1 sm:mb-2">Premium Questions</h2>
              <p className="text-sm sm:text-base text-gray-600">Unlock 200+ questions for all levels with €2/month</p>
            </div>
            {!hasUnlocked && (
              <Button onClick={onUnlock} className="gap-2 w-fit">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">€2/month</span>
                <span className="sm:hidden">Unlock</span>
              </Button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {lockedQuestions.map((question) => (
              <Card
                key={question.id}
                className={`relative ${!hasUnlocked ? 'opacity-75' : 'cursor-pointer hover:shadow-lg'} transition-shadow border-2`}
                onClick={() => hasUnlocked && onSelectQuestion(question.id)}
              >
                {!hasUnlocked && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-700">€2/month</p>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={getLevelColor(question.level)} variant="outline">
                      {question.level}
                    </Badge>
                    {!hasUnlocked && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{question.title}</CardTitle>
                  <CardDescription>
                    {question.language} • {question.timeMinutes} min
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{question.difficulty}</Badge>
                    {question.company && (
                      <span className="text-xs">Asked at {question.company}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Hints Carousel */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-center">Free Interview Hints</h2>
          
          <div className="relative max-w-2xl mx-auto">
            <Card className={`${generalHints[currentHint].color} border-2`}>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{generalHints[currentHint].title}</CardTitle>
                <CardDescription className="text-gray-700 text-sm sm:text-base">
                  {generalHints[currentHint].description}
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Button variant="outline" size="sm" onClick={prevHint}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-2">
                {generalHints.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentHint ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={nextHint}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl text-white">
          <h2 className="text-2xl sm:text-3xl mb-3 sm:mb-4">Ready to Start?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-blue-100">
            Try 3 questions free, then unlock all questions for all levels at €2/month
          </p>
          <Button size="lg" variant="secondary" onClick={onStartFree}>
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}
