import { motion } from 'framer-motion';
import { Home, BookOpen, Gamepad2, Trophy } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userName: string;
}

export default function Navigation({ currentPage, onNavigate, userName }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'lessons', label: 'Уроки', icon: BookOpen },
    { id: 'games', label: 'Игры', icon: Gamepad2 },
    { id: 'progress', label: 'Мои успехи', icon: Trophy },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="bg-eco-500 rounded-full p-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                </svg>
              </motion.div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-eco-800">EcoStep</h1>
              <p className="text-sm text-earth-600">Привет, {userName}!</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-colors ${
                    isActive
                      ? 'bg-eco-500 text-white shadow-lg'
                      : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        <nav className="md:hidden flex justify-around pb-3 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-eco-600' : 'text-earth-600'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
