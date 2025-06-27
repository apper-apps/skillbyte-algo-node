import OpenAI from 'openai'

class LLMService {
  constructor() {
    this.initializeClient()
  }

  getUserSettings() {
    const saved = localStorage.getItem('skillbyte-settings')
    return saved ? JSON.parse(saved) : null
  }

  initializeClient() {
    // Check user settings first, then fall back to environment variables
    const userSettings = this.getUserSettings()
    const apiKey = userSettings?.apiKey || import.meta.env.VITE_OPENAI_API_KEY
    
    // Validate API key
    if (!apiKey || apiKey === 'your-openai-api-key-here' || apiKey === 'your-api-key-here') {
      console.warn('⚠️ OpenAI API key is missing or using placeholder value.')
      console.warn('Please configure your API key in Settings or set VITE_OPENAI_API_KEY in your .env file.')
      console.warn('Get your API key from: https://platform.openai.com/account/api-keys')
    }
    
    this.client = new OpenAI({
      apiKey: apiKey || 'your-api-key-here',
      dangerouslyAllowBrowser: true // Only for demo purposes
    })
    
    this.isValidApiKey = apiKey && apiKey !== 'your-openai-api-key-here' && apiKey !== 'your-api-key-here'
  }
  
// Helper method to check if API is properly configured
  validateApiKey() {
    if (!this.isValidApiKey) {
      throw new Error('OpenAI API key is not configured. Please configure your API key in Settings or set VITE_OPENAI_API_KEY in your .env file. Get your API key from: https://platform.openai.com/account/api-keys')
    }
  }

  // Method to update settings and reinitialize client
  updateSettings() {
    this.initializeClient()
  }
  async generateLessons(topic, numLessons = 5) {
    try {
      const prompt = `Create ${numLessons} educational lessons for the topic: "${topic}".

Format the response as a JSON array with this exact structure:
[
  {
    "Id": 1,
    "title": "Lesson Title",
    "content": "Detailed lesson content explaining concepts clearly",
    "duration": "3 min",
    "topicId": "custom_${Date.now()}",
    "difficulty": "Beginner|Intermediate|Advanced",
    "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
  }
]

Make each lesson:
- 3-5 minutes of reading time
- Educational and informative
- Progressive in difficulty
- Include 3-5 key learning points
- Appropriate for self-paced learning`
const userSettings = this.getUserSettings()
      const selectedModel = userSettings?.selectedModel || "gpt-3.5-turbo"

      const response = await this.client.chat.completions.create({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator. Generate high-quality, structured lessons that are engaging and informative."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const content = response.choices[0].message.content
      const lessons = JSON.parse(content)
      
      // Ensure proper structure and add generated timestamp
      return lessons.map((lesson, index) => ({
        ...lesson,
        Id: Date.now() + index,
        topicId: `custom_${Date.now()}`,
        isCustom: true,
        generatedAt: new Date().toISOString()
      }))

    } catch (error) {
      console.error('Error generating lessons:', error)
      throw new Error('Failed to generate lessons. Please try again.')
    }
  }

  async generateQuizQuestions(lessonContent, numQuestions = 3) {
    try {
      const prompt = `Based on this lesson content, create ${numQuestions} multiple choice quiz questions:

"${lessonContent}"

Format as JSON array:
[
  {
    "Id": 1,
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct"
  }
]

Make questions:
- Test understanding of key concepts
- Have 4 options each
- Include brief explanations
- Vary in difficulty`
const userSettings = this.getUserSettings()
      const selectedModel = userSettings?.selectedModel || "gpt-3.5-turbo"

      const response = await this.client.chat.completions.create({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: "You are an expert quiz creator. Generate challenging but fair questions that test comprehension."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      })

      const content = response.choices[0].message.content
      const questions = JSON.parse(content)
      
      return questions.map((q, index) => ({
        ...q,
        Id: Date.now() + index
      }))

    } catch (error) {
      console.error('Error generating quiz questions:', error)
      throw new Error('Failed to generate quiz questions. Please try again.')
    }
  }
}

export const llmService = new LLMService()