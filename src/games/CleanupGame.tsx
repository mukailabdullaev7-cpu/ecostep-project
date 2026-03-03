import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Clock, AlertTriangle } from 'lucide-react';

interface CleanupGameProps {
  onComplete: () => void;
  onBack: () => void;
}

interface PollutionSpot {
  id: string;
  x: number;
  y: number;
  type: 'trash' | 'smoke' | 'oil';
  emoji: string;
  cleaned: boolean;
}

const pollutionTypes = [
  { type: 'trash' as const, emoji: '🗑️' },
  { type: 'smoke' as const, emoji: '🏭' },
  { type: 'oil' as const, emoji: '🛢️' },
  { type: 'trash' as const, emoji: '🗑️' },
  { type: 'smoke' as const, emoji: '💨' },
];

const MAX_POLLUTION = 10;
const GAME_DURATION = 30;

export default function CleanupGame({ onComplete, onBack }: CleanupGameProps) {
  const [pollutionSpots, setPollutionSpots] = useState<PollutionSpot[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const nextIdRef = useRef(1);
  const spawnIntervalRef = useRef<number>();
  const timerIntervalRef = useRef<number>();

  useEffect(() => {
    // Start timer
    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start spawning pollution
    const spawnPollution = () => {
      setPollutionSpots((prev) => {
        const activePollution = prev.filter((spot) => !spot.cleaned);

        if (activePollution.length >= MAX_POLLUTION) {
          endGame(false);
          return prev;
        }

        const randomType = pollutionTypes[Math.floor(Math.random() * pollutionTypes.length)];
        const newSpot: PollutionSpot = {
          id: String(nextIdRef.current++),
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 15,
          type: randomType.type,
          emoji: randomType.emoji,
          cleaned: false,
        };

        return [...prev, newSpot];
      });
    };

    // Initial spawn
    spawnPollution();

    // Spawn new pollution every 2 seconds
    spawnIntervalRef.current = window.setInterval(spawnPollution, 2000);

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const endGame = (won: boolean) => {
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    if (won) {
      setShowCompletion(true);
    } else {
      setGameOver(true);
    }
  };

  const handleCleanSpot = (id: string) => {
    setPollutionSpots((prev) =>
      prev.map((spot) => (spot.id === id ? { ...spot, cleaned: true } : spot))
    );
    setScore((prev) => prev + 1);
  };

  const handleCompleteGame = () => {
    onComplete();
    onBack();
  };

  const handleRetry = () => {
    setPollutionSpots([]);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setGameOver(false);
    setShowCompletion(false);
    nextIdRef.current = 1;

    // Restart game
    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnPollution = () => {
      setPollutionSpots((prev) => {
        const activePollution = prev.filter((spot) => !spot.cleaned);

        if (activePollution.length >= MAX_POLLUTION) {
          endGame(false);
          return prev;
        }

        const randomType = pollutionTypes[Math.floor(Math.random() * pollutionTypes.length)];
        const newSpot: PollutionSpot = {
          id: String(nextIdRef.current++),
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 15,
          type: randomType.type,
          emoji: randomType.emoji,
          cleaned: false,
        };

        return [...prev, newSpot];
      });
    };

    spawnPollution();
    spawnIntervalRef.current = window.setInterval(spawnPollution, 2000);
  };

  const activePollutionCount = pollutionSpots.filter((spot) => !spot.cleaned).length;

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <AlertTriangle className="w-24 h-24 text-red-500" />
          </motion.div>

          <h2 className="text-4xl font-bold text-red-800 mb-4">Планета загрязнена!</h2>

          <p className="text-xl text-earth-600 mb-4">
            Загрязнений стало слишком много! Попробуй еще раз и очищай быстрее.
          </p>

          <p className="text-lg text-earth-500 mb-8">
            Очищено загрязнений: <span className="font-bold text-eco-600">{score}</span>
          </p>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              className="bg-eco-500 hover:bg-eco-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Попробовать снова
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="bg-earth-500 hover:bg-earth-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Назад
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (showCompletion) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-b from-eco-50 to-white flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-24 h-24 text-eco-500" />
          </motion.div>

          <h2 className="text-4xl font-bold text-eco-800 mb-4">Отлично!</h2>

          <p className="text-xl text-earth-600 mb-4">
            Ты справился с задачей! Планета стала чище благодаря твоим усилиям!
          </p>

          <p className="text-lg text-earth-500 mb-8">
            Очищено загрязнений: <span className="font-bold text-eco-600">{score}</span>
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCompleteGame}
            className="bg-eco-500 hover:bg-eco-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
          >
            Получить значок
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <h1 className="text-3xl md:text-4xl font-bold text-eco-800 mb-2">Очистка планеты</h1>
          <p className="text-xl text-earth-600 mb-4">
            Нажимай на загрязнения! Не дай их количеству достичь {MAX_POLLUTION}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <Clock className="w-6 h-6 text-eco-600" />
              <span className="text-lg font-semibold text-earth-700">Время:</span>
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-eco-600'}`}>
                {timeLeft}с
              </span>
            </div>

            <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <span className="text-lg font-semibold text-earth-700">Очищено:</span>
              <span className="text-2xl font-bold text-eco-600">{score}</span>
            </div>

            <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <AlertTriangle className={`w-6 h-6 ${activePollutionCount >= 7 ? 'text-red-600' : 'text-yellow-600'}`} />
              <span className="text-lg font-semibold text-earth-700">Загрязнений:</span>
              <span className={`text-2xl font-bold ${activePollutionCount >= 7 ? 'text-red-600' : 'text-yellow-600'}`}>
                {activePollutionCount} / {MAX_POLLUTION}
              </span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-b from-blue-300 via-green-300 to-green-400 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
          style={{ minHeight: '600px' }}
        >
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <circle cx="25" cy="25" r="2" fill="white" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="absolute top-4 left-4 text-6xl">🌍</div>
          <div className="absolute top-8 right-8 text-5xl">☀️</div>
          <div className="absolute bottom-8 left-12 text-4xl">🌳</div>
          <div className="absolute bottom-12 right-16 text-4xl">🌳</div>

          <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
            <AnimatePresence>
              {pollutionSpots.map((spot) =>
                spot.cleaned ? (
                  <motion.div
                    key={spot.id}
                    initial={{ scale: 1 }}
                    exit={{ scale: 0, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: 'absolute',
                      left: `${spot.x}%`,
                      top: `${spot.y}%`,
                    }}
                    className="text-5xl"
                  >
                    ✨
                  </motion.div>
                ) : (
                  <motion.button
                    key={spot.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCleanSpot(spot.id)}
                    style={{
                      position: 'absolute',
                      left: `${spot.x}%`,
                      top: `${spot.y}%`,
                    }}
                    className="text-6xl cursor-pointer transition-transform hover:drop-shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                  >
                    {spot.emoji}
                  </motion.button>
                )
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-earth-800 mb-3">Подсказка:</h3>
          <ul className="space-y-2 text-lg text-earth-700">
            <li>🗑️ Мусор — собери и отправь на переработку</li>
            <li>🏭💨 Дым — очисти воздух от загрязнений</li>
            <li>🛢️ Разливы — убери опасные вещества</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
