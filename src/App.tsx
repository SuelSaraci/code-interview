import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { QuestionLibrary } from './components/QuestionLibrary';
import { PracticeMode } from './components/PracticeMode';
import { CodingChallenges } from './components/CodingChallenges';
import { HintsPage } from './components/HintsPage';
import { Dashboard } from './components/Dashboard';
import { PricingPage } from './components/PricingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { PaywallModal } from './components/PaywallModal';
import { AuthModal } from './components/AuthModal';
import { useUserProgress } from './hooks/useUserProgress';
import { useAuth } from './hooks/useAuth';
import { questions } from './data/questions';
import { codingChallenges } from './data/challenges';
import { Level, Language } from './types';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type Page = 'home' | 'questions' | 'practice' | 'challenges' | 'hints' | 'pricing' | 'dashboard';
type User = { email: string; name: string } | null;

interface UserPreferences {
  levels: Level[];
  languages: Language[];
}

export default function App() {
  const { user: firebaseUser, loading: authLoading, logout: firebaseLogout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Convert Firebase user to app user format
  const user: User = firebaseUser ? {
    email: firebaseUser.email,
    name: firebaseUser.name
  } : null;
  
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    // Load preferences from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userPreferences');
      return stored ? JSON.parse(stored) : { levels: [], languages: [] };
    }
    return { levels: [], languages: [] };
  });
  
  const {
    progress,
    completeQuestion,
    unlockAll,
    canAccessQuestion,
    shouldShowPaywall
  } = useUserProgress();

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  const selectedQuestion = selectedQuestionId 
    ? questions.find(q => q.id === selectedQuestionId)
    : null;

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedQuestionId(null);
  };

  const handleStartFree = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (levels: Level[], languages: Language[]) => {
    // Save user preferences
    setUserPreferences({ levels, languages });
    
    // Navigate to questions page
    setCurrentPage('questions');
    toast.success('Preferences saved! Browse questions matching your selections.');
  };

  const handleSelectQuestion = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Check if user can access this question
    if (canAccessQuestion(question.isFree)) {
      setSelectedQuestionId(questionId);
      setCurrentPage('practice');
    } else if (shouldShowPaywall(question.isFree)) {
      setShowPaywall(true);
    } else {
      // Not free and haven't used all free questions yet
      toast.error('Complete your free questions first or unlock premium access');
    }
  };

  const handleCompleteQuestion = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      completeQuestion(questionId, question.isFree);
      
      if (question.isFree && progress.freeQuestionsUsed + 1 >= 3) {
        toast.success('Question completed! You\'ve used all free questions.', {
          description: 'Unlock premium for full access to 200+ questions'
        });
      } else {
        toast.success('Question completed!');
      }
    }
  };

  const handleUnlock = () => {
    setShowPaywall(true);
  };

  const handleUnlockComplete = () => {
    unlockAll();
    toast.success('🎉 Premium unlocked! You now have access to all questions.');
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setShowAuth(true);
  };

  const handleAuthSuccess = (userData: { email: string; name: string }) => {
    // User is automatically set via useAuth hook when Firebase auth state changes
    toast.success(`Welcome ${userData.name}! 👋`);
  };

  const handleLogout = async () => {
    const result = await firebaseLogout();
    if (result.success) {
      toast.info('Logged out successfully');
    } else {
      toast.error(result.error || 'Failed to logout');
    }
  };

  const handleLoginRequired = () => {
    setAuthMode('login');
    setShowAuth(true);
    toast.info('Please login to continue');
  };

  const handleBackFromPractice = () => {
    setCurrentPage('questions');
    setSelectedQuestionId(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        hasUnlocked={progress.hasUnlocked}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && (
        <HomePage
          questions={questions}
          onStartFree={handleStartFree}
          onSelectQuestion={handleSelectQuestion}
          onUnlock={handleUnlock}
          hasUnlocked={progress.hasUnlocked}
        />
      )}

      {currentPage === 'questions' && (
        <QuestionLibrary
          questions={questions}
          onSelectQuestion={handleSelectQuestion}
          hasUnlocked={progress.hasUnlocked}
          onUnlock={handleUnlock}
          userPreferences={userPreferences}
        />
      )}

      {currentPage === 'practice' && selectedQuestion && (
        <PracticeMode
          question={selectedQuestion}
          onBack={handleBackFromPractice}
          onComplete={handleCompleteQuestion}
          hasUnlocked={progress.hasUnlocked}
          freeQuestionsUsed={progress.freeQuestionsUsed}
        />
      )}

      {currentPage === 'challenges' && (
        <CodingChallenges
          challenges={codingChallenges}
          hasUnlocked={progress.hasUnlocked}
          onUnlock={handleUnlock}
        />
      )}

      {currentPage === 'hints' && <HintsPage />}

      {currentPage === 'dashboard' && (
        <Dashboard
          completedQuestions={progress.questionsCompleted}
          questions={questions}
          onSelectQuestion={handleSelectQuestion}
          hasUnlocked={progress.hasUnlocked}
        />
      )}

      {currentPage === 'pricing' && (
        <PricingPage
          hasUnlocked={progress.hasUnlocked}
          onUnlock={handleUnlock}
        />
      )}

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUnlock={handleUnlockComplete}
        user={user}
        onLoginRequired={handleLoginRequired}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthSuccess={handleAuthSuccess}
        mode={authMode}
      />

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Made with ❤️ for future devs</p>
            <p className="text-sm">
              © 2025 InterviewPrep Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
}
