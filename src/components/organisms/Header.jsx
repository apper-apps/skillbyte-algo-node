import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import ThemeToggle from '@/components/atoms/ThemeToggle'
import StreakCounter from '@/components/molecules/StreakCounter'
const Header = ({ darkMode, toggleDarkMode, userProgress }) => {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="Zap" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                SkillByte
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Micro Learning
              </p>
            </div>
          </div>

{/* Right section */}
          <div className="flex items-center space-x-4">
            {userProgress && (
              <StreakCounter streak={userProgress.streak} />
            )}
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ApperIcon name="Settings" className="w-5 h-5" />
            </button>
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header