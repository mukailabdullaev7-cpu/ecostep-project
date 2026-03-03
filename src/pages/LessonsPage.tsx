import { useState } from 'react';
import { motion } from 'framer-motion';
import { Recycle, Droplet, Trees, Wind, ArrowLeft } from 'lucide-react';
import { lessons } from '../data/lessons';

const iconMap = {
  recycle: Recycle,
  droplet: Droplet,
  trees: Trees,
  wind: Wind,
};

export default function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const currentLesson = lessons.find((l) => l.id === selectedLesson);

  if (currentLesson) {
    const Icon = iconMap[currentLesson.icon as keyof typeof iconMap];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-eco-50 to-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedLesson(null)}
            className="flex items-center space-x-2 text-eco-600 hover:text-eco-700 font-semibold mb-8 text-lg"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Назад к урокам</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-eco-500 rounded-2xl p-4">
                <Icon className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-eco-800">
                {currentLesson.title}
              </h1>
            </div>

            <div
              className="prose prose-lg max-w-none lesson-content"
              dangerouslySetInnerHTML={{ __html: currentLesson.content }}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-eco-800 mb-4">Уроки экологии</h1>
          <p className="text-xl text-earth-600 max-w-2xl mx-auto">
            Узнай больше о том, как беречь природу и делать нашу планету чище
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {lessons.map((lesson, index) => {
            const Icon = iconMap[lesson.icon as keyof typeof iconMap];

            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLesson(lesson.id)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-left"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-eco-500 rounded-xl p-4 flex-shrink-0">
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-eco-800 mb-2">{lesson.title}</h2>
                    <p className="text-earth-600 text-lg">{lesson.description}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center text-eco-600 font-semibold">
                  <span>Читать урок</span>
                  <svg
                    className="w-5 h-5 ml-2"
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
