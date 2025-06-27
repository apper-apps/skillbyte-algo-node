import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {darkMode ? (
          <ApperIcon name="Moon" className="w-5 h-5 text-purple-400" />
        ) : (
          <ApperIcon name="Sun" className="w-5 h-5 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle