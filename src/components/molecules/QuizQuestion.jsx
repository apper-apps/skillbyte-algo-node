import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const QuizQuestion = ({ 
  question, 
  questionIndex, 
  totalQuestions, 
  onAnswer,
  showResult = false,
  selectedAnswer = null,
  correctAnswer = null
}) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)

  // Sync with props only when they change, not on every render
  React.useEffect(() => {
    if (selectedAnswer !== null && selectedAnswer !== selectedOption) {
      setSelectedOption(selectedAnswer)
    }
  }, [selectedAnswer])

  React.useEffect(() => {
    if (showResult !== isAnswered) {
      setIsAnswered(showResult)
    }
  }, [showResult])
  const handleOptionSelect = (optionIndex) => {
    if (isAnswered) return
    setSelectedOption(optionIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return
    setIsAnswered(true)
    onAnswer(selectedOption)
  }

  const getOptionStyle = (optionIndex) => {
    if (!isAnswered) {
      return selectedOption === optionIndex
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
    }

    // Show results
    if (optionIndex === correctAnswer) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20'
    } else if (optionIndex === selectedOption && optionIndex !== correctAnswer) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20'
    } else {
      return 'border-gray-200 dark:border-gray-700 opacity-60'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Question {questionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(((questionIndex + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-6 leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${getOptionStyle(index)}`}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {option}
                </span>
                
                {isAnswered && (
                  <div className="flex-shrink-0 ml-3">
                    {index === correctAnswer ? (
                      <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500" />
                    ) : index === selectedOption && index !== correctAnswer ? (
                      <ApperIcon name="XCircle" className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                )}
                
                {!isAnswered && selectedOption === index && (
                  <div className="w-5 h-5 bg-primary-500 rounded-full flex-shrink-0 ml-3" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Submit button */}
        {selectedOption !== null && !isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              variant="primary"
              size="lg"
              icon="ArrowRight"
              iconPosition="right"
              onClick={handleSubmitAnswer}
              className="w-full"
            >
              Submit Answer
            </Button>
          </motion.div>
        )}

        {/* Result feedback */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex items-start space-x-3">
              <ApperIcon 
                name={selectedOption === correctAnswer ? "CheckCircle" : "XCircle"} 
                className={`w-5 h-5 mt-0.5 ${
                  selectedOption === correctAnswer ? "text-green-500" : "text-red-500"
                }`} 
              />
              <div>
                <p className={`font-medium ${
                  selectedOption === correctAnswer ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                }`}>
                  {selectedOption === correctAnswer ? "Correct!" : "Incorrect"}
                </p>
                {question.explanation && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {question.explanation}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default QuizQuestion