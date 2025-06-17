import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import message from '../views/message.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/checkout/:sn',
    name: 'home',
    component: HomeView
  },
  {
    path: '/message/:orderId',
    name: 'message',
    component: message
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
