import { UserProgress, GameType, BadgeType } from '../types';

const STORAGE_KEY = 'eco_platform_user';

const defaultUserProgress: UserProgress = {
  name: '',
  completedGames: [],
  unlockedBadges: [],
};

export const saveUserProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save user progress:', error);
  }
};

export const getUserProgress = (): UserProgress | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as UserProgress;
  } catch (error) {
    console.error('Failed to load user progress:', error);
    return null;
  }
};

export const saveUserName = (name: string): void => {
  const progress = getUserProgress() || defaultUserProgress;
  progress.name = name;
  saveUserProgress(progress);
};

export const completeGame = (gameType: GameType): void => {
  const progress = getUserProgress() || defaultUserProgress;

  if (!progress.completedGames.includes(gameType)) {
    progress.completedGames.push(gameType);
  }

  const badgeMap: Record<GameType, BadgeType> = {
    sorting: 'sorting',
    quiz: 'quiz',
    ecoroute: 'ecoroute',
    habits: 'habits',
  };

  const badge = badgeMap[gameType];
  if (badge && !progress.unlockedBadges.includes(badge)) {
    progress.unlockedBadges.push(badge);
  }

  saveUserProgress(progress);
};

export const saveQuizScore = (score: number): void => {
  const progress = getUserProgress() || defaultUserProgress;
  progress.quizScore = score;
  saveUserProgress(progress);
};

export const clearUserProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user progress:', error);
  }
};

export const isGameCompleted = (gameType: GameType): boolean => {
  const progress = getUserProgress();
  return progress?.completedGames.includes(gameType) || false;
};

export const isBadgeUnlocked = (badgeType: BadgeType): boolean => {
  const progress = getUserProgress();
  return progress?.unlockedBadges.includes(badgeType) || false;
};
