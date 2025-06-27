import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProgressRing from "@/components/atoms/ProgressRing";

const LessonCard = ({ 
  lesson, 
  onComplete, 
  onStartQuiz, 
  isCompleted = false,
  progress = 0 
}) => {
  const [isReading, setIsReading] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-10, 10])
const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

  const handleDragEnd = (event, info) => {
    const threshold = 100
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiped right - mark as read
        handleCompleteLesson()
      } else {
        // Swiped left - skip for now
        // Could implement skip functionality here
      }
    }
  }

  const handleCompleteLesson = () => {
    setIsReading(true)
    setTimeout(() => {
      onComplete(lesson.Id)
      setIsReading(false)
    }, 1500)
  }

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
    >
      {/* Swipe indicators */}
      <div className="swipe-indicator left">
        <div className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
          <ApperIcon name="SkipForward" className="w-4 h-4" />
          <span className="text-sm font-medium">Skip</span>
        </div>
      </div>
      
      <div className="swipe-indicator right">
        <div className="bg-green-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
          <ApperIcon name="CheckCircle" className="w-4 h-4" />
          <span className="text-sm font-medium">Complete</span>
        </div>
      </div>

      <motion.div
        style={{ opacity }}
        className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 ${
          isReading ? 'animate-pulse' : ''
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="BookOpen" className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">3-minute lesson</span>
            </div>
            <ProgressRing progress={progress} size={40} strokeWidth={3}>
              <span className="text-xs font-bold text-white">
                {Math.round(progress)}%
              </span>
            </ProgressRing>
          </div>
          
          <h2 className="font-display font-bold text-xl leading-tight">
            {lesson.title}
          </h2>
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
        <div className="p-6">
          <div className={`prose prose-sm dark:prose-invert max-w-none ${
            isReading ? 'animate-pulse' : ''
          }`}>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {lesson.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3 mt-6">
            {!isCompleted ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  icon="CheckCircle"
                  onClick={handleCompleteLesson}
                  loading={isReading}
                  className="w-full"
                >
                  {isReading ? 'Processing...' : 'Mark as Complete'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="md"
                  icon="ArrowRight"
                  iconPosition="right"
                  onClick={() => onStartQuiz(lesson.Id)}
                  className="w-full"
                >
                  Skip to Quiz
                </Button>
              </>
            ) : (
              <Button
                variant="accent"
                size="lg"
                icon="Brain"
                onClick={() => onStartQuiz(lesson.Id)}
                className="w-full"
              >
                Take Quiz Now
              </Button>
            )}
          </div>

          {/* Swipe hint */}
          <div className="flex items-center justify-center mt-4 text-xs text-gray-500 dark:text-gray-400">
            <ApperIcon name="ArrowLeft" className="w-3 h-3 mr-1" />
            <span>Swipe left to skip</span>
            <span className="mx-2">•</span>
            <span>Swipe right to complete</span>
            <ApperIcon name="ArrowRight" className="w-3 h-3 ml-1" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LessonCard