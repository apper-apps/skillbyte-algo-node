import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { lessonsService } from '@/services/api/lessonsService'

const LessonDetailPage = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  useEffect(() => {
    loadLesson()
  }, [lessonId])

  const loadLesson = async () => {
    try {
      setLoading(true)
      setError('')
      
      const lessonData = await lessonsService.getById(parseInt(lessonId))
      setLesson(lessonData)
      setIsCompleted(!!lessonData.completedAt)
    } catch (err) {
      setError('Failed to load lesson')
      console.error('Error loading lesson:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteLesson = async () => {
    try {
      setIsCompleting(true)
      await lessonsService.markComplete(lesson.Id)
      setIsCompleted(true)
      toast.success('Lesson completed!')
    } catch (error) {
      toast.error('Failed to mark lesson as complete')
      console.error('Error completing lesson:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleStartQuiz = () => {
    navigate(`/quiz/${lesson.Id}`)
  }

  if (loading) return <Loading type="lesson" />
  if (error) return <Error message={error} onRetry={loadLesson} />
  if (!lesson) return <Error message="Lesson not found" />

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>{lesson.duration} min read</span>
          </div>

          {isCompleted && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <ApperIcon name="CheckCircle" className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Lesson Content */}
      <div className="px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-8 text-white">
            <h1 className="font-display font-bold text-2xl leading-tight mb-4">
              {lesson.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-white/80">
              <div className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" className="w-4 h-4" />
                <span className="text-sm">Lesson</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Timer" className="w-4 h-4" />
                <span className="text-sm">{lesson.duration} minutes</span>
              </div>
            </div>
          </div>

          {/* Image */}
          {lesson.imageUrl && (
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
              <img 
                src={lesson.imageUrl} 
                alt={lesson.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {lesson.content}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              {!isCompleted ? (
                <Button
                  variant="primary"
                  size="lg"
                  icon="CheckCircle"
                  onClick={handleCompleteLesson}
                  loading={isCompleting}
                  className="w-full"
                >
                  {isCompleting ? 'Completing...' : 'Mark as Complete'}
                </Button>
              ) : (
                <Button
                  variant="accent"
                  size="lg"
                  icon="Brain"
                  onClick={handleStartQuiz}
                  className="w-full"
                >
                  Take Quiz Now
                </Button>
              )}

              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="ArrowRight"
                  iconPosition="right"
                  onClick={() => navigate('/learn')}
                >
                  Back to Learning
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LessonDetailPage