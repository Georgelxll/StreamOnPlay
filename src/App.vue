<template>
  <v-app>
    <app-toolbar
      @open-register="openSignupModal"
      @open-login="openLoginModal"
    />

    <router-view v-slot="{ Component }">
      <component :is="Component" @open-signup-modal="openSignupModal" />
    </router-view>

    <v-dialog
      v-model="dialogStore.loginDialog"
      max-width="400"
      theme="light"
      color="#2a9db4"
    >
      <v-card class="pa-6" style="background-color: #000" dark>
        <!-- Abas -->
        <v-tabs v-model="tab" background-color="transparent" grow>
          <v-tab
            value="signup"
            class="text-white text-uppercase font-weight-bold"
            >Sign Up</v-tab
          >
          <v-tab
            value="login"
            class="text-white text-uppercase font-weight-bold"
            >Log In</v-tab
          >
        </v-tabs>

        <!-- Conteúdo -->
        <v-card-text>
          <h3 class="text-white text-center mb-4 text-h5 font-weight-bold">
            {{ tab === "signup" ? "Join the Beat" : "Welcome Back DJ" }}
          </h3>

          <v-form>
            <!-- Sign Up -->
            <template v-if="tab === 'signup'">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    label="First Name"
                    dense
                    hide-details
                    color="white"
                    variant="outlined"
                    bg-color="#1C1C1C"
                    class="input-white"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Last Name"
                    dense
                    hide-details
                    color="white"
                    variant="outlined"
                    bg-color="#1C1C1C"
                    class="input-white"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                label="Email Address"
                class="mt-4 input-white"
                dense
                hide-details
                color="white"
                variant="outlined"
                bg-color="#1C1C1C"
                required
              ></v-text-field>

              <v-text-field
                label="Create Password"
                class="mt-4 input-white"
                type="password"
                dense
                hide-details
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
              >
                Get Started
              </v-btn>
            </template>

            <!-- Login -->
            <template v-else>
              <v-text-field
                label="Email Address"
                dense
                hide-details
                color="white"
                variant="outlined"
                bg-color="#1C1C1C"
                class="input-white"
                required
              ></v-text-field>

              <v-text-field
                label="Password"
                type="password"
                class="mt-4 input-white"
                dense
                hide-details
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="me-3"
                  width="20"
                  height="20"
                  viewBox="0 0 533.5 544.3"
                >
                  <path
                    fill="#4285F4"
                    d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.2H272v95h147.6c-6.4 34.5-25.6 63.8-54.6 83.2v68h88c51.4-47.3 80.5-117 80.5-196z"
                  />
                  <path
                    fill="#34A853"
                    d="M272 544.3c73.5 0 135-24.3 180-65.9l-88-68c-24.4 16.3-55.6 25.9-92 25.9-70.6 0-130.5-47.7-151.9-111.8H28.3v70.3c44.8 89 136.9 149.5 243.7 149.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M120.1 324.5c-10.4-30.7-10.4-63.9 0-94.6V159.6H28.3c-41.3 81.7-41.3 178.4 0 260.1l91.8-70.2z"
                  />
                  <path
                    fill="#EA4335"
                    d="M272 107.3c39.9-.6 78.3 13.9 107.6 40.9l80.6-80.6C417.5 23.1 346.4-2.5 272 0 165.2 0 73.1 60.5 28.3 149.6l91.8 70.3C141.5 155 201.4 107.3 272 107.3z"
                  />
                </svg>

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
import { useDialogStore } from "@/stores/dialogStore"; // ou onde você definiu
const dialogStore = useDialogStore();

const loginDialog = ref(false);
const registerDialog = ref(false);

const tab = ref("signup");
const dialog = ref(false);

const signUpWithGoogle = () => {
  alert("Registrar com Google ainda não implementado.");
};

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

const openSignupModal = () => {
  tab.value = "signup";
  dialogStore.loginDialog = true;
};

const openLoginModal = () => {
  tab.value = "login";
  dialogStore.loginDialog = true;
};
</script>

<script>
import { googleSdkLoaded } from "vue3-google-login";
import axios from "axios";

export default {
  data() {
    return {
      userDetails: null,
    };
  },
  methods: {
    handleGoogleLogin() {
      googleSdkLoaded((google) => {
        google.accounts.oauth2
          .initCodeClient({
            client_id:
              "7131457454-nlv7rol3b7tdlk1qd6ri9agndmqv0h6h.apps.googleusercontent.com",
            scope: "email profile openid",
            redirect_uri: "https://ba0d-152-249-225-112.ngrok-free.app", // Deve corresponder ao autorizado no Google Cloud
            callback: (response) => {
              if (response.code) {
                this.sendCodeToBackend(response.code);
              }
            },
          })
          .requestCode();
      });
    },
    async sendCodeToBackend(code) {
      try {
        const response = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            code,
            client_id:
              "7131457454-nlv7rol3b7tdlk1qd6ri9agndmqv0h6h.apps.googleusercontent.com",
            client_secret: "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",
            redirect_uri: "https://ba0d-152-249-225-112.ngrok-free.app", // Deve ser o mesmo que acima
            grant_type: "authorization_code",
          }
        );

        const accessToken = response.data.access_token;

        // Obter informações do usuário
        const userResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        this.userDetails = userResponse.data;
        console.log("User logged in:", this.userDetails);

        // Feche o diálogo de login após o login bem-sucedido
        this.loginDialog = false;
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    },
  },
};
</script>

<style scoped>
.input-white .v-input__control {
  background-color: #12833e !important;
}

/* Label padrão em branco */
::v-deep(.input-white .v-field-label) {
  color: white !important;
  font-size: 16px; /* Tamanho inicial */
  font-weight: 500; /* Levemente mais grosso */
}

/* Quando o campo está focado ou preenchido, o label deve ficar preto, maior e bold */
::v-deep(.input-white .v-field.v-field--focused .v-field-label),
::v-deep(.input-white .v-field.v-field--dirty .v-field-label) {
  color: white !important;
  font-size: 14px; /* Um pouco maior ao flutuar */
  font-weight: 600; /* Mais espesso */
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
