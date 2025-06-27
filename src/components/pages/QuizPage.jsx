import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import QuizQuestion from '@/components/molecules/QuizQuestion'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { quizService } from '@/services/api/quizService'
import { userProgressService } from '@/services/api/userProgressService'

const QuizPage = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [lessonId])

  const loadQuiz = async () => {
    try {
      setLoading(true)
      setError('')
      
      const quizData = await quizService.getQuizForLesson(parseInt(lessonId))
      setQuiz(quizData)
      setAnswers(new Array(quizData.questions.length).fill(null))
    } catch (err) {
      setError('Failed to load quiz')
      console.error('Error loading quiz:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answerIndex
    setAnswers(newAnswers)

    // Auto advance to next question after showing result
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        // All questions answered, show final results
        calculateAndShowResults(newAnswers)
      }
    }, 2000)
  }

  const calculateAndShowResults = async (finalAnswers) => {
    const correctAnswers = finalAnswers.reduce((count, answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        return count + 1
      }
      return count
    }, 0)

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100)
    setScore(finalScore)
    setShowResults(true)

    // Submit quiz results
    try {
      setIsSubmitting(true)
      await quizService.submitQuiz(quiz.Id, finalAnswers, finalScore)
      await userProgressService.updateProgress(parseInt(lessonId), finalScore)
      
      if (finalScore >= 80) {
        toast.success('Excellent work! Quiz completed successfully! 🎉')
      } else if (finalScore >= 60) {
        toast.success('Good job! Quiz completed!')
      } else {
        toast.info('Quiz completed. Keep practicing to improve!')
      }
    } catch (error) {
      toast.error('Failed to save quiz results')
      console.error('Error submitting quiz:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0)
    setAnswers(new Array(quiz.questions.length).fill(null))
    setShowResults(false)
    setScore(0)
  }

  const handleFinish = () => {
    navigate('/learn')
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadQuiz} />
  if (!quiz) return <Error message="Quiz not found" />

  if (showResults) {
    return (
      <div className="min-h-screen py-6">
        <div className="px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            {/* Results Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  score >= 80 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                    : score >= 60
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-red-400 to-pink-500'
                }`}
              >
                <ApperIcon 
                  name={score >= 80 ? "Trophy" : score >= 60 ? "Award" : "Target"} 
                  className="w-12 h-12 text-white" 
                />
              </motion.div>

              <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-2">
                Quiz Complete!
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {score >= 80 
                  ? "Outstanding performance! You've mastered this topic." 
                  : score >= 60
                  ? "Good job! You're making great progress."
                  : "Keep practicing! Review the lesson and try again."
                }
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <div className="font-display font-bold text-5xl text-gray-900 dark:text-white mb-2">
                    {score}%
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Your Score
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="font-bold text-2xl text-green-600 dark:text-green-400">
                      {answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Correct</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-red-600 dark:text-red-400">
                      {answers.filter((answer, index) => answer !== quiz.questions[index].correctAnswer).length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Incorrect</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-4">
              {score < 60 && (
                <Button
                  variant="secondary"
                  size="lg"
                  icon="RotateCcw"
                  onClick={handleRetakeQuiz}
                  className="w-full"
                >
                  Retake Quiz
                </Button>
              )}
              
              <Button
                variant="primary"
                size="lg"
                icon="ArrowRight"
                iconPosition="right"
                onClick={handleFinish}
                loading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Saving...' : 'Continue Learning'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isAnswered = answers[currentQuestionIndex] !== null

  return (
    <div className="min-h-screen py-6">
      {/* Header */}
      <div className="px-4 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="font-display font-bold text-xl text-gray-900 dark:text-white">
              Knowledge Check
            </h1>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuizQuestion
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={quiz.questions.length}
              onAnswer={handleAnswer}
              showResult={isAnswered}
              selectedAnswer={answers[currentQuestionIndex]}
              correctAnswer={currentQuestion.correctAnswer}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default QuizPage