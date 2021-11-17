import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Table from './components/Table.vue'
import Settings from './components/Settings.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
  {
    path: '/play',
    component: Table
  }, 
  {
    path: '/settings',
    component: Settings
  },
  {
    path: '/',
    component: Home
  }
]
})

export default router