<template>
  <v-app-bar flat height="70" class="navbar-black">
    <div class="d-flex align-center justify-space-between w-100 px-6">
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

        <!-- Botões de Login e SignUp (visíveis apenas se o usuário não estiver autenticado) -->
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

        <!-- Se o usuário ESTÁ autenticado -->
        <v-menu v-if="userName && !mobileMenuOpen && !isMobile">
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
      </div>

      <!-- Ícone hamburguer (visível apenas quando menu fechado) -->
      <div v-if="!mobileMenuOpen && isMobile" class="d-flex d-md-none">
        <div class="hamburger" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
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

          <!-- Mostrar nome do usuário se autenticado -->
          <div v-if="userName" class="mobile-link">Olá, {{ userName }}!</div>

          <!-- Mostrar apenas o botão Sair se autenticado -->
          <v-btn
            v-if="userName"
            class="mobile-link"
            variant="text"
            @click="handleLogout"
          >
            Sair
          </v-btn>

          <!-- Se o usuário NÃO estiver autenticado, mostrar os botões SignUp e Login -->
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
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useDialogStore } from "@/stores/dialogStore";
import { useRouter } from "vue-router";

const emit = defineEmits(["open-login", "open-register"]);
const dialog = ref(true) // ou controle externo via prop
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const dialogStore = useDialogStore();
const router = useRouter();

const navItems = [
  {
    icon: "mdi-robot",
    to: "/bot-discord",
    label: "Bot",
    tooltip: "Bot Discord",
  },
  { icon: "mdi-music", to: "/musics", label: "Músicas", tooltip: "Musics" },
];

async function login() {
  try {
    const response = await axios.post('http://localhost:3001/api/Login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('userName', response.data.name)
    localStorage.setItem('token', response.data.token)

    // Atualiza o userName local para refletir a mudança imediata
    updateUserName();

    // Dispara o evento global para outros componentes, se houver
    window.dispatchEvent(new Event('user-auth-changed'))

    dialog.value = false
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.error || 'Erro no login'
  }
}


const mobileMenuOpen = ref(false);
const isMobile = ref(false);

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

const userName = ref(null);

function updateUserName() {
  userName.value = localStorage.getItem("userName") || null;
}

onMounted(() => {
  userName.value = localStorage.getItem("userName") || null;
  window.addEventListener("user-auth-changed", updateUserName);
});

onBeforeUnmount(() => {
  window.removeEventListener("user-auth-changed", updateUserName);
});



// Função que verifica se a tela é mobile
function checkIfMobile() {
  isMobile.value = window.innerWidth <= 768; // ou qualquer outro limite que você queira para mobile
}

// Adiciona um ouvinte para mudanças de tamanho da tela
watch(
  () => window.innerWidth,
  () => checkIfMobile()
);

// Função para abrir o modal de login
function openLoginModal() {
  emit("open-login", true);
}

// Função para abrir o modal de registro
function openRegisterModal() {
  emit("open-register", true);
}

// Função para abrir o modal de login no menu mobile
function openLoginMobile() {
  emit("open-login", true);
}

// Função para abrir o modal de registro no menu mobile
function openRegisterMobile() {
  emit("open-register", true);
}

// Função para o logout
function handleLogout() {
  localStorage.removeItem("userName");
  localStorage.removeItem("token");

  // ✅ Dispara evento para avisar que houve mudança de autenticação
  window.dispatchEvent(new Event("user-auth-changed"));

  // ✅ Redireciona para a home
  router.push("/");
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
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  z-index: 1000;
  padding-top: 60px;
}

.mobile-link {
  display: block;
  text-align: center;
  padding: 15px;
  font-size: 18px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
}

.mobile-link:hover {
  background-color: #333;
}

.menu-content {
  display: flex;
  flex-direction: column;
}
</style>
