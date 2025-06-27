import React, { useEffect, useState } from 'react'
import Header from '@/components/organisms/Header'
import BottomNavigation from '@/components/organisms/BottomNavigation'
import { userProgressService } from '@/services/api/userProgressService'

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const [userProgress, setUserProgress] = useState(null)

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const progress = await userProgressService.getUserProgress()
        setUserProgress(progress)
      } catch (error) {
        console.error('Failed to load user progress:', error)
      }
    }

    loadUserProgress()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        userProgress={userProgress}
      />
      
      <main className="flex-1 pb-20">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  )
}

export default Layout