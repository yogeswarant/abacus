<template>
  <div class="mt-10">
    <div class="container mx-auto px-4 h-fill bg-gray-50">
      <h1 class="text-3xl text-center p-2">Configure question pattern</h1>

      <div v-if="message" class="border-2 p-2 m-2 rounded text-center" :class="getMessageClass()">
            <p class="font-bold">{{message}}</p>
      </div>

      <div class="grid grid-cols-3 gap-4 justify-items-center">
        <div class="md:items-center text-center block">
          <div class="inline-block align-middle">
            <div class="border-black border-4 rounded mb-2 focus-within:border-blue-400">
              <div class="bg-gray-600 p-3 text-white w-60 inline-block">Total time (In minutes)</div>
              <input class="p-3 w-12 rounded-r inline-block focus:outline-none" type="number" id="totalTime" v-model="totalTime">
            </div>
            <div class="border-black border-4 rounded mb-2 focus-within:border-blue-400">
              <div class="bg-gray-600 p-3 text-white w-60 inline-block">Total pages (Max 10)</div>
              <input class="p-3 w-12 rounded-r inline-block focus:outline-none" type="number" id="totalPages" v-model="totalPages" @input="validateTotalPages">
            </div>
            <div class="border-black border-4 rounded mb-2 focus-within:border-blue-400">
              <div class="bg-gray-600 p-3 text-white w-60 inline-block">Questions per page (Max 20)</div>
              <input class="p-3 w-12 rounded-r inline-block focus:outline-none" type="number" id="quesPerPage" v-model="quesPerPage">
            </div>
          </div>
        </div>
        <div class="bg-gray-50 text-center">
          <div v-for="i in totalPages" :key="i" class="border-gray-400 border-4 rounded mb-2 focus-within:border-blue-400">
            <div class="bg-gray-600 p-3 text-white w-24 inline-block">
              <span>Page {{i}}</span>
            </div>
            <div class="bg-gray-100 p-3 text-black inline-block">Digits</div>
            <input class="border-black p-3 w-12 focus:outline-none" type="number" :id="`page-${i}-digits`" v-model="getConfig(i).digits" >
            <div class="bg-gray-100 p-3 text-black inline-block">Rows</div>
            <input class="border-black rounded-r p-3 w-12 focus:outline-none" type="number" :id="`page-${i}-rows`" v-model="getConfig(i).rows">
          </div>
        </div>
        <div class="grid grid-cols-1 gap-2">
          <button class="rounded-md border-2 bg-blue-600 text-white w-60 max-h-14 hover:bg-blue-700" id="save" @click="saveSettings">
            Save
          </button>
          <button class="rounded-md border-2  w-60 max-h-14 text-blue-600 bg-white hover:bg-blue-50" id="reset" @click="resetToDefault">
            Reset to default
          </button>
          <button class="rounded-md border-2 w-60 max-h-14 text-blue-600 bg-white hover:bg-blue-50" id="reset">
            Clear Results History
          </button>
          <button class="rounded-md border-2 w-60 max-h-14 text-blue-600 bg-white hover:bg-blue-50" id="reset">
            Generate URL
          </button>
          <button class="rounded-md border-2 w-60 max-h-14 text-blue-600 bg-white hover:bg-blue-50" id="reset">
            Load from URL
          </button>
          <button class="rounded-md border-2 w-60 max-h-14 text-green-800 bg-green-400 hover:bg-green-200" id="play" @click="play">
            Enough. Let's play.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {getUserSettings, setUserSettings, resetUserSettings} from '../user-settings'

export default {
  name: 'Settings',
  data() {
    return {
      message: '',
      error: false,
      totalTime: 0,
      totalPages: 0,
      quesPerPage: 0,
      config: [],
    }
  },
  methods: {
    getMessageClass() {
      if (this.error) {
        return 'border-red-800 bg-red-100 text-red-600'
      } else {
        return 'border-green-800 bg-green-100 text-green-600'
      }
    },
    getPageString(pageNum) {
      let pageNumStr = `${pageNum}`
      pageNumStr = pageNumStr.padStart(2, '  ')
      return `Page ${pageNumStr}`
    },
    validateTotalPages() {
      console.log("test")
    },
    getConfig(page) {
      if (this.config[page] === undefined) {
        this.config[page] = {}
      }
      return this.config[page]
    },
    saveSettings() {
      let valid = true
      let i = 1;
      let invalidPages = []
      for (; i <= this.totalPages; i++) {
        if (this.config[i].digits === undefined) {
          valid = false
          invalidPages.push(i)   
        }
      }

      if (valid) {
        setUserSettings({totalTime: this.totalTime, totalPages: this.totalPages, quesPerPage: this.quesPerPage, config: this.config})
        this.showMessage("Settings Saved.")
      } else {
        this.showMessage(`Setting could not be save.  Please check the settings of Page(s) ${invalidPages}`, true) 
      }

    },
    resetToDefault() {
      resetUserSettings()
      this.totalTime = getUserSettings().totalTime,
      this.totalPages = getUserSettings().totalPages,
      this.quesPerPage = getUserSettings().quesPerPage,
      this.config = getUserSettings().config
      this.showMessage("Default settings restored.")
    },
    play() {
      this.$router.push("/play")
    },
    showMessage(msg, failure) {
      if (failure) {
        this.error = true
      } else {
        this.error = false
      }
      this.message = msg
      setTimeout(()=> {
        this.message = ''
        this.error = false
      }, 2000)
    }
  },
  created() {
    const userSettings = getUserSettings()
    this.totalTime = userSettings.totalTime,
    this.totalPages = userSettings.totalPages,
    this.quesPerPage = userSettings.quesPerPage,
    this.config= userSettings.config
  }
}
</script>

<style scoped>

.border-ltb {
  border-left-width: 2px;
  border-top-width: 2px;
  border-bottom-width: 2px;
}

.border-rtb {
  border-right-width: 2px;
  border-top-width: 2px;
  border-bottom-width: 2px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}

.msg {
  border-color:red;
}

</style>