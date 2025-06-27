import topicsData from "@/services/mockData/topics.json";
import React from "react";
import Error from "@/components/ui/Error";

class TopicsService {
  constructor() {
    this.topics = [...topicsData]
    this.customTopics = this.loadCustomTopics()
    this.selectedTopics = this.loadSelectedTopics()
  }

  loadCustomTopics() {
    const saved = localStorage.getItem('skillbyte-custom-topics')
    return saved ? JSON.parse(saved) : []
  }

  saveCustomTopics() {
    localStorage.setItem('skillbyte-custom-topics', JSON.stringify(this.customTopics))
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
        const allTopics = [...this.topics, ...this.customTopics]
        resolve(allTopics)
      }, 300)
    })
  }

async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const allTopics = [...this.topics, ...this.customTopics]
        const topic = allTopics.find(t => t.Id === id)
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

  async addCustomTopic(topic) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.customTopics.push(topic)
        this.saveCustomTopics()
        resolve(topic)
      }, 200)
    })
  }

  async getCustomTopics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.customTopics])
      }, 200)
    })
  }
}

export const topicsService = new TopicsService()