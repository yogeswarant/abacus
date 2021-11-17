<template>
  <div class="bg-gray-50 mt-10">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
      <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        <span class="block">Practise like you’ve never won.</span>
        <span class="ml-16 mt-8 quote text-blue-600">Perform like you’ve never lost.</span>
      </h2>
      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <button class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700" @click="start()">
            Start
          </button>
        </div>
        <div class="ml-3 inline-flex rounded-md shadow">
          <button class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50" @click="openSettings()">
            Configure
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>

export default {
  name: 'Home',
  data() {
    return {
      showModal: false,
      showSettings: false
    }
  },
  methods: {
    start() {
      this.$router.push("/play")
    },
    openSettings() {
      this.$router.push("/settings")
    }
  }
}
</script>

<style>
/* text-align: center; */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}


</style>
