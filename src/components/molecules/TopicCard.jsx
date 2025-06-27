import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import ProgressRing from '@/components/atoms/ProgressRing'

const TopicCard = ({ 
  topic, 
  isSelected, 
  onSelect, 
  showProgress = false,
  index = 0 
}) => {
  const difficultyColors = {
    'Beginner': 'success',
    'Intermediate': 'warning', 
    'Advanced': 'error'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        onClick={() => onSelect(topic)}
        className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
          isSelected
            ? 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-700 shadow-lg'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 shadow-md hover:shadow-lg'
        }`}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Check" className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`p-3 rounded-xl ${
            isSelected
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500'
              : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600'
          }`}>
            <ApperIcon 
              name={topic.icon} 
              className={`w-6 h-6 ${
                isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`} 
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white truncate">
                {topic.name}
              </h3>
              {showProgress && (
                <div className="ml-4 flex-shrink-0">
                  <ProgressRing 
                    progress={topic.masteryPercentage} 
                    size={48} 
                    strokeWidth={4}
                  >
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {Math.round(topic.masteryPercentage)}%
                    </span>
                  </ProgressRing>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <Badge variant={difficultyColors[topic.difficulty]} size="xs">
                {topic.difficulty}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {topic.totalLessons} lessons
              </span>
            </div>

            {showProgress && (
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{topic.completedLessons}/{topic.totalLessons} completed</span>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Target" className="w-4 h-4" />
                  <span>{Math.round(topic.masteryPercentage)}% mastery</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TopicCard