export type Level = 'junior' | 'mid' | 'senior';
export type Language = 'HTML' | 'CSS' | 'JavaScript' | 'TypeScript' | 'Python' | 'Ruby' | 'Java' | 'React' | 'Node.js' | 'SQL';
export type Topic = 'Frontend' | 'Backend' | 'Database' | 'Algorithm' | 'System Design';

export interface Question {
  id: string;
  title: string;
  level: Level;
  language: Language;
  topic: Topic;
  timeMinutes: number;
  isFree: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company?: string;
  description: string;
  sampleAnswer: string;
  explanation: string;
  commonMistakes: string[];
  techHint?: string;
  // Multiple choice fields (optional)
  options?: string[];
  correctAnswerIndex?: number;
}

export interface UserProgress {
  questionsCompleted: string[];
  freeQuestionsUsed: number;
  hasUnlocked: boolean;
  accuracy: { [key in Level]?: number };
  languageStats: { [key: string]: number };
  streak: number;
  lastActiveDate: string;
}

export interface Hint {
  id: string;
  category: 'Behavioral' | 'Technical Mindset' | 'Negotiation' | 'Remote Etiquette';
  title: string;
  description: string;
  tips: string[];
}

export interface CodingChallenge {
  id: string;
  title: string;
  level: Level;
  language: Language;
  description: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  isFree: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}
