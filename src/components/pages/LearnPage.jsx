import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import LessonCard from '@/components/molecules/LessonCard'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { lessonsService } from '@/services/api/lessonsService'
import { userProgressService } from '@/services/api/userProgressService'

const LearnPage = () => {
  const navigate = useNavigate()
  const [todaysLessons, setTodaysLessons] = useState([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTodaysLessons()
  }, [])

  const loadTodaysLessons = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [lessons, progress] = await Promise.all([
        lessonsService.getTodaysLessons(),
        userProgressService.getUserProgress()
      ])
      
      setTodaysLessons(lessons)
      setCompletedLessons(progress.completedLessonsToday || [])
    } catch (err) {
      setError('Failed to load today\'s lessons')
      console.error('Error loading lessons:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteLesson = async (lessonId) => {
    try {
      await lessonsService.markComplete(lessonId)
      setCompletedLessons(prev => [...prev, lessonId])
      toast.success('Lesson completed! Ready for the quiz?')
    } catch (error) {
      toast.error('Failed to mark lesson as complete')
      console.error('Error completing lesson:', error)
    }
  }

  const handleStartQuiz = (lessonId) => {
    navigate(`/quiz/${lessonId}`)
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < todaysLessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1)
    }
  }

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1)
    }
  }

  if (loading) return <Loading type="lesson" />
  if (error) return <Error message={error} onRetry={loadTodaysLessons} />
  
  if (todaysLessons.length === 0) {
    return <Empty 
      icon="BookOpen"
      title="No Lessons Today"
      description="Complete your topic selection on the Home page to get your first lesson!"
      actionText="Select Topics"
      onAction={() => navigate('/')}
    />
  }

  const currentLesson = todaysLessons[currentLessonIndex]
  const isCurrentLessonCompleted = completedLessons.includes(currentLesson?.Id)
  const progress = ((currentLessonIndex + (isCurrentLessonCompleted ? 1 : 0)) / todaysLessons.length) * 100

  return (
    <div className="min-h-screen py-6">
      {/* Header */}
      <div className="px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg mb-4">
            <ApperIcon name="Calendar" className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Today's Lessons
            </span>
          </div>
          
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
            Daily Learning
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400">
            Lesson {currentLessonIndex + 1} of {todaysLessons.length}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Lesson Card */}
      <div className="px-4 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLesson?.Id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <LessonCard
              lesson={currentLesson}
              onComplete={handleCompleteLesson}
              onStartQuiz={handleStartQuiz}
              isCompleted={isCurrentLessonCompleted}
              progress={progress}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            icon="ChevronLeft"
            onClick={handlePrevLesson}
            disabled={currentLessonIndex === 0}
            className="flex-1 mr-2"
          >
            Previous
          </Button>
          
          <div className="flex space-x-1 mx-4">
            {todaysLessons.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentLessonIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentLessonIndex
                    ? 'bg-primary-500'
                    : index < currentLessonIndex || completedLessons.includes(todaysLessons[index]?.Id)
                    ? 'bg-green-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="ghost"
            icon="ChevronRight"
            iconPosition="right"
            onClick={handleNextLesson}
            disabled={currentLessonIndex === todaysLessons.length - 1}
            className="flex-1 ml-2"
          >
            Next
          </Button>
        </div>
      </div>

      {/* All lessons completed */}
      {completedLessons.length === todaysLessons.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mt-8"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 text-center border border-green-200 dark:border-green-800">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Trophy" className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
              All Done for Today! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You've completed all your lessons. Check back tomorrow for more!
            </p>
            <Button
              variant="accent"
              icon="TrendingUp"
              onClick={() => navigate('/progress')}
            >
              View Progress
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default LearnPage