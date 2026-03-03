import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Импорт наших компонентов интерфейса
import WelcomeModal from './components/WelcomeModal';
import Navigation from './components/Navigation';

// Импорт страниц 
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import GamesPage from './pages/GamesPage';
import ProgressPage from './pages/ProgressPage';

// Импорт игровых модулей. логика каждой игры в отдельной папке
import SortingGame from './games/SortingGame';
import QuizGame from './games/QuizGame';
import EcoRouteGame from './games/EcoRouteGame';
import HabitsGame from './games/HabitsGame';

// Функции для работы с локальным хранилищем (сохранение прогресса)
import { getUserProgress, saveUserName, completeGame, saveQuizScore } from './utils/storage';
import { GameType } from './types';

// Типы для страниц, чтобы TypeScript не ругался на ошибки в навигации
type Page = 'home' | 'lessons' | 'games' | 'progress';

function App() {
  // Состояния (State) для управления данными внутри приложения
  const [userName, setUserName] = useState<string>(''); // Имя пользователя
  const [showWelcome, setShowWelcome] = useState(true); // Показ приветственного окна
  const [currentPage, setCurrentPage] = useState<Page>('home'); // Текущая страница
  const [currentGame, setCurrentGame] = useState<GameType | null>(null); // Выбранная игра

  // Проверяем при запуске, заходил ли пользователь раньше
  useEffect(() => {
    const progress = getUserProgress();
    if (progress && progress.name) {
      setUserName(progress.name);
      setShowWelcome(false);
    }
  }, []);

  // Обработка ввода имени в начале
  const handleWelcomeSubmit = (name: string) => {
    setUserName(name);
    saveUserName(name); // Сохраняем в localStorage
    setShowWelcome(false);
  };

  // Функция для переключения страниц
  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setCurrentGame(null); // Сбрасываем игру при переходе на другую вкладку
  };

  // Запуск конкретной игрв
  const handleSelectGame = (gameType: GameType) => {
    setCurrentGame(gameType);
  };

  // Логика завершения игры (сохранение результатов)
  const handleGameComplete = (gameType: GameType, score?: number) => {
    completeGame(gameType);
    if (score !== undefined && gameType === 'quiz') {
      saveQuizScore(score); // Для квиза сохраняем конкретный балл
    }
    setCurrentGame(null); // Возвращаемся в меню игр
  };

  // Кнопка "Назад" из игрового режима
  const handleBackFromGame = () => {
    setCurrentGame(null);
  };

  // ЭКРАН 1: Приветствие (если имя еще не введено)
  if (showWelcome) {
    return <WelcomeModal onSubmit={handleWelcomeSubmit} />;
  }

  // ЭКРАН 2: Режим игры (если выбрана конкретная игра)
  // Используем условный рендеринг для каждой игры
  if (currentGame === 'sorting') {
    return <SortingGame onComplete={() => handleGameComplete('sorting')} onBack={handleBackFromGame} />;
  }

  if (currentGame === 'quiz') {
    return <QuizGame onComplete={(score) => handleGameComplete('quiz', score)} onBack={handleBackFromGame} />;
  }

  if (currentGame === 'ecoroute') {
    return <EcoRouteGame onComplete={() => handleGameComplete('ecoroute')} onBack={handleBackFromGame} />;
  }

  if (currentGame === 'habits') {
    return <HabitsGame onComplete={() => handleGameComplete('habits')} onBack={handleBackFromGame} />;
  }

  // ЭКРАН 3: Основной интерфейс (Навигация + Страницы)
  return (
    <div className="min-h-screen bg-eco-50">
      {/* Шапка сайта с навигацией */}
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} userName={userName} />

      {/* Анимированный переход между страницами */}
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <HomePage key="home" onNavigate={handleNavigate} userName={userName} />
        )}

        {currentPage === 'lessons' && <LessonsPage key="lessons" />}

        {currentPage === 'games' && (
          <GamesPage key="games" onSelectGame={handleSelectGame} />
        )}

        {currentPage === 'progress' && (
          <ProgressPage key="progress" userName={userName} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;