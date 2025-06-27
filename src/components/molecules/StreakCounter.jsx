import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StreakCounter = ({ streak, className = '' }) => {
  const getFlameSize = () => {
    if (streak >= 30) return 'w-8 h-8'
    if (streak >= 14) return 'w-7 h-7'
    if (streak >= 7) return 'w-6 h-6'
    return 'w-5 h-5'
  }

  const getFlameColor = () => {
    if (streak >= 30) return 'text-orange-500'
    if (streak >= 14) return 'text-red-500'
    if (streak >= 7) return 'text-yellow-500'
    return 'text-gray-400'
  }

  return (
    <motion.div
      className={`flex items-center space-x-2 ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ 
          scale: streak > 0 ? [1, 1.1, 1] : 1,
          rotate: streak > 0 ? [0, 5, -5, 0] : 0
        }}
        transition={{ 
          duration: 2,
          repeat: streak > 0 ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        <ApperIcon 
          name="Flame" 
          className={`${getFlameSize()} ${getFlameColor()}`} 
        />
      </motion.div>
      
      <div>
        <div className="font-display font-bold text-lg text-gray-900 dark:text-white">
          {streak}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
          day streak
        </div>
      </div>
    </motion.div>
  )
}

export default StreakCounter