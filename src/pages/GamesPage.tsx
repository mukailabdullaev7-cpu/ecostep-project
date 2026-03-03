import { motion } from 'framer-motion';
import { Recycle, Brain, Route, CheckSquare } from 'lucide-react';
import { isGameCompleted } from '../utils/storage';
import { GameType } from '../types';

interface GamesPageProps {
  onSelectGame: (gameType: GameType) => void;
}

export default function GamesPage({ onSelectGame }: GamesPageProps) {
  const games = [
    {
      id: 'sorting' as GameType,
      title: 'Сортировка мусора',
      description: 'Помоги правильно разделить отходы',
      icon: Recycle,
      color: 'bg-green-500',
    },
    {
      id: 'quiz' as GameType,
      title: 'Эко-викторина',
      description: 'Проверь свои знания об экологии',
      icon: Brain,
      color: 'bg-blue-500',
    },
    {
      id: 'ecoroute' as GameType,
      title: 'Эко-Маршрут',
      description: 'Построй путь и собери весь мусор',
      icon: Route,
      color: 'bg-teal-500',
    },
    {
      id: 'habits' as GameType,
      title: 'Эко-привычки',
      description: 'Отметь полезные для природы действия',
      icon: CheckSquare,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-eco-800 mb-4">Игры</h1>
          <p className="text-xl text-earth-600 max-w-2xl mx-auto">
            Играй, учись и помогай планете! Пройди все игры и получи значки
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {games.map((game, index) => {
            const Icon = game.icon;
            const completed = isGameCompleted(game.id);

            return (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectGame(game.id)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-left relative overflow-hidden"
              >
                {completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 bg-eco-500 text-white rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}

                <div className="flex items-start space-x-4 mb-4">
                  <div className={`${game.color} rounded-xl p-4 flex-shrink-0`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-earth-800 mb-2">{game.title}</h2>
                    <p className="text-earth-600 text-lg">{game.description}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-eco-600 font-semibold text-lg">
                    {completed ? 'Пройдено! Играть снова' : 'Начать игру'}
                  </span>
                  <svg
                    className="w-6 h-6 text-eco-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
