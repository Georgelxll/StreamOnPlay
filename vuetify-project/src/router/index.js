import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/ProjecT.vue'
import BotDiscord from '@/pages/DiscordBot.vue'
import TopMusics from '@/pages/TopMusics.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bot-discord',
    name: 'BotDiscord',
    component: BotDiscord
  },
  {
    path: '/top-musics',
    name: 'TopMusics',
    component: TopMusics
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
