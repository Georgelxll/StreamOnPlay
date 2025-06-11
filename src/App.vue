<template>
  <v-app>
    <app-toolbar
      @open-register="dialogStore.registerDialog = true"
      @open-login="dialogStore.loginDialog = true"
    />

    <router-view />

    <v-dialog
      v-model="dialogStore.loginDialog"
      max-width="400"
      theme="light"
      color="#2a9db4"
    >
      <v-card>
        <v-card-title>
          <v-img class="mb-4" height="150" src="@/assets/logo.png" />
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              color="#2a9db4"
              label="Email"
              type="email"
              prepend-icon="mdi-email"
            />
            <v-text-field
              v-model="loginPassword"
              :prepend-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              label="Password"
              name="input-login"
              counter
              @click:prepend="show1 = !show1"
            />
          </v-form>
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn
                @click="handleGoogleLogin"
                color="white"
                class="text-black"
                elevation="2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-12"
                  width="18"
                  height="18"
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
                Login com Google
              </v-btn>
            </v-col>
          </v-row>
          <div v-if="userDetails">
            <h2>User Details</h2>
            <p>Name: {{ userDetails.name }}</p>
            <p>Email: {{ userDetails.email }}</p>
            <p>
              Profile Picture:
              <img :src="userDetails.picture" alt="Profile Picture" />
            </p>
          </div>
        </v-card-text>
        <v-card-actions left>
          <v-spacer />
          <v-btn text @click="dialogStore.loginDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="dialogStore.loginDialog = false"
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogStore.registerDialog"
      max-width="400"
      theme="light"
      color="#2a9db4"
    >
      <v-card>
        <v-card-title>
          <v-img class="mb-4" height="150" src="@/assets/logo.png" />
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              color="#2a9db4"
              label="Name"
              type="text"
              prepend-icon="mdi-account"
            />
            <v-text-field
              color="#2a9db4"
              label="Email"
              type="email"
              prepend-icon="mdi-email"
            />
            <v-text-field
              v-model="registerPassword"
              :prepend-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              label="Password"
              name="input-register"
              counter
              @click:prepend="show1 = !show1"
            />
          </v-form>
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn
                @click="register"
                color="white"
                dark
                class="text-black"
                elevation="2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-12"
                  width="18"
                  height="18"
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
                Registro com Google
              </v-btn>
            </v-col>
          </v-row>
          <div v-if="userDetails">
            <h2>User Details</h2>
            <p>Name: {{ userDetails.name }}</p>
            <p>Email: {{ userDetails.email }}</p>
            <p>
              Profile Picture:
              <img :src="userDetails.picture" alt="Profile Picture" />
            </p>
          </div>
        </v-card-text>
        <v-card-actions left>
          <v-spacer />
          <v-btn text @click="dialogStore.registerDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="dialogStore.registerDialog = false"
            >Register</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { useDialogStore } from '@/stores/dialogStore' // ou onde você definiu
const dialogStore = useDialogStore()

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
.custom-title {
  font-family: "Emigrate";
  font-size: 20px;
}
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
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
