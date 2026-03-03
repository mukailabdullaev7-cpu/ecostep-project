import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Trophy } from 'lucide-react';
import { HabitItem } from '../types';

interface HabitsGameProps {
  onComplete: () => void;
  onBack: () => void;
}

const initialHabits: HabitItem[] = [
  { id: '1', text: 'Выключил свет, выходя из комнаты', completed: false, isGood: true, energyCost: 10, ecoPoints: 15 },
  { id: '2', text: 'Оставил включенным свет весь день', completed: false, isGood: false, energyCost: 5, ecoPoints: -20 },
  { id: '3', text: 'Закрыл кран, пока чистил зубы', completed: false, isGood: true, energyCost: 10, ecoPoints: 15 },
  { id: '4', text: 'Не закрыл кран после мытья рук', completed: false, isGood: false, energyCost: 5, ecoPoints: -18 },
  { id: '5', text: 'Рассортировал мусор', completed: false, isGood: true, energyCost: 20, ecoPoints: 25 },
  { id: '6', text: 'Выбросил мусор мимо урны', completed: false, isGood: false, energyCost: 8, ecoPoints: -25 },
  { id: '7', text: 'Принёс многоразовую сумку в магазин', completed: false, isGood: true, energyCost: 15, ecoPoints: 20 },
  { id: '8', text: 'Попросил одноразовый пакет в магазине', completed: false, isGood: false, energyCost: 5, ecoPoints: -15 },
  { id: '9', text: 'Полил растения дома или в школе', completed: false, isGood: true, energyCost: 15, ecoPoints: 18 },
  { id: '10', text: 'Собрал макулатуру для переработки', completed: false, isGood: true, energyCost: 20, ecoPoints: 22 },
  { id: '11', text: 'Ходил пешком или на велосипеде', completed: false, isGood: true, energyCost: 15, ecoPoints: 20 },
];

export default function HabitsGame({ onComplete, onBack }: HabitsGameProps) {
  const [habits, setHabits] = useState<HabitItem[]>(initialHabits);
  const [showCompletion, setShowCompletion] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [lastPointChange, setLastPointChange] = useState<number | null>(null);

  const handleToggleHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    if (!habit.completed) {
      if (energy < habit.energyCost) return;

      const updatedHabits = habits.map((h) =>
        h.id === id ? { ...h, completed: true } : h
      );

      setHabits(updatedHabits);
      setEnergy(prev => prev - habit.energyCost);
      setEcoPoints(prev => prev + habit.ecoPoints);
      setLastPointChange(habit.ecoPoints);

      setTimeout(() => setLastPointChange(null), 1500);

      const newEnergy = energy - habit.energyCost;
      if (newEnergy <= 0) {
        setTimeout(() => {
          setShowCompletion(true);
        }, 800);
      }
    } else {
      const updatedHabits = habits.map((h) =>
        h.id === id ? { ...h, completed: false } : h
      );

      setHabits(updatedHabits);
      setEnergy(prev => prev + habit.energyCost);
      setEcoPoints(prev => prev - habit.ecoPoints);
    }
  };

  const handleCompleteGame = () => {
    onComplete();
    onBack();
  };

  const handleReset = () => {
    setHabits(initialHabits);
    setShowCompletion(false);
    setEnergy(100);
    setEcoPoints(0);
    setLastPointChange(null);
  };

  const getRank = (points: number) => {
    if (points >= 80) return { title: 'Эко-герой', color: 'text-eco-600' };
    if (points >= 50) return { title: 'Защитник природы', color: 'text-eco-500' };
    if (points >= 20) return { title: 'Друг природы', color: 'text-earth-600' };
    if (points >= 0) return { title: 'Новичок', color: 'text-earth-500' };
    return { title: 'Нужно стараться', color: 'text-orange-600' };
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const goodChoices = habits.filter((h) => h.completed && h.isGood).length;
  const badChoices = habits.filter((h) => h.completed && !h.isGood).length;
  const energyColor = energy > 50 ? 'bg-eco-500' : energy > 20 ? 'bg-yellow-500' : 'bg-red-500';

  if (showCompletion) {
    const rank = getRank(ecoPoints);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-b from-eco-50 to-white flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-3xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <Trophy className="w-24 h-24 text-yellow-500" />
            </motion.div>

            <h2 className="text-4xl font-bold text-eco-800 mb-2">День завершён!</h2>
            <p className={`text-3xl font-bold ${rank.color} mb-6`}>{rank.title}</p>

            <div className="flex justify-center gap-6 mb-6">
              <div className="bg-eco-50 rounded-2xl p-6 min-w-[140px]">
                <div className="text-4xl font-bold text-eco-600 mb-1">{ecoPoints}</div>
                <div className="text-sm text-earth-600">очков Эко-героя</div>
              </div>
              <div className="bg-earth-50 rounded-2xl p-6 min-w-[140px]">
                <div className="text-4xl font-bold text-earth-700 mb-1">{completedCount}</div>
                <div className="text-sm text-earth-600">действий</div>
              </div>
            </div>
          </div>

          <div className="bg-eco-50 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-eco-800 mb-4">Твои выборы за день:</h3>
            <div className="grid gap-4">
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-earth-700">Всего действий</span>
                  <div className="text-3xl font-bold text-earth-700">{completedCount}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {habits.filter(h => h.completed).map((habit) => (
                <div key={habit.id} className={`p-3 rounded-lg ${habit.isGood ? 'bg-eco-100' : 'bg-red-100'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-earth-800">{habit.text}</span>
                    <span className={`text-sm font-bold ${habit.isGood ? 'text-eco-600' : 'text-red-600'}`}>
                      {habit.ecoPoints > 0 ? '+' : ''}{habit.ecoPoints}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-earth-50 rounded-2xl p-6 mb-8">
            <p className="text-lg text-earth-700 text-center">
              {ecoPoints >= 80 && "Невероятно! Ты — настоящий защитник природы! Твои действия делают планету лучше!"}
              {ecoPoints >= 50 && ecoPoints < 80 && "Отлично! Ты стараешься заботиться о природе. Продолжай в том же духе!"}
              {ecoPoints >= 20 && ecoPoints < 50 && "Хорошо! Ты на правильном пути. Каждое доброе дело для природы важно!"}
              {ecoPoints >= 0 && ecoPoints < 20 && "Неплохо для начала! В следующий раз попробуй выбирать больше полезных действий."}
              {ecoPoints < 0 && "Помни: каждое наше действие влияет на природу. В следующий раз попробуй быть добрее к планете!"}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="bg-earth-200 hover:bg-earth-300 text-earth-800 font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Попробовать ещё раз
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteGame}
              className="bg-eco-500 hover:bg-eco-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Продолжить
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 text-eco-600 hover:text-eco-700 font-semibold mb-8 text-lg"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Назад к играм</span>
        </motion.button>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-eco-800 mb-4">Эко-привычки</h1>
          <p className="text-xl text-earth-600 mb-6">
            Выбирай свои действия за день! У тебя есть 100% энергии. Набери максимум очков Эко-героя!
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <div className="bg-white rounded-2xl px-8 py-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <Zap className={`w-8 h-8 ${energy > 20 ? 'text-eco-500' : 'text-red-500'}`} />
                <div className="text-center">
                  <div className={`text-3xl font-bold ${energy > 20 ? 'text-eco-600' : 'text-red-600'}`}>
                    {energy}%
                  </div>
                  <div className="text-sm text-earth-600">энергии</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl px-8 py-4 shadow-lg relative">
              <div className="flex items-center space-x-3">
                <Trophy className={`w-8 h-8 ${ecoPoints >= 0 ? 'text-yellow-500' : 'text-orange-500'}`} />
                <div className="text-center">
                  <div className={`text-3xl font-bold ${ecoPoints >= 0 ? 'text-eco-600' : 'text-orange-600'}`}>
                    {ecoPoints}
                  </div>
                  <div className="text-sm text-earth-600">очков</div>
                </div>
              </div>
              <AnimatePresence>
                {lastPointChange !== null && (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -30 }}
                    exit={{ opacity: 0 }}
                    className={`absolute -top-2 right-4 text-2xl font-bold ${
                      lastPointChange > 0 ? 'text-eco-500' : 'text-red-500'
                    }`}
                  >
                    {lastPointChange > 0 ? '+' : ''}{lastPointChange}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-earth-100 rounded-full h-6 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${energy}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${energyColor} transition-colors duration-300`}
              />
            </div>
            {energy <= 20 && energy > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 font-semibold mt-2"
              >
                Внимание! Энергия заканчивается!
              </motion.p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-earth-800 mb-6 text-center">
            Выбери свои действия за день
          </h2>
          <div className="space-y-3">
            {habits.map((habit, index) => (
              <motion.button
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: !habit.completed && energy >= habit.energyCost ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleHabit(habit.id)}
                disabled={!habit.completed && energy < habit.energyCost}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  habit.completed
                    ? 'bg-earth-700 text-white shadow-lg'
                    : energy >= habit.energyCost
                    ? 'bg-earth-50 text-earth-800 hover:bg-earth-100 border-2 border-earth-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 ${
                        habit.completed
                          ? 'bg-white border-white'
                          : 'bg-white border-earth-300'
                      }`}
                    >
                      <AnimatePresence>
                        {habit.completed && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="w-4 h-4 text-earth-700"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="text-base font-semibold flex-1">{habit.text}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs ${habit.completed ? 'text-white/90' : 'text-earth-500'}`}>
                      -{habit.energyCost}%
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-eco-50 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-eco-800 mb-3">Как играть:</h3>
          <ul className="text-lg text-earth-700 space-y-2">
            <li>✓ У тебя есть 100% энергии на весь день</li>
            <li>✓ Каждое действие тратит энергию</li>
            <li>✓ Некоторые действия дают очки, а некоторые отнимают</li>
            <li>✓ Постарайся понять, какие действия полезны для природы, а какие — вредны</li>
            <li>✓ Цель — набрать максимум очков Эко-героя!</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
