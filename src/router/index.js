import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/ProjecT.vue";
import BotDiscord from "@/pages/DiscordBot.vue";
import Musics from "@/pages/Musics.vue";
import UserProfile from "@/pages/UserProfile.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/bot-discord",
    name: "BotDiscord",
    component: BotDiscord,
  },
  {
    path: "/musics",
    name: "Musics",
    component: Musics,
  },
  {
    path: "/profile",
    name: "UserProfile",
    component: UserProfile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
