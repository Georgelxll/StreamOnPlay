<template>
  <v-app>
    <app-toolbar
      @open-register="openSignupModal"
      @open-login="openLoginModal"
    />

    <router-view v-slot="{ Component }">
      <component :is="Component" @open-signup-modal="openSignupModal" />
    </router-view>

    <v-dialog v-model="dialogStore.loginDialog" max-width="400" color="#2a9db4">
      <v-card class="pa-6" style="background-color: #000" dark>
        <!-- Abas -->
        <v-tabs v-model="tab" background-color="transparent" grow>
          <v-tab
            value="signup"
            class="text-white text-uppercase font-weight-bold"
          >
            Sign Up
          </v-tab>
          <v-tab
            value="login"
            class="text-white text-uppercase font-weight-bold"
          >
            Log In
          </v-tab>
        </v-tabs>

        <!-- Conteúdo -->
        <v-card-text>
          <h3 class="text-white text-center mb-4 text-h5 font-weight-bold">
            {{ tab === "signup" ? "Join the Beat" : "Welcome Back DJ" }}
          </h3>

          <v-form>
            <template v-if="tab === 'signup'">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    label="First Name"
                    dense
                    color="white"
                    variant="outlined"
                    bg-color="#1C1C1C"
                    class="input-white"
                    v-model="registerFirstName"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Last Name"
                    dense
                    color="white"
                    variant="outlined"
                    bg-color="#1C1C1C"
                    class="input-white"
                    v-model="registerLastName"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                label="Email Address"
                v-model="registerEmail"
                class="mt-4 input-white"
                dense
                color="white"
                variant="outlined"
                bg-color="#1C1C1C"
                required
              ></v-text-field>

              <v-text-field
                label="Create Password"
                v-model="registerPassword"
                class="mt-4 input-white"
                type="password"
                dense
                color="white"
                variant="outlined"
                bg-color="#1C1C1C"
                required
              ></v-text-field>

              <v-btn
                block
                color="#12833e"
                class="mt-6 text-uppercase font-weight-bold"
                size="large"
                @click="register"
              >
                Get Started
              </v-btn>
            </template>

            <template v-else>
              <v-text-field
                label="Email Address"
                v-model="loginEmail"
                dense
                color="white"
                variant="outlined"
                bg-color="#1C1C1C"
                class="input-white"
                required
              ></v-text-field>

              <v-text-field
                label="Password"
                v-model="loginPassword"
                type="password"
                class="mt-4 input-white"
                dense
                color="white"
                variant="outlined"
                bg-color="#1C1C1C"
                required
              ></v-text-field>

              <v-btn
                block
                color="#12833e"
                class="mt-6 text-uppercase font-weight-bold"
                size="large"
                @click="login"
              >
                Log In
              </v-btn>
            </template>

            <!-- Google Button -->
            <v-divider class="my-6" color="white" />

            <v-btn
              block
              color="white"
              class="text-black text-uppercase font-weight-bold d-flex align-center justify-center"
              @click="handleGoogleLogin"
            >
              <span class="d-flex align-center">
                <!-- Ícone SVG do Google -->
                <!-- (omitido para brevidade) -->
                <span>Continue with Google</span>
              </span>
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDialogStore } from "@/stores/dialogStore";
import axios from "axios";

const dialogStore = useDialogStore();

const tab = ref("signup");

const registerFirstName = ref("");
const registerLastName = ref("");
const registerEmail = ref("");
const registerPassword = ref("");
const loginEmail = ref("");
const loginPassword = ref("");
const userName = ref(null);
const isLogged = computed(() => !!userName.value);
const userDetails = ref(null);

const openSignupModal = () => {
  tab.value = "signup";
  dialogStore.loginDialog = true;
};

const openLoginModal = () => {
  tab.value = "login";
  dialogStore.loginDialog = true;
};

const handleClose = () => {
  dialogStore.loginDialog = false;
};

const register = async () => {
  try {
    await axios.post("/api/Register", {
      email: registerEmail.value,
      password: registerPassword.value,
      firstName: registerFirstName.value,
      lastName: registerLastName.value,
    });
    alert("Registro realizado!");
    tab.value = "login";
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.error ?? "Erro.");
  }
};

const login = async () => {
  try {
    const res = await axios.post("/api/Login", {
      email: loginEmail.value,
      password: loginPassword.value,
    });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userName", res.data.name);
    
    dialogStore.loginDialog = false;

    // Atualiza userName local (opcional, para o modal)
    userName.value = res.data.name;
    userDetails.value = { name: res.data.name };

    // Dispara evento para avisar toolbar que user mudou
    window.dispatchEvent(new Event("user-auth-changed"));

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.error ?? "Erro.");
  }
};


const handleLogout = () => {
  localStorage.removeItem("userName");

  localStorage.removeItem("token");

  userName.value = null;

  isLogged.value = false;

  dialogStore.loginDialog = false;

  alert("Você saiu!");
};

const handleGoogleLogin = () => {
  console.log("Google login chamado.");
};

onMounted(() => {
  userName.value = localStorage.getItem("userName");

  if (userName.value) {
    isLogged.value = true;
    userDetails.value = { name: userName.value };
  }
});
</script>

<style scoped>
.input-white .v-input__control {
  background-color: #12833e !important;
}

::v-deep(.input-white .v-field-label) {
  color: white !important;
  font-size: 16px;
  font-weight: 500;
}

::v-deep(.input-white .v-field.v-field--focused .v-field-label),
::v-deep(.input-white .v-field.v-field--dirty .v-field-label) {
  color: white !important;
  font-size: 14px;
  font-weight: 600;
}
</style>

<style>
@font-face {
  font-family: "Emigrate";
  src: url("@/assets/fonts/Emigrate.otf") format("opentype");

  font-weight: normal;
  font-style: normal;
}

.no-scroll {
  overflow: hidden !important;
  height: 100vh;
}
</style>
