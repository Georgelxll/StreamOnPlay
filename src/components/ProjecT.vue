<template>
  <v-app>
    <!-- Página Inicial -->
    <v-main>
      <v-container fluid class="pa-0">
        <!-- Hero -->
        <v-parallax src="@/assets/home.jpg" height="100vh">
          <v-row class="fill-height" align="center" justify="center">
            <v-col class="text-center">
              <h1 class="display-2 font-weight-bold text-green">
                Discover StreamOn Play
              </h1>
              <p class="text-white text-h6 mt-4">
                Your musical journey starts here
              </p>
              <v-btn
                @click="emit('open-signup-modal')"
                color="green"
                dark
                large
              >
                Start Now
              </v-btn>
            </v-col>
          </v-row>
        </v-parallax>

        <!-- Cards de Devs do GitHub -->
        <v-container class="mt-12">
          <v-row>
            <v-col
              v-for="(dev, i) in devCards"
              :key="i"
              cols="12"
              sm="6"
              md="4"
            >
              <v-hover v-slot:default="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  class="elevation-5"
                  :elevation="isHovering ? 10 : 2"
                  color="black"
                  dark
                >
                  <v-img :src="dev.avatar" height="280px" cover></v-img>
                  <v-card-title class="text-green">{{ dev.name }}</v-card-title>
                  <v-card-text>{{ dev.bio }}</v-card-text>
                  <v-card-actions>
                    <v-btn :href="dev.url" target="_blank" color="green" text>
                      View on GitHub
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>

    <!-- Rodapé -->
    <v-footer color="black" dark class="pa-6">
      <v-container>
        <v-row justify="space-between" align="center">
          <v-col cols="12" md="4">
            <div class="text-green font-weight-bold">StreamOn Play</div>
            <div class="text-white">contato@streamonplay.com</div>
          </v-col>

          <v-col cols="12" md="4" class="text-center">
            <v-btn icon class="mx-2" v-for="icon in social" :key="icon.icon">
              <v-icon color="green">{{ icon.icon }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const devCards = [
  {
    name: "George",
    bio: "BackEnd specialist and clean design enthusiast.",
    avatar: "https://avatars.githubusercontent.com/u/166880649?v=4",
    url: "https://github.com/Georgelxll",
  },
  {
    name: "Luiz Pedro",
    bio: "Front-End enthusiast and advocate of fluid experience.",
    avatar:
      "https://avatars.githubusercontent.com/u/74275864?s=400&u=08af40a2efb1e6e44910a904222cf90a53262866&v=4",
    url: "https://github.com/luuizpeedro",
  },
  {
    name: "Lucas Silva",
    bio: "API and bot dev for Discord, always looking for intelligent automation.",
    avatar:
      "https://media-gru1-1.cdn.whatsapp.net/v/t61.24694-24/491887537_964379899197293_6717416557819175312_n.jpg?ccb=11-4&oh=01_Q5Aa1wFL2yWq7p3xGLAeknN45Nz6aqAHbsmQARq4tR8bjlAw3Q&oe=685929C5&_nc_sid=5e03e0&_nc_cat=107",
    url: "https://github.com/lucas-ssilva2706",
  },
];

const social = [
  { icon: "mdi-facebook" },
  { icon: "mdi-instagram" },
  { icon: "mdi-twitter" },
];

const emit = defineEmits(["open-signup-modal"]);
</script>

<style scoped>
body {
  background-color: #000;
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}

.v-card {
  transition: box-shadow 0.3s ease;
}
</style>
