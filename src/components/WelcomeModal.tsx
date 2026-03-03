import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface WelcomeModalProps {
  onSubmit: (name: string) => void;
}

export default function WelcomeModal({ onSubmit }: WelcomeModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Пожалуйста, введите ваше имя');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Имя должно содержать минимум 2 символа');
      return;
    }

    onSubmit(trimmedName);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="bg-eco-500 rounded-full p-6 mb-6"
            >
              <Leaf className="w-16 h-16 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-eco-800 mb-2 text-center">
              Добро пожаловать!
            </h1>

            <p className="text-earth-600 text-center mb-8 text-lg">
              Давай вместе узнаем, как беречь нашу планету!
            </p>

            <form onSubmit={handleSubmit} className="w-full">
              <label htmlFor="name" className="block text-lg font-semibold text-eco-700 mb-3">
                Введите ваше имя
              </label>

              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 text-lg border-2 border-eco-300 rounded-xl focus:outline-none focus:border-eco-500 transition-colors"
                placeholder="Ваше имя"
                autoFocus
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-eco-500 hover:bg-eco-600 text-white font-bold py-4 px-6 rounded-xl text-xl transition-colors shadow-lg"
              >
                Начать
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
