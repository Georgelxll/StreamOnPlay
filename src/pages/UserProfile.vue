<template>
  <v-app class="userProfileCl">
    <v-container>
      <!-- Avatar e nome do usuário -->
      <v-row class="mt-16" justify="center">
        <v-col cols="12" md="6" class="text-center">
          <v-avatar size="100">
            <v-img :src="avatarUrl" alt="Avatar do usuário" />
          </v-avatar>
          <h3 class="mt-3">{{ userName }}</h3>
          <v-tooltip text="Like" location="bottom">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                @click="toggleLike"
                :icon="liked ? 'mdi-heart' : 'mdi-heart-outline'"
                :color="liked ? 'red' : 'grey'"
                size="30"
                class="mt-2"
                style="cursor: pointer"
              />
            </template>
          </v-tooltip>
        </v-col>
      </v-row>

      <!-- Músicas do usuário -->
      <v-row class="mt-5" justify="center">
        <v-col
          v-for="song in songs"
          :key="song.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="cardMusic">
            <v-img :src="song.cover" class="music-img" height="200px" />
            <v-card-title>{{ song.title }}</v-card-title>
            <v-card-subtitle>{{ song.artist }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id

// Estado
const userName = ref("");
const avatarUrl = ref(
  "https://ui-avatars.com/api/?name=User&background=random"
); // Avatar padrão
const songs = ref([]);

// Token do usuário logado (supondo que está salvo no localStorage)
const token = localStorage.getItem("token");

// Atualiza o avatar com base no nome
function updateAvatar(name) {
  avatarUrl.value = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;
}

// Estado do like
const liked = ref(false);

// Função para alternar like
function toggleLike() {
  liked.value = !liked.value;
}

// Carrega nome e músicas
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3001/api/users/${userId}/songs`);
    songs.value = response.data;

    if (response.data.length > 0) {
      userName.value = response.data[0].user_name;
      updateAvatar(response.data[0].user_name);
    } else {
      userName.value = "Usuário";
    }
  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
  }
});

</script>

<style scoped>
.userProfileCl {
  background-color: #121212;
  min-height: 100vh;
  color: white;
}

.cardMusic {
  background-color: #1e1e1e;
  transition: 0.3s ease;
  border: 1px solid transparent;
  overflow: hidden;
  position: relative;
  color: #e0e0e0;
}

.cardMusic:hover {
  border-color: #1db954;
  box-shadow: 0 0 15px #1db95450;
}

.music-img {
  height: 180px;
  object-fit: cover;
}

.music-card .v-img {
  border-radius: 0 !important;
}
</style>
