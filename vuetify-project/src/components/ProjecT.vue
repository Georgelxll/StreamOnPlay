<template>
  <v-toolbar density="compact" theme="dark" color="#2a9db4">
    
    <v-toolbar-title class="custom-title">StreamOn Play</v-toolbar-title>
    
    <v-toolbar-items position="top right">
        <v-btn>
          <v-icon>mdi-music
          </v-icon>
          <v-tooltip
            activator="parent"
            location="bottom"
            theme="dark"
            color="#2a9db4"
          >Top Musics</v-tooltip>
        </v-btn>
        <v-btn>
          Register
        </v-btn>
        <v-btn @click="loginDialog = true">
          Login
        </v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <v-container class="fill-height" max-width="900">
    <div>
      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <v-img
          class="mb-4"
          height="150"
          src="@/assets/logo.png"
        />
      </div>

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-rocket-launch-outline"
            rounded="lg"
            variant="tonal"
          >
            <template #image>
              <v-img position="top right" 
              src="@/assets/github.png"
              />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">
                Github
              </h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                View this page on my github     
                <v-kbd>
                  <a 
                    href="https://github.com/Georgelxll" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style="text-decoration: none; color: inherit;"
                  >
                    https://github.com/Georgelxll
                  </a>
                </v-kbd>
              </div>
            </template>
          </v-card>
        </v-col>

        <v-dialog v-model="loginDialog" max-width="400" theme="light" color="#2a9db4">
          <v-card>
            <v-card-title class="text-h6 font-weight-bold text-center text-decoration-underline">Login</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field color="#2a9db4" label="Email" type="email" prepend-icon="mdi-email" />
                <v-text-field color="#2a9db4" label="Password" type="password" prepend-icon="mdi-lock" />
              </v-form>
                  <v-btn @click="login" color="white" class="text-black" elevation="2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="18" height="18" viewBox="0 0 533.5 544.3">
                      <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.2H272v95h147.6c-6.4 34.5-25.6 63.8-54.6 83.2v68h88c51.4-47.3 80.5-117 80.5-196z"/>
                      <path fill="#34A853" d="M272 544.3c73.5 0 135-24.3 180-65.9l-88-68c-24.4 16.3-55.6 25.9-92 25.9-70.6 0-130.5-47.7-151.9-111.8H28.3v70.3c44.8 89 136.9 149.5 243.7 149.5z"/>
                      <path fill="#FBBC05" d="M120.1 324.5c-10.4-30.7-10.4-63.9 0-94.6V159.6H28.3c-41.3 81.7-41.3 178.4 0 260.1l91.8-70.2z"/>
                      <path fill="#EA4335" d="M272 107.3c39.9-.6 78.3 13.9 107.6 40.9l80.6-80.6C417.5 23.1 346.4-2.5 272 0 165.2 0 73.1 60.5 28.3 149.6l91.8 70.3C141.5 155 201.4 107.3 272 107.3z"/>
                    </svg>
                    Login com Google
                  </v-btn>


                  <div v-if="userDetails">
                      <h2>User Details</h2>
                      <p>Name: {{ userDetails.name }}</p>
                      <p>Email: {{ userDetails.email }}</p>
                      <p>Profile Picture: <img
                          :src="userDetails.picture"
                          alt="Profile Picture"
                      ></p>
                  </div>
            </v-card-text>
            <v-card-actions left>
              <v-spacer />
              <v-btn text @click="loginDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="loginDialog = false">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-col v-for="link in links" :key="link.href" cols="12">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            :href="link.href"
            :prepend-icon="link.icon"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="link.subtitle"
            target="_blank"
            :title="link.title"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const loginDialog = ref(false)

  const links = [
    {
      href: 'https://github.com/Georgelxll/StreamOnPlay',
      icon: 'mdi-text-box-outline',
      subtitle: 'Learn about all things StreamON Play in our documentation.',
      title: 'How i use this?',
    }
  ]
</script>

<script>
import { googleSdkLoaded } from "vue3-google-login";
import axios from "axios";

export default {
 data() {
    return {
      userDetails: null
    };
  },
  name: "YourComponent",
  methods: {
    login() {
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id:
              "586701-d2i0.apps.googleusercontent.com",
            scope: "email profile openid",
            redirect_uri: "http://localhost:4000/auth/callback",
            callback: response => {
              if (response.code) {
                this.sendCodeToBackend(response.code);
              }
            }
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
              "58730101-di0.apps.googleusercontent.com",
            client_secret: "GOCSPX-u02eNidw0DqWutQVi",
            redirect_uri: "postmessage",
            grant_type: "authorization_code"
          }
        );

        const accessToken = response.data.access_token;
        console.log(accessToken);

        // Fetch user details using the access token
        const userResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (userResponse && userResponse.data) {
          // Set the userDetails data property to the userResponse object
          this.userDetails = userResponse.data;
        } else {
          // Handle the case where userResponse or userResponse.data is undefined
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Token exchange failed:", error.response.data);
      }
    }
  }
};
</script>

<style scoped>
  .custom-title {
    font-family: 'Emigrate';
    font-size: 20px;
  }
</style>
<style>
  @font-face {
    font-family: 'Emigrate';
    src: url('@/assets/fonts/Emigrate.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
</style>