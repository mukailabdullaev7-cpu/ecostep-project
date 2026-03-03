export type GameType = 'sorting' | 'quiz' | 'ecoroute' | 'habits';

export type BadgeType = 'sorting' | 'quiz' | 'ecoroute' | 'habits';

export interface UserProgress {
  name: string;
  completedGames: GameType[];
  unlockedBadges: BadgeType[];
  quizScore?: number;
}

export interface GameCompletion {
  gameType: GameType;
  completedAt: string;
}

export interface LessonData {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface HabitItem {
  id: string;
  text: string;
  completed: boolean;
  isGood: boolean;
  energyCost: number;
  ecoPoints: number;
}
