// Shared API types matching the backend documentation

export type QuestionLevel = "junior" | "mid" | "senior";
export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export interface ErrorResponse {
  error: string;
  message?: string;
  [key: string]: unknown;
}

export interface HealthResponse {
  status: "ok";
  timestamp: string;
}

// Auth
export interface AuthUser {
  uid: string;
  email: string | null;
}

export interface VerifyAuthResponse {
  success: true;
  user: AuthUser;
}

// Questions
export interface Question {
  id: number;
  title: string;
  description: string;
  language: string;
  difficulty: QuestionDifficulty;
  level: QuestionLevel;
  duration: number;
  source: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  attempted?: boolean;
}

export interface GetQuestionsQuery {
  language?: string;
  level?: QuestionLevel;
  difficulty?: QuestionDifficulty;
}

export interface GetQuestionsResponse {
  success: true;
  count: number;
  hasPremium: boolean;
  questions: Question[];
}

export interface GetQuestionByIdResponse {
  success: true;
  question: Question;
}

// Practices
export interface Practice {
  id: number;
  title: string;
  description: string;
  language: string;
  difficulty: QuestionDifficulty;
  level: QuestionLevel;
  duration: number;
  question_text: string;
  options: string[];
  correct_answer?: number;
  explanation: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  attempted?: boolean;
  isCorrect?: boolean | null;
}

export interface GetPracticesQuery {
  language?: string;
  level?: QuestionLevel;
  difficulty?: QuestionDifficulty;
}

export interface GetPracticesResponse {
  success: true;
  count: number;
  hasPremium: boolean;
  practices: Practice[];
}

export interface PracticeDetail extends Practice {
  showAnswer: boolean;
}

export interface GetPracticeByIdResponse {
  success: true;
  practice: PracticeDetail;
}

export interface SubmitPracticeAnswerRequest {
  selectedAnswer: number;
}

export interface SubmitPracticeAnswerResponse {
  success: true;
  isCorrect: boolean;
  correctAnswer: number;
  explanation: string | null;
}

// Subscriptions
export type PlanType = "free" | "premium";

export interface SubscriptionRecord {
  id?: number;
  user_id?: number;
  lemonsqueezy_subscription_id?: string | null;
  status: "inactive" | "active" | "cancelled" | string;
  plan_type: PlanType;
  created_at?: string;
  updated_at?: string;
  email?: string;
  lemonSqueezeData?: unknown;
}

export interface CreateSubscriptionCheckoutResponse {
  success: true;
  checkout_url: string;
  checkout_id: string | number;
}

export interface GetSubscriptionStatusResponse {
  success: true;
  subscription: SubscriptionRecord;
}

// Dashboard
export interface DashboardTotals {
  completedQuestions: number;
  freeQuestionsUsed: number;
  freeQuestionLimit: number;
}

export interface DashboardStreak {
  currentDays: number;
}

export interface DashboardTiming {
  avgTimeMinutes: number | null;
}

export interface LevelProgress {
  level: QuestionLevel;
  completed: number;
  total: number;
  percentage: number;
}

export interface TopLanguage {
  language: string;
  count: number;
}

export interface RecentQuestionActivity {
  id: number;
  title: string;
  language: string;
  level: QuestionLevel;
  difficulty: QuestionDifficulty;
  attemptedAt: string;
}

export interface RecommendedQuestion {
  id: number;
  title: string;
  language: string;
  level: QuestionLevel;
  difficulty: QuestionDifficulty;
}

export interface DashboardData {
  totals: DashboardTotals;
  streak: DashboardStreak;
  timing: DashboardTiming;
  progressByLevel: LevelProgress[];
  topLanguages: TopLanguage[];
  recentActivity: RecentQuestionActivity[];
  recommendedNext: RecommendedQuestion[];
}

export interface GetDashboardResponse {
  success: true;
  dashboard: DashboardData;
}


