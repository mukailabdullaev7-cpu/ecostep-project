import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight, Play, RotateCcw, Sparkles, Home, Trash2 } from 'lucide-react';

interface EcoRouteGameProps {
  onComplete: () => void;
  onBack: () => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';
type CellType = 'empty' | 'hero' | 'trash' | 'finish';

interface Position {
  x: number;
  y: number;
}

interface GridCell {
  type: CellType;
  collected?: boolean;
}

const GRID_SIZE = 5;

const initialGrid: GridCell[][] = [
  [{ type: 'hero' }, { type: 'empty' }, { type: 'trash' }, { type: 'empty' }, { type: 'empty' }],
  [{ type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'trash' }, { type: 'empty' }],
  [{ type: 'empty' }, { type: 'trash' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }],
  [{ type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'trash' }],
  [{ type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'empty' }, { type: 'finish' }],
];

const trashPositions = [
  { x: 2, y: 0 },
  { x: 3, y: 1 },
  { x: 1, y: 2 },
  { x: 4, y: 3 },
];

export default function EcoRouteGame({ onComplete, onBack }: EcoRouteGameProps) {
  const [commands, setCommands] = useState<Direction[]>([]);
  const [heroPosition, setHeroPosition] = useState<Position>({ x: 0, y: 0 });
  const [collectedTrash, setCollectedTrash] = useState<Set<string>>(new Set());
  const [isExecuting, setIsExecuting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const executionTimeoutRef = useRef<number>();

  const addCommand = (direction: Direction) => {
    if (!isExecuting && commands.length < 20) {
      setCommands([...commands, direction]);
      setErrorMessage('');
    }
  };

  const removeLastCommand = () => {
    if (!isExecuting && commands.length > 0) {
      setCommands(commands.slice(0, -1));
      setErrorMessage('');
    }
  };

  const resetGame = () => {
    setCommands([]);
    setHeroPosition({ x: 0, y: 0 });
    setCollectedTrash(new Set());
    setIsExecuting(false);
    setShowCompletion(false);
    setErrorMessage('');
    if (executionTimeoutRef.current) {
      clearTimeout(executionTimeoutRef.current);
    }
  };

  const executeCommands = async () => {
    if (commands.length === 0) {
      setErrorMessage('Добавь команды для движения!');
      return;
    }

    setIsExecuting(true);
    setErrorMessage('');
    let currentPos = { x: 0, y: 0 };
    const newCollectedTrash = new Set<string>();

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      let newPos = { ...currentPos };

      switch (command) {
        case 'up':
          newPos.y -= 1;
          break;
        case 'down':
          newPos.y += 1;
          break;
        case 'left':
          newPos.x -= 1;
          break;
        case 'right':
          newPos.x += 1;
          break;
      }

      if (newPos.x < 0 || newPos.x >= GRID_SIZE || newPos.y < 0 || newPos.y >= GRID_SIZE) {
        setErrorMessage('Герой вышел за границу карты! Попробуй снова.');
        setIsExecuting(false);
        await new Promise((resolve) => {
          executionTimeoutRef.current = window.setTimeout(resolve, 2000);
        });
        resetGame();
        return;
      }

      currentPos = newPos;
      setHeroPosition(currentPos);

      const trashKey = `${currentPos.x},${currentPos.y}`;
      const trashAtPosition = trashPositions.find((t) => t.x === currentPos.x && t.y === currentPos.y);
      if (trashAtPosition) {
        newCollectedTrash.add(trashKey);
        setCollectedTrash(new Set(newCollectedTrash));
      }

      await new Promise((resolve) => {
        executionTimeoutRef.current = window.setTimeout(resolve, 500);
      });
    }

    if (currentPos.x === 4 && currentPos.y === 4) {
      if (newCollectedTrash.size === trashPositions.length) {
        setShowCompletion(true);
      } else {
        setErrorMessage('Собери весь мусор перед финишем!');
        setIsExecuting(false);
        await new Promise((resolve) => {
          executionTimeoutRef.current = window.setTimeout(resolve, 2000);
        });
        resetGame();
      }
    } else {
      setErrorMessage('Не дошёл до финиша! Попробуй снова.');
      setIsExecuting(false);
      await new Promise((resolve) => {
        executionTimeoutRef.current = window.setTimeout(resolve, 2000);
      });
      resetGame();
    }
  };

  const handleCompleteGame = () => {
    onComplete();
    onBack();
  };

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

          <h2 className="text-4xl font-bold text-eco-800 mb-4">Отличный маршрут!</h2>

          <p className="text-xl text-earth-600 mb-8">
            Ты построил правильный путь, собрал весь мусор и дошёл до финиша. Молодец!
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
          <h1 className="text-3xl md:text-4xl font-bold text-eco-800 mb-2">Эко-Маршрут</h1>
          <p className="text-xl text-earth-600 mb-4">Построй маршрут: собери весь мусор и дойди до финиша</p>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <Trash2 className="w-6 h-6 text-eco-600" />
              <span className="text-lg font-semibold text-earth-700">Мусор собран:</span>
              <span className="text-2xl font-bold text-eco-600">
                {collectedTrash.size} / {trashPositions.length}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-earth-800 mb-6">Карта</h2>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {Array.from({ length: GRID_SIZE }).map((_, y) =>
                Array.from({ length: GRID_SIZE }).map((_, x) => {
                  const isHero = heroPosition.x === x && heroPosition.y === y;
                  const isTrash = trashPositions.some((t) => t.x === x && t.y === y);
                  const isTrashCollected = collectedTrash.has(`${x},${y}`);
                  const isFinish = x === 4 && y === 4;

                  return (
                    <motion.div
                      key={`${x}-${y}`}
                      className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-300 flex items-center justify-center relative"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (y * GRID_SIZE + x) * 0.02 }}
                    >
                      <AnimatePresence>
                        {isHero && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="text-3xl"
                          >
                            🧒
                          </motion.div>
                        )}
                        {isTrash && !isTrashCollected && !isHero && (
                          <motion.div className="text-3xl">
                            <Trash2 className="w-8 h-8 text-earth-600" />
                          </motion.div>
                        )}
                        {isFinish && !isHero && (
                          <motion.div className="text-3xl">
                            <Home className="w-8 h-8 text-eco-600" />
                          </motion.div>
                        )}
                        {isTrashCollected && !isHero && (
                          <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            className="text-2xl"
                          >
                            ✨
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-earth-800 mb-6">Команды</h2>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addCommand('up')}
                disabled={isExecuting}
                className="aspect-square bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
              >
                <ArrowUp className="w-8 h-8" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addCommand('down')}
                disabled={isExecuting}
                className="aspect-square bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
              >
                <ArrowDown className="w-8 h-8" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addCommand('left')}
                disabled={isExecuting}
                className="aspect-square bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
              >
                <ArrowLeft className="w-8 h-8" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addCommand('right')}
                disabled={isExecuting}
                className="aspect-square bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
              >
                <ArrowRight className="w-8 h-8" />
              </motion.button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-earth-800 mb-3">Последовательность:</h3>
              <div className="min-h-[120px] bg-earth-50 rounded-xl p-4 flex flex-wrap gap-2">
                {commands.length === 0 ? (
                  <p className="text-earth-500 text-center w-full">Добавь команды...</p>
                ) : (
                  commands.map((cmd, index) => {
                    const Icon =
                      cmd === 'up'
                        ? ArrowUp
                        : cmd === 'down'
                          ? ArrowDown
                          : cmd === 'left'
                            ? ArrowLeft
                            : ArrowRight;
                    return (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-blue-500 text-white rounded-lg p-2 flex items-center justify-center"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-2 border-red-400 rounded-xl p-4 mb-6 text-center"
              >
                <p className="text-red-700 font-semibold">{errorMessage}</p>
              </motion.div>
            )}

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={executeCommands}
                disabled={isExecuting}
                className="flex-1 bg-eco-500 hover:bg-eco-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-6 h-6" />
                <span>Запуск</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={removeLastCommand}
                disabled={isExecuting}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl transition-colors"
              >
                ← Отменить
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                disabled={isExecuting}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="mt-6 bg-eco-50 rounded-2xl p-4">
              <h3 className="text-lg font-bold text-earth-800 mb-2">Подсказка:</h3>
              <p className="text-earth-700 text-sm">
                Используй стрелки для создания последовательности движений. Герой должен собрать весь мусор и
                дойти до домика.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
