import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { llmService } from '@/services/api/llmService'

const SettingsPage = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    apiKey: '',
    selectedModel: 'gpt-3.5-turbo'
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const availableModels = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for most tasks' },
    { id: 'gpt-4', name: 'GPT-4', description: 'More capable, slower and expensive' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Latest GPT-4 with improved performance' }
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const saved = localStorage.getItem('skillbyte-settings')
    if (saved) {
      const parsedSettings = JSON.parse(saved)
      setSettings(parsedSettings)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings.apiKey.trim()) {
      toast.warning('Please enter your OpenAI API key')
      return
    }

    // Basic API key format validation
    if (!settings.apiKey.startsWith('sk-') || settings.apiKey.length < 20) {
      toast.error('Invalid API key format. OpenAI API keys start with "sk-" and are longer.')
      return
    }

    try {
      setIsLoading(true)
      
      // Save to localStorage
      localStorage.setItem('skillbyte-settings', JSON.stringify(settings))
      
      // Update the LLM service
      llmService.updateSettings()
      
      toast.success('Settings saved successfully!')
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/')
      }, 1500)
      
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSettings = () => {
    if (confirm('Are you sure you want to clear all settings? This will remove your API key.')) {
      localStorage.removeItem('skillbyte-settings')
      setSettings({
        apiKey: '',
        selectedModel: 'gpt-3.5-turbo'
      })
      llmService.updateSettings()
      toast.info('Settings cleared successfully')
    }
  }

  const maskApiKey = (key) => {
    if (key.length <= 8) return key
    return key.substring(0, 7) + '•'.repeat(key.length - 11) + key.substring(key.length - 4)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              </button>
              <h1 className="font-display font-bold text-xl text-gray-900 dark:text-white">
                Settings
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* AI Configuration Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="Brain" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                  AI Configuration
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure your OpenAI settings
                </p>
              </div>
            </div>

            {/* API Key Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={settings.apiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ApperIcon name={showApiKey ? "EyeOff" : "Eye"} className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get your API key from{' '}
                <a 
                  href="https://platform.openai.com/account/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-600 underline"
                >
                  OpenAI Platform
                </a>
              </p>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                AI Model
              </label>
              <div className="space-y-3">
                {availableModels.map((model) => (
                  <div key={model.id}>
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="model"
                        value={model.id}
                        checked={settings.selectedModel === model.id}
                        onChange={(e) => setSettings(prev => ({ ...prev, selectedModel: e.target.value }))}
                        className="mt-1 w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:bg-gray-700"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {model.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {model.description}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Info" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Privacy & Security
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-200">
                    Your API key is stored locally on your device and is used directly with OpenAI's servers. 
                    We never send your API key to our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={handleClearSettings}
                disabled={isLoading}
                className="flex-1"
                icon="Trash2"
              >
                Clear
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                disabled={isLoading || !settings.apiKey.trim()}
                className="flex-1"
                icon="Save"
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>

          {/* Current Settings Display */}
          {settings.apiKey && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-start space-x-3">
                <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                    Configuration Active
                  </h4>
                  <p className="text-xs text-green-700 dark:text-green-200 mb-2">
                    API Key: {showApiKey ? settings.apiKey : maskApiKey(settings.apiKey)}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-200">
                    Model: {availableModels.find(m => m.id === settings.selectedModel)?.name}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsPage