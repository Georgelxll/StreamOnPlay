<template>
  <v-app-bar flat height="70" class="navbar-black">
    <div class="d-flex align-center justify-space-between w-100 px-6">
      <!-- Logo + ícone à esquerda -->
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

      <!-- Navegação -->
      <div class="d-flex align-center" style="gap: 20px">
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
      </div>
    </div>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["open-login", "open-register"]);

const navItems = [
  {
    icon: "mdi-robot",
    to: "/bot-discord",
    tooltip: "Bot Discord",
  },
  { icon: "mdi-music", to: "/musics", tooltip: "Musics" },
];

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
  color: #fff;
}

.nav-link {
  color: #fff;
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
</style>
