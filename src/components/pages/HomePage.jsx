import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { llmService } from "@/services/api/llmService";
import { topicsService } from "@/services/api/topicsService";
import { lessonsService } from "@/services/api/lessonsService";
import { userProgressService } from "@/services/api/userProgressService";
import ApperIcon from "@/components/ApperIcon";
import TopicCard from "@/components/molecules/TopicCard";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
const HomePage = () => {
const [topics, setTopics] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCustomTopicModal, setShowCustomTopicModal] = useState(false)
  const [customTopicInput, setCustomTopicInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
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

  const handleCreateCustomTopic = async () => {
    if (!customTopicInput.trim()) {
      toast.warning('Please enter a topic name')
      return
    }

    if (customTopicInput.length > 100) {
      toast.warning('Topic name must be 100 characters or less')
      return
    }

    try {
      setIsGenerating(true)
      await userProgressService.setGenerationStatus(customTopicInput, 'generating')
      toast.info('Generating lessons for your custom topic... This may take a moment.')

      // Generate lessons using LLM
      const generatedLessons = await llmService.generateLessons(customTopicInput, 5)
      
      // Create custom topic
      const customTopic = {
        Id: Date.now(),
        name: customTopicInput,
        icon: 'BookOpen',
        difficulty: 'Beginner',
        totalLessons: generatedLessons.length,
        description: `Custom generated lessons about ${customTopicInput}`,
        isCustom: true,
        generatedAt: new Date().toISOString()
      }

      // Update lessons with proper topic ID
      const updatedLessons = generatedLessons.map(lesson => ({
        ...lesson,
        topicId: customTopic.Id
      }))

      // Save to services
      await lessonsService.addCustomLessons(updatedLessons)
      await topicsService.addCustomTopic(customTopic)
      await userProgressService.setGenerationStatus(customTopicInput, 'completed')

      // Update local state
      setTopics(prev => [...prev, customTopic])
      setCustomTopicInput('')
      setShowCustomTopicModal(false)
      
      toast.success(`Successfully created "${customTopic.name}" with ${updatedLessons.length} lessons!`)
      
    } catch (error) {
      console.error('Error creating custom topic:', error)
      await userProgressService.setGenerationStatus(customTopicInput, 'error')
      toast.error('Failed to generate custom topic. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

const CustomTopicModal = memo(() => {
    const handleInputChange = useCallback((e) => {
      setCustomTopicInput(e.target.value);
    }, []);

    const characterCount = useMemo(() => {
      return `${customTopicInput.length}/100 characters`;
    }, [customTopicInput.length]);

    return (
      <AnimatePresence>
        {showCustomTopicModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !isGenerating && setShowCustomTopicModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">
                  Create Custom Topic
                </h3>
                {!isGenerating && (
                  <button
                    onClick={() => setShowCustomTopicModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <ApperIcon name="X" className="w-6 h-6" />
                  </button>
                )}
              </div>

              {isGenerating ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <ApperIcon name="Sparkles" className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    Generating Your Lessons
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Our AI is creating personalized lessons for "{customTopicInput}". This usually takes 30-60 seconds.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What would you like to learn about?
                    </label>
                    <input
                      type="text"
                      value={customTopicInput}
                      onChange={handleInputChange}
                      placeholder="e.g., Quantum Physics, Creative Writing, Guitar Basics..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {characterCount}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Info" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          How it works
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-200">
                          We'll use AI to generate 5 personalized lessons on your topic, complete with quizzes and key learning points.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="ghost"
                      onClick={() => setShowCustomTopicModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleCreateCustomTopic}
                      disabled={!customTopicInput.trim()}
                      className="flex-1"
                      icon="Sparkles"
                    >
                      Generate Lessons
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  });
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

        {/* Custom Topic Creation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="Sparkles" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                  Create Custom Topic
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter any topic and we'll generate personalized lessons using AI
                </p>
              </div>
            </div>
            <Button
              variant="accent"
              icon="Plus"
              onClick={() => setShowCustomTopicModal(true)}
              className="w-full"
            >
              Create Your Own Topic
            </Button>
          </div>
        </motion.div>
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

      <CustomTopicModal />
    </div>
  )
}

export default HomePage