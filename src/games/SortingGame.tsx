import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, FileText, CupSoda, Wine, Leaf } from 'lucide-react';

interface SortingGameProps {
  onComplete: () => void;
  onBack: () => void;
}

interface WasteItem {
  id: string;
  name: string;
  category: 'plastic' | 'paper' | 'glass' | 'organic';
  emoji: string;
}

const wasteItems: WasteItem[] = [
  { id: '1', name: 'Пластиковая бутылка', category: 'plastic', emoji: '🍾' },
  { id: '2', name: 'Газета', category: 'paper', emoji: '📰' },
  { id: '3', name: 'Стеклянная банка', category: 'glass', emoji: '🫙' },
  { id: '4', name: 'Яблоко', category: 'organic', emoji: '🍎' },
  { id: '5', name: 'Картонная коробка', category: 'paper', emoji: '📦' },
  { id: '6', name: 'Пластиковый пакет', category: 'plastic', emoji: '🛍️' },
  { id: '7', name: 'Стеклянная бутылка', category: 'glass', emoji: '🍶' },
  { id: '8', name: 'Банановая кожура', category: 'organic', emoji: '🍌' },
];

const bins = [
  { id: 'plastic', name: 'Пластик', color: 'bg-yellow-500', icon: CupSoda },
  { id: 'paper', name: 'Бумага', color: 'bg-blue-500', icon: FileText },
  { id: 'glass', name: 'Стекло', color: 'bg-green-500', icon: Wine },
  { id: 'organic', name: 'Органика', color: 'bg-amber-700', icon: Leaf },
];

export default function SortingGame({ onComplete, onBack }: SortingGameProps) {
  const [draggedItem, setDraggedItem] = useState<WasteItem | null>(null);
  const [sortedItems, setSortedItems] = useState<Record<string, WasteItem[]>>({
    plastic: [],
    paper: [],
    glass: [],
    organic: [],
  });
  const [remainingItems, setRemainingItems] = useState<WasteItem[]>(wasteItems);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [showCompletion, setShowCompletion] = useState(false);

  const handleDragStart = (item: WasteItem) => {
    setDraggedItem(item);
    setFeedback(null);
  };

  const handleDrop = (binId: string) => {
    if (!draggedItem) return;

    if (draggedItem.category === binId) {
      setSortedItems((prev) => ({
        ...prev,
        [binId]: [...prev[binId], draggedItem],
      }));
      setRemainingItems((prev) => prev.filter((item) => item.id !== draggedItem.id));
      setFeedback({ type: 'success', message: 'Правильно!' });

      if (remainingItems.length === 1) {
        setTimeout(() => {
          setShowCompletion(true);
        }, 500);
      }
    } else {
      setFeedback({ type: 'error', message: 'Попробуй другую корзину!' });
    }

    setDraggedItem(null);
  };

  const handleTouchStart = (item: WasteItem) => {
    setDraggedItem(item);
    setFeedback(null);
  };

  const handleTouchEnd = (binId: string) => {
    handleDrop(binId);
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

          <h2 className="text-4xl font-bold text-eco-800 mb-4">Отлично!</h2>

          <p className="text-xl text-earth-600 mb-8">
            Ты правильно рассортировал весь мусор! Теперь его можно переработать и использовать
            снова. Молодец!
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCompleteGame}
            className="bg-eco-500 hover:bg-eco-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
          >
            Продолжить
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
          <h1 className="text-3xl md:text-4xl font-bold text-eco-800 mb-2">Сортировка мусора</h1>
          <p className="text-xl text-earth-600">
            Перетащи предметы в правильные корзины
          </p>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center mb-6 text-xl font-semibold ${
                feedback.type === 'success' ? 'text-eco-600' : 'text-red-500'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {bins.map((bin) => {
            const IconComponent = bin.icon;
            return (
              <motion.div
                key={bin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(bin.id)}
                onClick={() => draggedItem && handleTouchEnd(bin.id)}
                className={`${bin.color} rounded-2xl p-6 min-h-[300px] cursor-pointer transition-all ${
                  draggedItem ? 'ring-4 ring-white scale-105' : ''
                }`}
              >
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    <IconComponent className="w-16 h-16 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{bin.name}</h3>
                </div>

                <div className="space-y-2">
                  {sortedItems[bin.id].map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white/90 rounded-lg p-3 text-center"
                    >
                      <div className="text-3xl mb-1">{item.emoji}</div>
                      <div className="text-sm font-medium text-earth-800">{item.name}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {remainingItems.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-earth-800 mb-4 text-center">
              Рассортируй эти предметы:
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {remainingItems.map((item) => (
                <motion.div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  onClick={() => handleTouchStart(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-white rounded-xl shadow-lg p-6 text-center cursor-move ${
                    draggedItem?.id === item.id ? 'ring-4 ring-eco-500 scale-105' : ''
                  }`}
                >
                  <div className="text-5xl mb-2">{item.emoji}</div>
                  <div className="text-lg font-semibold text-earth-800">{item.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
