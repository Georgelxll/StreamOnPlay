<template>
  <v-app-bar flat height="70" class="navbar-black">
    <div class="d-flex align-center justify-space-between w-100 px-6">
      <!-- Logo -->
      <v-toolbar-title
        class="text-h6 font-weight-bold custom-title d-flex align-center"
      >
        <router-link
          to="/"
          style="text-decoration: none; color: inherit"
          class="d-flex align-center"
        >
          <img
            src="@/assets/musica.png"
            alt="Music Icon"
            class="mr-2"
            style="width: 50px; height: 50px"
          />
          StreamOn Play
        </router-link>
      </v-toolbar-title>

      <!-- Navegação Desktop -->
      <div class="d-flex align-center" style="gap: 20px">
        <template v-for="(item, index) in navItems" :key="index">
          <v-btn
            v-if="!isMobile"
            :to="item.to"
            variant="plain"
            class="nav-link text-uppercase"
          >
            <v-icon start>{{ item.icon }}</v-icon>
            {{ item.label }}
            <v-tooltip
              activator="parent"
              location="bottom"
              theme="dark"
              color="#2a9db4"
            >
              {{ item.tooltip }}
            </v-tooltip>
          </v-btn>
        </template>

        <v-btn
          v-if="!userName && !isMobile"
          variant="plain"
          class="nav-link text-uppercase"
          @click="emit('open-register', true)"
        >
          SignUp
        </v-btn>
        <v-btn
          v-if="!userName && !isMobile"
          variant="plain"
          class="nav-link text-uppercase"
          @click="emit('open-login', true)"
        >
          Login
        </v-btn>

        <!-- Dropdown de idiomas -->
        <v-menu v-if="!isMobile">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="plain"
              class="nav-link d-flex align-center"
              style="gap: 8px"
            >
              <img
                :src="selectedLanguage.flag"
                alt="flag"
                style="height: 20px; border-radius: 2px"
              />

              <v-icon end icon="mdi-menu-down" />
            </v-btn>
          </template>
          <v-list class="language-dropdown">
            <v-list-item
              v-for="(lang, index) in languages"
              :key="index"
              @click="selectLanguage(lang)"
              class="language-item"
            >
              <v-list-item-title class="d-flex align-center" style="gap: 10px">
                <img
                  :src="lang.flag"
                  alt="flag"
                  style="width: 24px; height: 18px; border-radius: 2px"
                />
                {{ lang.label }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Menu do usuário -->
        <v-menu v-if="userName && !mobileMenuOpen && !isMobile">
          <template #activator="{ props }">
            <v-btn variant="plain" v-bind="props">
              <span style="color: #fff">{{ userName }}</span>
              <v-icon icon="mdi-menu-down" color="#fff" />
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="handleLogout"> Sair </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Ícone hamburguer (mobile) -->
      <div v-if="!mobileMenuOpen && isMobile" class="d-flex d-md-none">
        <div class="hamburger" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Menu mobile fullscreen -->
    <transition name="fade-slide">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <div class="hamburger close-x" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="menu-content">
          <template v-for="(item, index) in navItems" :key="index">
            <router-link
              :to="item.to"
              class="mobile-link"
              @click="closeMobileMenu"
            >
              <v-icon class="mr-2">{{ item.icon }}</v-icon>
              {{ item.label }}
            </router-link>
          </template>

          <div v-if="userName" class="mobile-link">Olá, {{ userName }}!</div>

          <v-btn
            v-if="userName"
            class="mobile-link"
            variant="text"
            @click="handleLogout"
          >
            Sair
          </v-btn>

          <v-btn
            v-if="!userName"
            class="mobile-link"
            variant="text"
            @click="openRegisterMobile"
          >
            SignUp
          </v-btn>

          <v-btn
            v-if="!userName"
            class="mobile-link"
            variant="text"
            @click="openLoginMobile"
          >
            Login
          </v-btn>
        </div>
      </div>
    </transition>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const emit = defineEmits(["open-login", "open-register"]);

const userStore = useUserStore();
const router = useRouter();

const navItems = [
  {
    icon: "mdi-robot",
    to: "/bot-discord",
    label: "BOT",
    tooltip: "Bot Discord",
  },
  { icon: "mdi-music", to: "/musics", label: "MUSICS", tooltip: "Musics" },
];

const mobileMenuOpen = ref(false);
const isMobile = ref(false);
const userName = computed(() => userStore.userName);

// Bandeiras reais (links CDN ou locais)
const languages = [
  { code: "en", label: "English", flag: "https://flagcdn.com/h40/us.png" },
  { code: "pt", label: "Português", flag: "https://flagcdn.com/h40/br.png" },
  { code: "es", label: "Español", flag: "https://flagcdn.com/h40/es.png" },
  { code: "fr", label: "Français", flag: "https://flagcdn.com/h40/fr.png" },
];

const selectedLanguage = ref(languages[0]);

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

function checkIfMobile() {
  isMobile.value = window.innerWidth <= 768;
}

onMounted(() => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
});

function openLoginModal() {
  emit("open-login");
  mobileMenuOpen.value = false;
}

function openRegisterModal() {
  emit("open-register");
  mobileMenuOpen.value = false;
}

function openLoginMobile() {
  openLoginModal();
}

function openRegisterMobile() {
  openRegisterModal();
}

function handleLogout() {
  userStore.clearUser();
  mobileMenuOpen.value = false;
  router.push("/");
}

function selectLanguage(lang) {
  selectedLanguage.value = lang;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Work+Sans:400,600");

.navbar-black {
  background-color: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-title {
  font-family: "Work Sans", sans-serif;
  font-weight: 800;
  color: white;
}

.nav-link {
  color: white;
  font-size: 14px;
  position: relative;
  transition: color 0.2s ease-in-out;
  padding: 0 8px;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: #1db954;
}

.nav-link::before {
  content: "";
  display: block;
  height: 5px;
  background-color: #1db954;
  position: absolute;
  top: -25.9px;
  left: 0;
  width: 0%;
  transition: width 250ms ease-in-out;
}

.nav-link:hover::before {
  width: 100%;
}

.v-application {
  background-color: #000 !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Hamburguer */
.hamburger {
  width: 30px;
  height: 24px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1001;
}
.hamburger span {
  background: white;
  height: 3px;
  border-radius: 2px;
  transition: all 0.3s ease;
}
.close-x span:nth-child(1) {
  transform: translateY(10px) rotate(45deg);
}
.close-x span:nth-child(2) {
  opacity: 0;
}
.close-x span:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}
.close-x {
  position: absolute;
  top: 24px;
  right: 24px;
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}
.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 500px;
}
.mobile-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 15px;
  font-size: 20px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  width: 100%;
  max-width: 300px;
  transition: background-color 0.3s;
  border-radius: 8px;
}
.mobile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Transição */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Dropdown Idioma */
.language-dropdown {
  background-color: #000 !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.language-item {
  color: white;
  transition: background-color 0.2s;
}
.language-item:hover {
  background-color: #1db954 !important;
  color: black !important;
}
.language-dropdown {
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
}

.language-item:hover {
  background-color: rgba(29, 185, 84, 0.2);
}
</style>
