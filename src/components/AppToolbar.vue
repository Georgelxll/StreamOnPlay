<script setup>
import { useDialogStore } from "@/stores/dialogStore";
const dialogStore = useDialogStore();
</script>

<template>
  <v-toolbar density="compact" theme="dark" color="#2a9db4">
    <v-toolbar-title class="custom-title">
      <v-fade-transition hide-on-leave>
        <router-link to="/" style="text-decoration: none; color: inherit">
          Stream
        </router-link>
      </v-fade-transition>
    </v-toolbar-title>
    <v-toolbar-items position="top right">
      <v-btn to="/bot-discord">
        <v-icon>mdi-robot</v-icon>
        <v-tooltip
          activator="parent"
          location="bottom"
          theme="dark"
          color="#2a9db4"
        >
          Bot Discord
        </v-tooltip>
      </v-btn>
      <v-btn to="/musics">
        <v-icon>mdi-music</v-icon>
        <v-tooltip
          activator="parent"
          location="bottom"
          theme="dark"
          color="#2a9db4"
        >
          Musics
        </v-tooltip>
      </v-btn>
      <v-btn @click="dialogStore.openRegister()">Register</v-btn>
      <v-btn @click="dialogStore.openLogin()">Login</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: "AppToolbar",
};

const loginDialog = ref(false);
const registerDialog = ref(false);

// Separar as senhas
const loginPassword = ref("");
const registerPassword = ref("");
const show1 = ref(false);

const rules = {
  required: (value) => !!value || "Required.",
  min: (v) => (v && v.length >= 8) || "Min 8 characters",
};

const login = () => {
  console.log("Logging in with password:", loginPassword.value);
  // lógica de login
};

const register = () => {
  console.log("Registering with password:", registerPassword.value);
  // lógica de registro
};

</script>
