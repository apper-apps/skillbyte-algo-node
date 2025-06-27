import quizzesData from '@/services/mockData/quizzes.json'

class QuizService {
  constructor() {
    this.quizzes = [...quizzesData]
    this.completedQuizzes = this.loadCompletedQuizzes()
  }

  loadCompletedQuizzes() {
    const saved = localStorage.getItem('skillbyte-completed-quizzes')
    return saved ? JSON.parse(saved) : []
  }

  saveCompletedQuizzes() {
    localStorage.setItem('skillbyte-completed-quizzes', JSON.stringify(this.completedQuizzes))
  }

async getQuizForLesson(lessonId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const quiz = this.quizzes.find(q => q.lessonId === lessonId)
        if (quiz) {
          resolve({ ...quiz })
        } else {
          // Return null instead of rejecting - missing quiz is not an error
          resolve(null)
        }
      }, 300)
    })
  }

  async submitQuiz(quizId, answers, score) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const quizResult = {
          quizId,
          answers,
          score,
          completedAt: new Date().toISOString()
        }
        
        // Remove existing result for this quiz if any
        this.completedQuizzes = this.completedQuizzes.filter(q => q.quizId !== quizId)
        this.completedQuizzes.push(quizResult)
        this.saveCompletedQuizzes()
        
        resolve(quizResult)
      }, 400)
    })
  }

  async getQuizResults(quizId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.completedQuizzes.find(q => q.quizId === quizId)
        resolve(result || null)
      }, 200)
    })
  }

  async getAllCompletedQuizzes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.completedQuizzes])
      }, 250)
    })
  }
}

export const quizService = new QuizService()