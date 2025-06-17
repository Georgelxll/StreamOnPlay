<template>
  <v-app>
    <v-container>
      <!-- Avatar e nome do usuário -->
      <v-row class="mt-16" justify="center">
        <v-col cols="12" md="6" class="text-center">
          <v-avatar size="100">
            <v-img :src="avatarUrl" alt="Avatar do usuário" />
          </v-avatar>
          <h3 class="mt-3">{{ userName }}</h3>
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
          <v-card>
            <v-img :src="song.cover" height="200px" />
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

// Estado
const userName = ref("");
const avatarUrl = ref("https://ui-avatars.com/api/?name=User&background=random"); // Avatar padrão
const songs = ref([]);

// Token do usuário logado (supondo que está salvo no localStorage)
const token = localStorage.getItem("token");

// Atualiza o avatar com base no nome
function updateAvatar(name) {
  avatarUrl.value = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;
}

// Carrega nome e músicas
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/songs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    songs.value = response.data;

    // Tenta obter o nome do usuário salvo localmente
    const name = localStorage.getItem("userName") || "Usuário";
    userName.value = name;
    updateAvatar(name);
  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
  }
});
</script>
