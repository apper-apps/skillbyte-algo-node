import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TopicCard from '@/components/molecules/TopicCard'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { topicsService } from '@/services/api/topicsService'
import { userProgressService } from '@/services/api/userProgressService'

const HomePage = () => {
  const [topics, setTopics] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [topicsData, progressData, selectedTopicsData] = await Promise.all([
        topicsService.getAll(),
        userProgressService.getUserProgress(),
        topicsService.getSelectedTopics()
      ])
      
      setTopics(topicsData)
      setUserProgress(progressData)
      setSelectedTopics(selectedTopicsData.map(t => t.Id))
    } catch (err) {
      setError('Failed to load topics and progress data')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTopicSelect = async (topic) => {
    try {
      const isSelected = selectedTopics.includes(topic.Id)
      let newSelectedTopics

      if (isSelected) {
        newSelectedTopics = selectedTopics.filter(id => id !== topic.Id)
        await topicsService.unselectTopic(topic.Id)
        toast.success(`Removed ${topic.name} from your learning plan`)
      } else {
        newSelectedTopics = [...selectedTopics, topic.Id]
        await topicsService.selectTopic(topic.Id)
        toast.success(`Added ${topic.name} to your learning plan`)
      }

      setSelectedTopics(newSelectedTopics)
    } catch (error) {
      toast.error('Failed to update topic selection')
      console.error('Error updating topic selection:', error)
    }
  }

  const handleStartLearning = async () => {
    if (selectedTopics.length === 0) {
      toast.warning('Please select at least one topic to start learning')
      return
    }
    
    try {
      await userProgressService.initializeLearningPlan(selectedTopics)
      toast.success('Learning plan created! Check the Learn tab for your first lesson.')
    } catch (error) {
      toast.error('Failed to create learning plan')
      console.error('Error creating learning plan:', error)
    }
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  if (topics.length === 0) {
    return <Empty 
      icon="BookOpen"
      title="No Topics Available"
      description="We're working on adding learning topics. Please check back soon!"
    />
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg mb-4">
            <ApperIcon name="Zap" className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              3-minute daily lessons
            </span>
          </div>
          
          <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-3">
            Choose Your
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Learning Path</span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-sm mx-auto leading-relaxed">
            Select topics that interest you and get bite-sized lessons delivered daily
          </p>
        </motion.div>

        {/* Stats */}
        {userProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-display font-bold text-2xl text-primary-600 dark:text-primary-400">
                  {userProgress.streak}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-secondary-600 dark:text-secondary-400">
                  {userProgress.totalLessonsCompleted}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Lessons</div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-accent-600 dark:text-accent-400">
                  {Math.round(userProgress.overallMastery)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Mastery</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Topics Grid */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl text-gray-900 dark:text-white">
            Available Topics
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedTopics.length} selected
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {topics.map((topic, index) => (
            <TopicCard
              key={topic.Id}
              topic={topic}
              isSelected={selectedTopics.includes(topic.Id)}
              onSelect={handleTopicSelect}
              index={index}
            />
          ))}
        </div>

        {/* Action Button */}
        {selectedTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-24 z-30"
          >
            <Button
              variant="primary"
              size="lg"
              icon="PlayCircle"
              onClick={handleStartLearning}
              className="w-full shadow-2xl"
            >
              Start Learning ({selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''})
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default HomePage