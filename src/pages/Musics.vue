<template>
  <v-app>
    <v-main class="music-app">
      <v-container class="py-10">
        <!-- Título -->
        <h1 class="title">Minhas Músicas</h1>

        <!-- Campo de busca -->
        <v-text-field
          v-model="search"
          placeholder="Buscar músicas..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          hide-details
          class="search-bar"
          density="comfortable"
          rounded
        />

        <!-- Cards das músicas ou mensagem de não encontrada -->
        <div v-if="filteredSongs.length > 0">
          <v-row class="mt-6" dense>
            <v-col
              v-for="song in filteredSongs"
              :key="song.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card class="music-card" rounded="lg" elevation="4">
                <v-img
                  :src="song.cover"
                  height="180px"
                  cover
                  class="music-img"
                />
                <v-card-text>
                  <div class="song-title">{{ song.title }}</div>
                  <div class="song-artist">{{ song.artist }}</div>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn icon size="small" color="green-accent-4">
                    <v-icon>mdi-play-circle</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div v-else class="text-center mt-10 not-found-msg">
          <v-icon size="40" color="grey">mdi-magnify-close</v-icon>
          <p class="text-grey text-subtitle-1 mt-2">
            Nenhuma música encontrada
          </p>
        </div>
      </v-container>

      <!-- Botão flutuante -->
      <v-btn
        icon
        class="fab"
        color="green-accent-4"
        @click="openAddMusic = true"
      >
        <v-icon size="32">mdi-plus</v-icon>
      </v-btn>

      <!-- Modal de Adicionar Música -->
      <v-dialog v-model="openAddMusic" max-width="500px" persistent>
        <v-card class="add-music-modal">
          <v-card-title>
            <span class="text-h6">Adicionar Nova Música</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newSong.title"
              label="Título"
              outlined
              dense
            />
            <v-text-field
              v-model="newSong.artist"
              label="Artista"
              outlined
              dense
            />
            <v-text-field
              v-model="newSong.cover"
              label="URL da Capa"
              outlined
              dense
              placeholder="https://..."
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="openAddMusic = false">Cancelar</v-btn>
            <v-btn color="green-accent-4" @click="saveSong">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";

const search = ref("");
const songs = ref([
  {
    id: 1,
    title: "Nocturnal Drive",
    artist: "Digital Echoes",
    cover:
      "https://images.unsplash.com/photo-1583244532610-2a234e7c3eca?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Velvet Skies",
    artist: "Lunar Soul",
    cover:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Crystal Dreams",
    artist: "Nightline",
    cover:
      "https://images.unsplash.com/photo-1544785349-c4a5301826fd?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Electric Sunset",
    artist: "Neon Lights",
    cover:
      "https://plus.unsplash.com/premium_photo-1682125768864-c80b650614f3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]);

const filteredSongs = computed(() => {
  return songs.value.filter((song) =>
    song.title.toLowerCase().includes(search.value.toLowerCase())
  );
});

const openAddMusic = ref(false);
const newSong = ref({ title: "", artist: "", cover: "" });

function saveSong() {
  if (!newSong.value.title || !newSong.value.artist || !newSong.value.cover) {
    alert("Preencha todos os campos!");
    return;
  }

  songs.value.push({
    id: Date.now(),
    title: newSong.value.title,
    artist: newSong.value.artist,
    cover: newSong.value.cover,
  });

  newSong.value = { title: "", artist: "", cover: "" };
  openAddMusic.value = false;
}
</script>

<style scoped>
.music-app {
  background-color: #121212;
  color: #e0e0e0;
  min-height: 100vh;
  padding-top: 64px; /* espaço para a AppToolbar */
}

@media (max-width: 600px) {
  .music-app {
    padding-top: 56px; /* espaço menor para mobile */
  }
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #1db954;
  margin-bottom: 24px;
}

.search-bar .v-field__control {
  background-color: #1e1e1e;
  border-radius: 8px;
  color: #e0e0e0;
}

.music-card {
  background-color: #1e1e1e;
  transition: 0.3s ease;
  border: 1px solid transparent;
  overflow: hidden;
}

.music-card:hover {
  border-color: #1db954;
  box-shadow: 0 0 15px #1db95450;
}

.music-img {
  border-radius: 0 !important;
}

.song-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 4px;
  color: #ffffff;
}

.song-artist {
  font-size: 0.875rem;
  color: #b3b3b3;
}

.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: #1db954;
  color: #000;
}

.fab:hover {
  background-color: #1ed760;
}

.add-music-modal {
  background-color: #1e1e1e;
  color: #fff;
}

.not-found-msg {
  color: #aaa;
}
</style>
