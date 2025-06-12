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

        <v-btn
          variant="plain"
          class="nav-link text-uppercase"
          @click="dialogStore.openRegister()"
          >SingUp</v-btn
        >
        <v-btn
          variant="plain"
          class="nav-link text-uppercase"
          @click="dialogStore.openLogin()"
          >Login</v-btn
        >
      </div>
    </div>
  </v-app-bar>
</template>

<script setup>
import { ref } from "vue";
import { useDialogStore } from "@/stores/dialogStore";

const dialogStore = useDialogStore();

const navItems = [
  {
    icon: "mdi-robot",
    to: "/bot-discord",
    tooltip: "Bot Discord",
  },
  { icon: "mdi-music", to: "/musics", tooltip: "Musics" },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Work+Sans:400,600");

/* Navbar com fundo preto */
.navbar-black {
  background-color: #000 !important; /* Fundo preto */
}

/* Título com cor branca */
.custom-title {
  font-family: "Work Sans", sans-serif;
  font-weight: 800;
  color: white; /* Texto branco */
}

/* Estilo dos links de navegação */
.nav-link {
  color: white; /* Cor do texto branco */
  font-size: 14px;
  position: relative;
  transition: color 0.2s ease-in-out;
  padding: 0 8px;
  height: 100%;
  display: flex;
  align-items: center;
}

/* Hover para mudar para verde */
.nav-link:hover {
  color: #1db954; /* Cor verde no hover */
}

.nav-link::before {
  content: "";
  display: block;
  height: 5px;
  background-color: #1db954; /* Linha verde no hover */
  position: absolute;
  top: -25.9px;
  left: 0;
  width: 0%;
  transition: width 250ms ease-in-out;
}

/* Expandir a linha verde no hover */
.nav-link:hover::before {
  width: 100%;
}

/* Garantir que o fundo da aplicação seja preto */
.v-application {
  background-color: #000 !important; /* Fundo preto */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
