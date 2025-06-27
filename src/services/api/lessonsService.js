import lessonsData from '@/services/mockData/lessons.json'

class LessonsService {
  constructor() {
    this.lessons = [...lessonsData]
    this.completedLessons = this.loadCompletedLessons()
  }

  loadCompletedLessons() {
    const saved = localStorage.getItem('skillbyte-completed-lessons')
    return saved ? JSON.parse(saved) : []
  }

  saveCompletedLessons() {
    localStorage.setItem('skillbyte-completed-lessons', JSON.stringify(this.completedLessons))
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.lessons])
      }, 300)
    })
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lesson = this.lessons.find(l => l.Id === id)
        if (lesson) {
          const isCompleted = this.completedLessons.includes(id)
          resolve({ 
            ...lesson, 
            completedAt: isCompleted ? new Date().toISOString() : null 
          })
        } else {
          reject(new Error('Lesson not found'))
        }
      }, 200)
    })
  }

  async getTodaysLessons() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get selected topics from localStorage
        const selectedTopics = JSON.parse(localStorage.getItem('skillbyte-selected-topics') || '[]')
        
        if (selectedTopics.length === 0) {
          resolve([])
          return
        }

        // Get lessons for selected topics
        const todaysLessons = this.lessons
          .filter(lesson => selectedTopics.includes(lesson.topicId))
          .slice(0, 3) // Limit to 3 lessons per day
          .map(lesson => ({
            ...lesson,
            completedAt: this.completedLessons.includes(lesson.Id) ? new Date().toISOString() : null
          }))

        resolve(todaysLessons)
      }, 400)
    })
  }

  async getLessonsByTopic(topicId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topicLessons = this.lessons
          .filter(lesson => lesson.topicId === topicId)
          .map(lesson => ({
            ...lesson,
            completedAt: this.completedLessons.includes(lesson.Id) ? new Date().toISOString() : null
          }))
        resolve(topicLessons)
      }, 250)
    })
  }

  async markComplete(lessonId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.completedLessons.includes(lessonId)) {
          this.completedLessons.push(lessonId)
          this.saveCompletedLessons()
        }
        resolve()
      }, 300)
    })
  }

  async getCompletedLessons() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.completedLessons])
      }, 200)
    })
  }
}

export const lessonsService = new LessonsService()