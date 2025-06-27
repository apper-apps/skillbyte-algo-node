class UserProgressService {
  constructor() {
    this.progress = this.loadProgress()
  }

  loadProgress() {
    const saved = localStorage.getItem('skillbyte-user-progress')
    return saved ? JSON.parse(saved) : {
      userId: "user-1",
      streak: 0,
      totalLessonsCompleted: 0,
      overallMastery: 0,
      dailyGoal: 1,
      lastActiveDate: null,
      completedLessonsToday: []
    }
  }

  saveProgress() {
    localStorage.setItem('skillbyte-user-progress', JSON.stringify(this.progress))
  }

  async getUserProgress() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update streak based on activity
        this.updateStreak()
        resolve({ ...this.progress })
      }, 200)
    })
  }

  async updateProgress(lessonId, quizScore) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toDateString()
        
        // Update completed lessons
        if (!this.progress.completedLessonsToday.includes(lessonId)) {
          this.progress.completedLessonsToday.push(lessonId)
          this.progress.totalLessonsCompleted++
        }

        // Update streak if first lesson today
        if (this.progress.lastActiveDate !== today) {
          this.progress.streak++
          this.progress.lastActiveDate = today
        }

        // Update overall mastery (weighted average)
        const currentMastery = this.progress.overallMastery
        const newMastery = (currentMastery * (this.progress.totalLessonsCompleted - 1) + quizScore) / this.progress.totalLessonsCompleted
        this.progress.overallMastery = Math.min(100, newMastery)

        this.saveProgress()
        resolve({ ...this.progress })
      }, 300)
    })
  }

  async initializeLearningPlan(selectedTopicIds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Reset daily progress for new plan
        this.progress.completedLessonsToday = []
        this.saveProgress()
        resolve()
      }, 200)
    })
  }

  updateStreak() {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const todayStr = today.toDateString()
    const yesterdayStr = yesterday.toDateString()
    
    if (this.progress.lastActiveDate === todayStr) {
      // Already active today, streak is current
      return
    } else if (this.progress.lastActiveDate === yesterdayStr) {
      // Was active yesterday, streak continues but don't increment until activity today
      return
    } else if (this.progress.lastActiveDate && this.progress.lastActiveDate !== todayStr) {
      // Was active more than a day ago, reset streak
      this.progress.streak = 0
      this.progress.completedLessonsToday = []
      this.saveProgress()
    }
  }

  async resetProgress() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.progress = {
          userId: "user-1",
          streak: 0,
          totalLessonsCompleted: 0,
          overallMastery: 0,
          dailyGoal: 1,
          lastActiveDate: null,
          completedLessonsToday: []
        }
        this.saveProgress()
        resolve()
      }, 200)
    })
  }
}

export const userProgressService = new UserProgressService()