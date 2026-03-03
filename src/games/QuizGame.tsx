import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const questions: QuizQuestion[] = [
  {
    question: 'Что из этого можно перерабатывать?',
    options: ['Пластиковые бутылки', 'Батарейки', 'Грязную бумагу', 'Зеркало'],
    correctAnswer: 0,
  },
  {
    question: 'Сколько литров воды вытекает из открытого крана за минуту?',
    options: ['5 литров', '15 литров', '25 литров', '35 литров'],
    correctAnswer: 1,
  },
  {
    question: 'Что деревья выделяют в воздух?',
    options: ['Углекислый газ', 'Кислород', 'Азот', 'Водород'],
    correctAnswer: 1,
  },
  {
    question: 'Что загрязняет воздух?',
    options: ['Растения', 'Выхлопные газы машин', 'Дождь', 'Ветер'],
    correctAnswer: 1,
  },
  {
    question: 'Как называется процесс превращения отходов в новые вещи?',
    options: ['Переработка', 'Сжигание', 'Закапывание', 'Складирование'],
    correctAnswer: 0,
  },
];

export default function QuizGame({ onComplete, onBack }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const handleCompleteQuiz = () => {
    onComplete(score);
    onBack();
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const getMessage = () => {
      if (percentage === 100) return 'Невероятно! Ты знаешь всё об экологии!';
      if (percentage >= 80) return 'Отлично! Ты настоящий эко-эксперт!';
      if (percentage >= 60) return 'Хорошо! Ты многое знаешь об экологии!';
      return 'Молодец! Продолжай учиться беречь природу!';
    };

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
            <Trophy className="w-24 h-24 text-eco-500" />
          </motion.div>

          <h2 className="text-4xl font-bold text-eco-800 mb-4">Викторина завершена!</h2>

          <p className="text-xl text-earth-600 mb-6">{getMessage()}</p>

          <div className="bg-eco-50 rounded-2xl p-8 mb-8">
            <div className="text-6xl font-bold text-eco-600 mb-2">
              {score} / {questions.length}
            </div>
            <div className="text-xl text-earth-700">правильных ответов</div>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestartQuiz}
              className="bg-earth-200 hover:bg-earth-300 text-earth-800 font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Пройти снова
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteQuiz}
              className="bg-eco-500 hover:bg-eco-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Продолжить
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

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
          <h1 className="text-3xl md:text-4xl font-bold text-eco-800 mb-4">Эко-викторина</h1>
          <div className="flex justify-center items-center space-x-4 text-xl text-earth-600">
            <span>
              Вопрос {currentQuestion + 1} из {questions.length}
            </span>
            <span className="text-eco-600 font-bold">•</span>
            <span>Счёт: {score}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-earth-800 mb-8 text-center">
                {question.question}
              </h2>

              <div className="space-y-4">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === question.correctAnswer;

                  let buttonClass = 'bg-earth-100 hover:bg-earth-200 text-earth-800';

                  if (showFeedback) {
                    if (isSelected && isCorrect) {
                      buttonClass = 'bg-eco-500 text-white';
                    } else if (isSelected && !isCorrect) {
                      buttonClass = 'bg-red-500 text-white';
                    } else if (isCorrectAnswer) {
                      buttonClass = 'bg-eco-500 text-white';
                    } else {
                      buttonClass = 'bg-earth-100 text-earth-400';
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={!showFeedback ? { scale: 1.02, x: 5 } : {}}
                      whileTap={!showFeedback ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                      className={`w-full p-6 rounded-xl font-semibold text-xl text-left transition-all ${buttonClass} ${
                        showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showFeedback && isCorrectAnswer && (
                          <Sparkles className="w-6 h-6" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 text-center text-xl font-semibold ${
                      isCorrect ? 'text-eco-600' : 'text-red-600'
                    }`}
                  >
                    {isCorrect ? 'Правильно!' : 'Не совсем верно'}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
