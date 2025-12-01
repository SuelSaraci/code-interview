import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { QuestionLibrary } from "./components/QuestionLibrary";
import { QuestionDetail } from "./components/QuestionDetail";
import { PracticeMode } from "./components/PracticeMode";
import { PracticesList } from "./components/PracticesList";
import { PracticeDetail } from "./components/PracticeDetail";
import { CodingChallenges } from "./components/CodingChallenges";
import { HintsPage } from "./components/HintsPage";
import { Dashboard } from "./components/Dashboard";
import { PricingPage } from "./components/PricingPage";
import { OnboardingModal } from "./components/OnboardingModal";
import { PaywallModal } from "./components/PaywallModal";
import { AuthModal } from "./components/AuthModal";
import { useUserProgress } from "./hooks/useUserProgress";
import { useAuth } from "./hooks/useAuth";
import { questions } from "./data/questions";
import { codingChallenges } from "./data/challenges";
import { Level, Language } from "./types";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

type User = { email: string; name: string } | null;

interface UserPreferences {
  levels: Level[];
  languages: Language[];
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user: firebaseUser,
    loading: authLoading,
    logout: firebaseLogout,
  } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Convert Firebase user to app user format
  const user: User = firebaseUser
    ? {
        email: firebaseUser.email,
        name: firebaseUser.name,
      }
    : null;

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(
    () => {
      // Load preferences from localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("userPreferences");
        return stored ? JSON.parse(stored) : { levels: [], languages: [] };
      }
      return { levels: [], languages: [] };
    }
  );

  const {
    progress,
    completeQuestion,
    unlockAll,
    canAccessQuestion,
    shouldShowPaywall,
  } = useUserProgress();

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Redirect logic: logged in users from "/" to "/dashboard", non-logged in users from "/dashboard" to "/"
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (user && location.pathname === "/") {
      // Check if user needs onboarding
      const hasCompletedOnboarding =
        (typeof window !== "undefined" &&
          localStorage.getItem("onboardingCompleted") === "true") ||
        (userPreferences.levels.length > 0 &&
          userPreferences.languages.length > 0);

      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else if (!user && location.pathname === "/dashboard") {
      navigate("/", { replace: true });
    }
  }, [user, location.pathname, navigate, authLoading, userPreferences]);

  // Get current page from location pathname
  const currentPage =
    location.pathname === "/" ? "home" : location.pathname.slice(1);

  const handleStartFree = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (levels: Level[], languages: Language[]) => {
    // Save user preferences
    setUserPreferences({ levels, languages });

    // Mark onboarding as completed
    if (typeof window !== "undefined") {
      localStorage.setItem("onboardingCompleted", "true");
    }

    // Navigate to dashboard after onboarding
    navigate("/dashboard");
    toast.success(
      "Preferences saved! Browse questions matching your selections."
    );
  };

  const handleSelectQuestion = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    // Check if user can access this question
    if (canAccessQuestion(question.isFree)) {
      navigate(`/practice/${questionId}`);
    } else if (shouldShowPaywall(question.isFree)) {
      setShowPaywall(true);
    } else {
      // Not free and haven't used all free questions yet
      toast.error(
        "Complete your free questions first or unlock premium access"
      );
    }
  };

  const handleCompleteQuestion = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      completeQuestion(questionId, question.isFree);

      if (question.isFree && progress.freeQuestionsUsed + 1 >= 3) {
        toast.success("Question completed! You've used all free questions.", {
          description: "Unlock premium for full access to 200+ questions",
        });
      } else {
        toast.success("Question completed!");
      }
    }
  };

  const handleUnlock = () => {
    setShowPaywall(true);
  };

  const handleUnlockComplete = () => {
    unlockAll();
    toast.success("🎉 Premium unlocked! You now have access to all questions.");
  };

  const handleLogin = () => {
    setAuthMode("login");
    setShowAuth(true);
  };

  const handleSignup = () => {
    setAuthMode("signup");
    setShowAuth(true);
  };

  const handleAuthSuccess = (userData: { email: string; name: string }) => {
    // User is automatically set via useAuth hook when Firebase auth state changes
    toast.success(`Welcome ${userData.name}! 👋`);

    // Check if user has completed onboarding (has preferences saved)
    const hasCompletedOnboarding =
      userPreferences.levels.length > 0 && userPreferences.languages.length > 0;

    if (!hasCompletedOnboarding) {
      // Show onboarding modal after login
      setShowOnboarding(true);
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = async () => {
    const result = await firebaseLogout();
    if (result.success) {
      toast.info("Logged out successfully");
      navigate("/");
    } else {
      toast.error(result.error || "Failed to logout");
    }
  };

  const handleLoginRequired = () => {
    setAuthMode("login");
    setShowAuth(true);
    toast.info("Please login to continue");
  };

  const handleBackFromPractice = () => {
    navigate("/questions");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentPage={currentPage}
        hasUnlocked={progress.hasUnlocked}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProtectedRouteClick={handleLoginRequired}
      />

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <HomePage
                questions={questions}
                onStartFree={handleStartFree}
                onSelectQuestion={handleSelectQuestion}
                onUnlock={handleUnlock}
                hasUnlocked={progress.hasUnlocked}
                onLoginRequired={handleLoginRequired}
              />
            )
          }
        />
        <Route
          path="/questions"
          element={
            user ? (
              <QuestionLibrary
                onSelectQuestion={handleSelectQuestion}
                hasUnlocked={progress.hasUnlocked}
                onUnlock={handleUnlock}
                userPreferences={userPreferences}
              />
            ) : (
              <ProtectedRoute
                onLoginRequired={() => {
                  setAuthMode("login");
                  setShowAuth(true);
                }}
              />
            )
          }
        />
        <Route
          path="/questions/:id"
          element={
            user ? (
              <QuestionDetail />
            ) : (
              <ProtectedRoute
                onLoginRequired={() => {
                  setAuthMode("login");
                  setShowAuth(true);
                }}
              />
            )
          }
        />
        <Route path="/practice/:questionId" element={<PracticeModeWrapper />} />
        <Route
          path="/practices"
          element={
            user ? (
              <PracticesList />
            ) : (
              <ProtectedRoute
                onLoginRequired={() => {
                  setAuthMode("login");
                  setShowAuth(true);
                }}
              />
            )
          }
        />
        <Route
          path="/practices/:id"
          element={
            user ? (
              <PracticeDetail />
            ) : (
              <ProtectedRoute
                onLoginRequired={() => {
                  setAuthMode("login");
                  setShowAuth(true);
                }}
              />
            )
          }
        />
        <Route
          path="/challenges"
          element={
            <CodingChallenges
              challenges={codingChallenges}
              hasUnlocked={progress.hasUnlocked}
              onUnlock={handleUnlock}
            />
          }
        />
        <Route
          path="/hints"
          element={
            user ? (
              <HintsPage />
            ) : (
              <ProtectedRoute
                onLoginRequired={() => {
                  setAuthMode("login");
                  setShowAuth(true);
                }}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                onSelectQuestion={handleSelectQuestion}
                hasUnlocked={progress.hasUnlocked}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/pricing"
          element={
            user ? (
              <PricingPage
                hasUnlocked={progress.hasUnlocked}
                onUnlock={handleUnlock}
              />
            ) : (
              <ProtectedRoute
                onLoginRequired={() => {
                  setAuthMode("login");
                  setShowAuth(true);
                }}
              />
            )
          }
        />
      </Routes>

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

// Protected Route Component - shows login modal and redirects to home
function ProtectedRoute({ onLoginRequired }: { onLoginRequired: () => void }) {
  useEffect(() => {
    onLoginRequired();
  }, [onLoginRequired]);

  return <Navigate to="/" replace />;
}

// Wrapper component for PracticeMode to handle URL params
function PracticeModeWrapper() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { progress, completeQuestion, canAccessQuestion, shouldShowPaywall } =
    useUserProgress();

  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    navigate("/questions");
    return null;
  }

  // Check if user can access this question
  if (!canAccessQuestion(question.isFree)) {
    if (shouldShowPaywall(question.isFree)) {
      // This will be handled by the parent App component's paywall state
      navigate("/questions");
      return null;
    } else {
      navigate("/questions");
      return null;
    }
  }

  const handleComplete = (qId: string) => {
    const q = questions.find((qu) => qu.id === qId);
    if (q) {
      completeQuestion(qId, q.isFree);

      if (q.isFree && progress.freeQuestionsUsed + 1 >= 3) {
        toast.success("Question completed! You've used all free questions.", {
          description: "Unlock premium for full access to 200+ questions",
        });
      } else {
        toast.success("Question completed!");
      }
    }
  };

  return (
    <PracticeMode
      question={question}
      onBack={() => navigate("/questions")}
      onComplete={handleComplete}
      hasUnlocked={progress.hasUnlocked}
      freeQuestionsUsed={progress.freeQuestionsUsed}
    />
  );
}
