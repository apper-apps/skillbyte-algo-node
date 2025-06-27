import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  icon = "BookOpen",
  title = "Nothing here yet",
  description = "Start your learning journey by selecting topics that interest you.",
  actionText = "Get Started",
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={icon} className="w-10 h-10 text-primary-500" />
      </motion.div>

      <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
        {description}
      </p>

      {onAction && (
        <Button
          variant="primary"
          icon="ArrowRight"
          iconPosition="right"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty