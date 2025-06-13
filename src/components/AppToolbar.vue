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

      <!-- Menu desktop -->
      <div class="d-none d-md-flex align-center" style="gap: 20px">
        <template v-for="(item, index) in navItems" :key="index">
          <v-btn :to="item.to" variant="plain" class="nav-link text-uppercase">
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
          variant="plain"
          class="nav-link text-uppercase"
          @click="dialogStore.openRegister()"
          >SignUp</v-btn
        >
        <v-btn
          variant="plain"
          class="nav-link text-uppercase"
          @click="dialogStore.openLogin()"
          >Login</v-btn
        >
      </div>

<<<<<<< HEAD
      <!-- Ícone hamburguer (visível apenas quando menu fechado) -->
      <div v-if="!mobileMenuOpen" class="d-flex d-md-none">
        <div class="hamburger" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
=======
        <!-- Se o usuário NÃO estiver autenticado -->
        <v-btn
          v-if="!userName"
          variant="plain"
          class="nav-link text-uppercase"
          @click="emit('open-register')"
        >
          SignUp
        </v-btn>
        <v-btn
          v-if="!userName"
          variant="plain"
          class="nav-link text-uppercase"
          @click="emit('open-login')"
        >
          Login
        </v-btn>

        <!-- Se o usuário ESTÁ autenticado -->
        <v-menu v-if="userName">
          <template #activator="{ props }">
            <v-btn variant="plain" v-bind="props">
              <span style="color: #fff">
                {{ userName }}
              </span>
              <v-icon icon="mdi-menu-down" color="#fff" />
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="handleLogout"> Sair </v-list-item>
          </v-list>
        </v-menu>
>>>>>>> 225b44ebd62d5aae7a8e6bff4252c215c851448c
      </div>
    </div>

    <!-- Dropdown menu fullscreen -->
    <transition name="fade-slide">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <!-- Botão X -->
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

          <v-btn
            class="mobile-link"
            variant="text"
            @click="
              () => {
                closeMobileMenu();
                dialogStore.openRegister();
              }
            "
          >
            SignUp
          </v-btn>

          <v-btn
            class="mobile-link"
            variant="text"
            @click="
              () => {
                closeMobileMenu();
                dialogStore.openLogin();
              }
            "
          >
            Login
          </v-btn>
        </div>
      </div>
    </transition>
  </v-app-bar>
</template>

<script setup>
<<<<<<< HEAD
import { ref } from "vue";
import { useDialogStore } from "@/stores/dialogStore";
=======
import { ref, onMounted } from "vue";
>>>>>>> 225b44ebd62d5aae7a8e6bff4252c215c851448c

const dialogStore = useDialogStore();

const navItems = [
  {
    icon: "mdi-robot",
    to: "/bot-discord",
    label: "Bot",
    tooltip: "Bot Discord",
  },
  { icon: "mdi-music", to: "/musics", label: "Músicas", tooltip: "Musics" },
];

<<<<<<< HEAD
const mobileMenuOpen = ref(false);

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
=======
// Pegue o nome do usuário do localStorage
const userName = ref(null);

onMounted(() => {
  userName.value = localStorage.getItem("userName") || null;
});

// Implementação do logout opcional
function handleLogout() {
  localStorage.removeItem("userName");

  // opcional: também o token
  localStorage.removeItem("token");

  // depois, dar um refresh ou um router.push
  location.reload();
>>>>>>> 225b44ebd62d5aae7a8e6bff4252c215c851448c
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Work+Sans:400,600");

.navbar-black {
  background-color: #000 !important;
}

.custom-title {
  font-family: "Work Sans", sans-serif;
  font-weight: 800;
<<<<<<< HEAD
  color: white;
}

.nav-link {
  color: white;
=======
  color: #fff;
}

.nav-link {
  color: #fff;
>>>>>>> 225b44ebd62d5aae7a8e6bff4252c215c851448c
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

/* -------------------------------
   Estilo do Hamburguer
----------------------------------*/
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

/* Botão X */
.close-x span:nth-child(1) {
  transform: translateY(10px) rotate(45deg);
}
.close-x span:nth-child(2) {
  opacity: 0;
}
.close-x span:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}

/* Posicionamento do X dentro do menu */
.close-x {
  position: absolute;
  top: 24px;
  right: 24px;
}

/* -------------------------------
   Menu Mobile Fullscreen
----------------------------------*/
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  font-family: "Work Sans", sans-serif;
}

.mobile-link {
  color: white;
  font-size: 20px;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s;
}

.mobile-link:hover {
  color: #1db954;
}

/* -------------------------------
   Transição Suave do Menu
----------------------------------*/
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.fade-slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.fade-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
