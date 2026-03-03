import { motion } from 'framer-motion';
import { BookOpen, Gamepad2, Trophy, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  userName: string;
}

export default function HomePage({ onNavigate, userName }: HomePageProps) {
  const quickLinks = [
    {
      id: 'lessons',
      title: 'Уроки',
      description: 'Узнай больше об экологии',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      id: 'games',
      title: 'Игры',
      description: 'Играй и учись',
      icon: Gamepad2,
      color: 'bg-eco-500',
    },
    {
      id: 'progress',
      title: 'Мои успехи',
      description: 'Смотри свои достижения',
      icon: Trophy,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <Sparkles className="w-12 h-12 text-eco-500" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-eco-800 mb-4">
            Привет, {userName}!
          </h1>

          <p className="text-xl md:text-2xl text-earth-600 max-w-2xl mx-auto leading-relaxed">
            Добро пожаловать на платформу «EcoStep»! Здесь ты узнаешь, как беречь природу и
            делать нашу планету лучше.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-eco-700 mb-6 text-center">
            Что ты узнаешь?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-lg text-earth-700">
            <div className="flex items-start space-x-3">
              <div className="bg-eco-100 rounded-full p-2 mt-1">
                <div className="w-2 h-2 bg-eco-500 rounded-full"></div>
              </div>
              <p>Как правильно сортировать мусор и помогать планете</p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-eco-100 rounded-full p-2 mt-1">
                <div className="w-2 h-2 bg-eco-500 rounded-full"></div>
              </div>
              <p>Почему важно беречь воду и как это делать</p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-eco-100 rounded-full p-2 mt-1">
                <div className="w-2 h-2 bg-eco-500 rounded-full"></div>
              </div>
              <p>Зачем нужны леса и как защитить деревья</p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-eco-100 rounded-full p-2 mt-1">
                <div className="w-2 h-2 bg-eco-500 rounded-full"></div>
              </div>
              <p>Что делает воздух чистым и как не загрязнять его</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-eco-700 mb-8 text-center">
            Начни своё путешествие
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(link.id)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-8 text-center"
                >
                  <div className={`${link.color} rounded-full p-6 inline-block mb-4`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-earth-800 mb-2">{link.title}</h3>

                  <p className="text-earth-600 text-lg">{link.description}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
