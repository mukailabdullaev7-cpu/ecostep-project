import { motion } from 'framer-motion';
import { Recycle, Brain, Route, CheckSquare, Lock, Trophy } from 'lucide-react';
import { isBadgeUnlocked, getUserProgress } from '../utils/storage';
import { BadgeType } from '../types';

interface ProgressPageProps {
  userName: string;
}

export default function ProgressPage({ userName }: ProgressPageProps) {
  const progress = getUserProgress();
  const completedGames = progress?.completedGames.length || 0;
  const totalGames = 4;
  const completionPercentage = Math.round((completedGames / totalGames) * 100);

  const badges = [
    {
      id: 'sorting' as BadgeType,
      title: 'Мастер сортировки',
      description: 'Правильно рассортировал мусор',
      icon: Recycle,
      color: 'from-green-400 to-green-600',
    },
    {
      id: 'quiz' as BadgeType,
      title: 'Эко-эксперт',
      description: 'Прошёл викторину об экологии',
      icon: Brain,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 'ecoroute' as BadgeType,
      title: 'Навигатор',
      description: 'Построил правильный эко-маршрут',
      icon: Route,
      color: 'from-teal-400 to-teal-600',
    },
    {
      id: 'habits' as BadgeType,
      title: 'Эко-герой',
      description: 'Освоил все эко-привычки',
      icon: CheckSquare,
      color: 'from-amber-400 to-amber-600',
    },
  ];

  const getMessage = () => {
    if (completedGames === 0) {
      return 'Начни играть, чтобы получить первый значок!';
    }
    if (completedGames === totalGames) {
      return 'Ты прошёл все игры! Ты настоящий защитник природы!';
    }
    return `Ты получил ${completedGames} из ${totalGames} значков. Продолжай!`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-eco-500" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-eco-800 mb-4">
            Твои успехи, {userName}!
          </h1>

          <p className="text-xl text-earth-600 mb-8">{getMessage()}</p>

          <div className="inline-flex items-center space-x-6 bg-white rounded-full px-10 py-5 shadow-xl">
            <div className="text-center">
              <div className="text-5xl font-bold text-eco-600">{completionPercentage}%</div>
              <div className="text-sm text-earth-600 mt-1">прогресс</div>
            </div>
            <div className="w-px h-16 bg-earth-300"></div>
            <div className="text-center">
              <div className="text-5xl font-bold text-earth-700">
                {completedGames}/{totalGames}
              </div>
              <div className="text-sm text-earth-600 mt-1">игр пройдено</div>
            </div>
          </div>
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-eco-700 mb-8 text-center">Твои значки</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge, index) => {
              const unlocked = isBadgeUnlocked(badge.id);
              const Icon = badge.icon;

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div
                    className={`rounded-2xl shadow-lg p-8 text-center transition-all ${
                      unlocked
                        ? 'bg-white hover:shadow-2xl'
                        : 'bg-earth-100 opacity-60'
                    }`}
                  >
                    <div className="relative inline-block mb-6">
                      {unlocked ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className={`bg-gradient-to-br ${badge.color} rounded-full p-6 shadow-lg`}
                        >
                          <Icon className="w-16 h-16 text-white" />
                        </motion.div>
                      ) : (
                        <div className="bg-earth-300 rounded-full p-6 relative">
                          <Lock className="w-16 h-16 text-earth-500" />
                        </div>
                      )}

                      {unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-eco-500 rounded-full p-2"
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${unlocked ? 'text-earth-800' : 'text-earth-500'}`}>
                      {badge.title}
                    </h3>

                    <p className={`text-sm ${unlocked ? 'text-earth-600' : 'text-earth-400'}`}>
                      {badge.description}
                    </p>

                    {!unlocked && (
                      <div className="mt-4 text-xs font-semibold text-earth-500">
                        Заблокировано
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {completedGames > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-eco-50 rounded-3xl p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-eco-800 mb-4">
              {completedGames === totalGames ? 'Невероятно!' : 'Так держать!'}
            </h3>

            <p className="text-lg md:text-xl text-earth-700 max-w-2xl mx-auto">
              {completedGames === totalGames
                ? 'Ты собрал все значки и стал настоящим защитником природы! Продолжай применять свои знания каждый день, чтобы делать нашу планету чище и здоровее.'
                : 'Продолжай играть и учиться, чтобы собрать все значки и стать настоящим эко-героем!'}
            </p>

            {progress?.quizScore !== undefined && (
              <div className="mt-6 inline-block bg-white rounded-xl px-6 py-3 shadow-md">
                <span className="text-earth-700 font-semibold">
                  Лучший результат викторины:{' '}
                </span>
                <span className="text-eco-600 font-bold text-xl">
                  {progress.quizScore} / 5
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
