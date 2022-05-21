<template>
  <div class="grid grid-flow-row">
    <div class="bg-gray-200">
        <h1 class="text-center font-bold">{{getHeading()}}</h1>
    </div>
    <div class="m-10 grid grid-flow-col grid-cols-10 grid-rows-1 gap-4 pt-5" v-if="done">
      <input v-for="index in totalPages" :key="index" type="button" :value="getPageRange(index)" class="cursor-pointer rounded" :class="getPageClass(index)" @click="gotoPage(index)"/>
    </div>
    <div class="grid grid-flow-row">
      <div v-for="index in totalPages" :key="index">
      <div class="grid grid-flow-col w-screen" v-if="page === index">
          <div v-for="(question, cindex) in getQuestions(index)" :key="question" class="w-full">
            <p class="border-black border-2 bg-gray-900 text-gray-50 text-center">{{question.index}}</p>
            <div v-for="(row, rindex) in question.numbers" :key="row" >
              <p class="border-black border-b-2 border-r-2 text-center" :class="getCellClass(rindex, cindex)">{{row}}</p>
            </div>
            <input type="text" class="border-4 w-full focus:border-red-700 border-t-2 border-l-2 focus:outline-none text-center" :class="getAnsweredClass()" v-model="question.answer" v-on:keyup.enter="onEnter(question)" :id="`q-${question.index}`" :autofocus="getAutoFocus(question.index)" :hidden="done"/>
            <div v-if="done">
              <p class="border-black border-b-2 border-r-2 text-center" :class="getResultClass(question)">{{getResultLine(question)}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="done" class="m-10 grid grid-cols-6">
      <button class="col-start-2 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700" @click="goHome()">Home</button>
      <button class="col-start-5 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700" @click="playAgain()">Play Again</button>
    </div>
  </div>
</template>

<script>

import { getUserSettings } from '../user-settings'
import { saveQA, saveAttempt } from '../db'

export default {
  name: 'Table',
  data() {
    return {
      startTs: null,
      endTs: null,
      started: false,
      remainingSeconds: 600,
      pageSize: 20,
      totalPages: 10,
      answer: 0,
      page: 1,
      questions: [],
      done: false,
      pattern: []
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },

    playAgain() {
      this.reset()
    },

    getPageRange(pageNumber) {
      let end = pageNumber * this.pageSize
      let start = (end - this.pageSize) + 1
      return `${start} - ${end}`
    },

    start() {
      this.started = true
      saveAttempt(this.startTs)
      var interval = setInterval(() => {
        this.remainingSeconds--
        if (this.done) {
          clearInterval(interval)
          return
        }
        if (this.remainingSeconds === 0) {
          this.stop()
          clearInterval(interval)
        }
      }, 1000)
    },

    stop() {
      this.done = true
      this.endTs = Date.now()
    },

    getAttemptedCount() {
      let answered = this.questions.filter((question) => {
        if (question.userAnswer !== null) {
          return true
        }
      })
      return answered.length
    },

    getCorrectCount() {
      let correctAnswers = this.questions.filter((question) => {
        if (question.status === 'correct') {
          return true
        }
      })
      return correctAnswers.length
    },

    getHeading() {
      if (!this.done) {
        return "Remaining time: " + this.getTimeRemaining()
      } else {
        let resultStr = `Attempted: ${this.getAttemptedCount()} Correct: ${this.getCorrectCount()} Time taken: `
        let secondsTaken = Math.floor((this.endTs - this.startTs) / 1000)
        let minutes = Math.floor(secondsTaken / 60)
        if (minutes) {
          resultStr = `${resultStr} ${String(minutes).padStart(2, '0')} minutes`
        }
        if (secondsTaken % 60) {
          resultStr = `${resultStr} ${String(secondsTaken % 60).padStart(2, '0')} seconds`
        }
        this.getAttemptedCount()
        return resultStr
      }
    },

    getTimeRemaining() {
      let rs = this.remainingSeconds 
      let minutes = String(Math.floor(rs / 60)).padStart(2, '0')
      let seconds = String(rs % 60).padStart(2, '0')
      return `${minutes}:${seconds}`
    },

    getResultLine(question) {
      if (question.status === 'correct') {
        return question.userAnswer
      }
      let uAnswer = question.userAnswer ? question.userAnswer : 'x'
      return `${uAnswer} (${question.correctAnswer})`
    },

    gotoPage(index) {
      this.page = index
    },

    getResultClass(question) {
      if (question.userAnswer === question.correctAnswer) {
        return "bg-green-300 text-green-900"
      } else {
        return "bg-red-300"
      }
    },

    getPageClass(index) {
      if (this.page === index) {
        return "bg-yellow-300 text-red-900"
      }
      return "bg-blue-300 text-white"
    },

    getAutoFocus(qindex) {
      if (qindex % 20 == 1) {
        return true
      }
      return false
    },

    getDisplayClass(page) {
      if (page === this.page) {
        return "grid"
      } else {
        return "hidden"
      }
    },

    getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    },

    getRandomMax(digits) {
      let digitCount = Math.floor(Math.random() * digits) + 1
      return Math.pow(10, digitCount) - 1
    },

    getMinMax(digits) {
      const minMaxMap = {1: [0, 9], 2: [10, 99], 3: [100, 999], 4: [1000, 9999]}
      return minMaxMap[digits]
    },

    generateQuestion(constraint, index) {
      const sign = [1, -1]
      const numbers = []
      let correctAnswer = 0
      
      for (let i = 0; i < constraint.rows; i++) {
        let [min, max] = this.getMinMax(constraint.digits)
        let unsigned = this.getRandomIntInclusive(min, max)
        let signed = unsigned * sign[Math.floor(Math.random() * sign.length)]
        if (correctAnswer >= Math.abs(signed)) {
          numbers.push(signed)
          correctAnswer += signed
        } else {
          numbers.push(unsigned)
          correctAnswer += unsigned
        }
      }
      
      return {index: index, numbers: numbers, correctAnswer: correctAnswer, userAnswer: null, status: null}
    },

    generateQuestions() {
      var questions = []
      for (let page = 1; page <= this.totalPages; page++) {
        for (let qindex = 0; qindex < this.pageSize; qindex++) {
          let index = ((page - 1) * this.pageSize) + (qindex + 1)
          let question = this.generateQuestion(this.pattern[page], index)
          question.ts = this.startTs
          questions.push(question)
        }
      }
      return questions
    },

    getQuestions(page) {
      let start = (page - 1) * this.pageSize
      let end = (page * this.pageSize) - 1 
      return this.questions.slice(start, end + 1)
    },

    onEnter(question) {
      let qindex = question.index
      let userAnswer = Number.parseInt(question.answer)
      question.userAnswer = userAnswer

      if (question.userAnswer === question.correctAnswer) {
        question.status = 'correct'
      }

      saveQA(JSON.parse(JSON.stringify(question)))

      if (qindex === this.pageSize * this.totalPages) {
        this.page = 1
        this.stop()
        return
      }
      if ((qindex % this.pageSize) === 0) {
        this.page += 1
        setTimeout((eid) => {
          document.getElementById(eid).focus()
        }, 500, `q-${qindex + 1}`)
      } else {
        document.getElementById(`q-${qindex + 1}`).focus()
      }
    },

    getCellClass(rindex, cindex) {
      var cls = ""
      if(rindex === 0)  {
        cls = cls + "border-t-2"
      }
      if(cindex === 0)  {
        cls = cls + " border-l-2"
      }
      return cls
    },

    getAnsweredClass() {
      return "border-gray-500"
    },

    reset() {
      this.startTs = Date.now()
      const userSettings = getUserSettings()
      this.questions = this.generateQuestions(this.startTs)
      this.done = false
      this.remainingSeconds = userSettings.totalTime * 60
      this.start()
      setTimeout(()=> {document.getElementById('q-1').focus()}, 1000)
    }
  },
  mounted() {
    this.questions = this.generateQuestions(this.startTs)
    setTimeout(()=> {document.getElementById('q-1').focus()}, 1000)
  },
  created() {
    const userSettings = getUserSettings()
    this.remainingSeconds = userSettings.totalTime * 60
    this.totalPages = userSettings.totalPages
    this.pattern = userSettings.config
    this.pageSize = userSettings.quesPerPage
    this.startTs = Date.now()
    this.start()
  }
}
</script>

<style>

</style>