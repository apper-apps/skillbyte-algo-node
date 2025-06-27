import topicsData from '@/services/mockData/topics.json'

class TopicsService {
  constructor() {
    this.topics = [...topicsData]
    this.selectedTopics = this.loadSelectedTopics()
  }

  loadSelectedTopics() {
    const saved = localStorage.getItem('skillbyte-selected-topics')
    return saved ? JSON.parse(saved) : []
  }

  saveSelectedTopics() {
    localStorage.setItem('skillbyte-selected-topics', JSON.stringify(this.selectedTopics))
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.topics])
      }, 300)
    })
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const topic = this.topics.find(t => t.Id === id)
        if (topic) {
          resolve({ ...topic })
        } else {
          reject(new Error('Topic not found'))
        }
      }, 200)
    })
  }

  async getSelectedTopics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const selected = this.topics.filter(topic => 
          this.selectedTopics.includes(topic.Id)
        ).map(topic => ({
          ...topic,
          completedLessons: Math.floor(Math.random() * topic.totalLessons),
          masteryPercentage: Math.floor(Math.random() * 100)
        }))
        resolve(selected)
      }, 250)
    })
  }

  async selectTopic(topicId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.selectedTopics.includes(topicId)) {
          this.selectedTopics.push(topicId)
          this.saveSelectedTopics()
        }
        resolve()
      }, 200)
    })
  }

  async unselectTopic(topicId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.selectedTopics = this.selectedTopics.filter(id => id !== topicId)
        this.saveSelectedTopics()
        resolve()
      }, 200)
    })
  }
}

export const topicsService = new TopicsService()