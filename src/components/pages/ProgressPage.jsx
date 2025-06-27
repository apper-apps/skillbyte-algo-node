import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TopicCard from '@/components/molecules/TopicCard'
import ProgressRing from '@/components/atoms/ProgressRing'
import StreakCounter from '@/components/molecules/StreakCounter'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { userProgressService } from '@/services/api/userProgressService'
import { topicsService } from '@/services/api/topicsService'

const ProgressPage = () => {
  const [userProgress, setUserProgress] = useState(null)
  const [selectedTopics, setSelectedTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [progressData, topicsData] = await Promise.all([
        userProgressService.getUserProgress(),
        topicsService.getSelectedTopics()
      ])
      
      setUserProgress(progressData)
      setSelectedTopics(topicsData)
    } catch (err) {
      setError('Failed to load progress data')
      console.error('Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }

  const getAchievementBadges = () => {
    if (!userProgress) return []
    
    const badges = []
    if (userProgress.streak >= 7) badges.push({ name: 'Week Warrior', icon: 'Flame', variant: 'warning' })
    if (userProgress.streak >= 30) badges.push({ name: 'Month Master', icon: 'Crown', variant: 'accent' })
    if (userProgress.totalLessonsCompleted >= 50) badges.push({ name: 'Learning Legend', icon: 'Award', variant: 'primary' })
    if (userProgress.overallMastery >= 80) badges.push({ name: 'Skill Master', icon: 'Trophy', variant: 'success' })
    
    return badges
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadProgressData} />
  
  if (!userProgress || selectedTopics.length === 0) {
    return <Empty 
      icon="TrendingUp"
      title="No Progress Yet"
      description="Start learning to see your progress and achievements here!"
      actionText="Begin Learning"
      onAction={() => window.location.href = '/'}
    />
  }

  const achievements = getAchievementBadges()

  return (
    <div className="min-h-screen py-6">
      {/* Header */}
      <div className="px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-2">
            Your
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Progress</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning journey and achievements
          </p>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-center mb-8">
            <ProgressRing 
              progress={userProgress.overallMastery} 
              size={140} 
              strokeWidth={10}
              colors={['#6366F1', '#8B5CF6']}
            >
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-gray-900 dark:text-white">
                  {Math.round(userProgress.overallMastery)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Overall Mastery
                </div>
              </div>
            </ProgressRing>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <StreakCounter streak={userProgress.streak} className="justify-center" />
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                {userProgress.totalLessonsCompleted}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Lessons Completed
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="px-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-4">
              Achievements
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((badge, index) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${
                    badge.variant === 'warning' ? 'from-yellow-400 to-orange-500' :
                    badge.variant === 'accent' ? 'from-pink-400 to-purple-500' :
                    badge.variant === 'primary' ? 'from-blue-400 to-purple-500' :
                    'from-green-400 to-emerald-500'
                  } rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <ApperIcon name={badge.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                    {badge.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Topic Progress */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-6">
            Topic Progress
          </h2>
          <div className="space-y-4">
            {selectedTopics.map((topic, index) => (
              <TopicCard
                key={topic.Id}
                topic={topic}
                showProgress={true}
                index={index}
                onSelect={() => {}} // No selection functionality on progress page
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Daily Goal */}
      <div className="px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 rounded-2xl p-6 border border-accent-200 dark:border-accent-800"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Target" className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-1">
                Daily Goal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Complete {userProgress.dailyGoal} lesson{userProgress.dailyGoal > 1 ? 's' : ''} per day to maintain your streak
              </p>
            </div>
            <Badge variant="accent" size="md">
              {userProgress.dailyGoal}/day
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProgressPage