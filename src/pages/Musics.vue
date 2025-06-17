<template>
  <!-- music -->
  <v-app>
    <v-main class="music-app">
      <v-container class="py-10">
        <!-- Título -->
        <h1 class="title">My Songs</h1>

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
              <div class="flip-card">
                <div
                  class="flip-card-inner"
                  :class="{ flipped: hoveringImageMap[song.id] }"
                >
                  <!-- Frente do card -->
                  <v-card class="music-card" rounded="lg" elevation="4">
                    <v-img
                      :src="song.cover"
                      cover
                      class="music-img"
                      @mouseenter="setHover(song.id, true)"
                      @mouseleave="setHover(song.id, false)"
                    />

                    <v-card-text>
                      <div class="song-title">{{ song.title }}</div>
                      <div class="song-artist">{{ song.artist }}</div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        icon
                        size="small"
                        color="green-accent-4"
                        @click.stop="playSong(song)"
                      >
                        <v-icon>mdi-play-circle</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>

                  <!-- Verso do card -->
                  <v-card
                    class="music-card back-face"
                    rounded="lg"
                    elevation="4"
                  >
                    <v-card-text class="flip-back-text">
                      <div class="user-info">
                        <div class="user-avatar">
                          <v-icon size="32">mdi-account-circle</v-icon>
                        </div>
                        <div class="user-name">
                          Adicionado por:
                          <strong>{{
                            usersMap[song.user_id] || "Desconhecido"
                          }}</strong>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-else class="text-center mt-10 not-found-msg">
          <v-icon size="40" color="grey">mdi-magnify-close</v-icon>
          <p class="text-grey text-subtitle-1 mt-2">No songs found</p>
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
            <span class="text-h6">Add New Music</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newSong.url"
              label="URL do YouTube"
              outlined
              dense
              placeholder="https://youtu.be/E-pN_h6RQSo ou https://www.youtube.com/watch?v=E-pN_h6RQSo"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="openAddMusic = false">Cancel</v-btn>
            <v-btn color="green-accent-4" @click="saveSong">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>

  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
    location="bottom center"
  >
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const search = ref("");

const songs = ref([]);

// Estado hover separado para cada música, armazenado num objeto id => boolean
const hoveringImageMap = ref({});

const filteredSongs = computed(() => {
  return songs.value.filter(
    (song) =>
      song.title.toLowerCase().includes(search.value.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Função para setar hover no mapa
function setHover(id, val) {
  hoveringImageMap.value = { ...hoveringImageMap.value, [id]: val };
}

// Função de exemplo para tocar música
function playSong(song) {
  console.log("Tocando música:", song.title);
  // aqui você coloca a lógica real para tocar música
}

// Autenticação e resto do código permanece igual (não alterei)

const token = ref(null);
const email = ref("");
const password = ref("");
const isLogin = ref(false);
const showLoginDialog = ref(true);
const emit = defineEmits(["openSignupModal"]);
const usersMap = ref({}); // ID → Nome

async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3001/api/users");
    if (!response.ok) throw new Error("Erro ao buscar usuários");

    const users = await response.json();

    const map = {};
    users.forEach((user) => {
      map[user.id] = user.name;
    });

    usersMap.value = map;
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    showSnackbar("Erro ao buscar usuários", "red");
  }
}

onMounted(async () => {
  await fetchUsers();
  await fetchPublicSongs(); // ou fetchPrivateSongs()
});

async function login() {
  if (!email.value || !password.value) return;

  try {
    const response = await fetch("http://localhost:3001/api/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    if (!response.ok) {
      showSnackbar("Dados incorretos!", "red");

      return;
    }

    const result = await response.json();

    token.value = result.token;
    localStorage.setItem("token", result.token); // salva o token
    isLogin.value = true;

    showLoginDialog.value = false;

    showSnackbar("Login realizado!", "green");

    // Carregar músicas autenticadas
    await fetchPrivateSongs();
  } catch (err) {
    showSnackbar(err.message, "red");

    console.error(err);
  }
}

token.value = localStorage.getItem("token");
if (token.value) {
  isLogin.value = true;
  fetchPrivateSongs();
}

async function fetchPrivateSongs() {
  try {
    const response = await fetch("http://localhost:3001/api/songs", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (response.ok) {
      songs.value = await response.json();
    } else {
      showSnackbar("Erro ao obter as músicas.", "red");

      console.error(await response.text());
    }
  } catch (err) {
    showSnackbar(err.message, "red");

    console.error(err);
  }
}

async function fetchPublicSongs() {
  try {
    // Busca públicas
    const response = await fetch("http://localhost:3001/api/songs/public");

    if (response.ok) {
      songs.value = await response.json();
    } else {
      showSnackbar("Erro ao obter as músicas.", "red");

      console.error(await response.text());
    }
  } catch (err) {
    showSnackbar(err.message, "red");

    console.error(err);
  }
}

// Adicionar nova música
const openAddMusic = ref(false);
const newSong = ref({ url: "" });

async function saveSong() {
  const { url } = newSong.value;
  console.log("Tentando salvar:", url); // Log adicional

  if (!url) {
    showSnackbar("Informe uma URL!", "red");
    return;
  }

  if (!token.value) {
    showSnackbar("Autenticação necessária", "red");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/api/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    console.log("Resposta do servidor:", data); // Log da resposta

    if (!response.ok) {
      throw new Error(data.error || `Erro ${response.status}`);
    }

    // Atualização otimizada da lista
    songs.value = [
      {
        id: data.id || Date.now(),
        title: data.title,
        artist: data.artist,
        cover: data.cover,
        url: data.url || url,
      },
      ...songs.value,
    ];

    newSong.value = { url: "" };
    openAddMusic.value = false;
    showSnackbar("Música adicionada!", "green");
  } catch (err) {
    console.error("Erro completo:", err); // Log detalhado
    showSnackbar(err.details || err.message || "Erro desconhecido", "red");
  }
}

// Snackbar
const snackbar = ref(false);
const snackbarColor = ref("green");

const snackbarText = ref("");

function showSnackbar(message, color = "green") {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

onMounted(fetchPublicSongs);
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
  position: relative;
}

.music-card:hover {
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
.flip-card {
  perspective: 1000px;
  position: relative;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Remove o hover antigo */
/*
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
*/

/* Nova classe para flip */
.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.music-card {
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #1e1e1e;
  transition: 0.3s ease;
  border: 1px solid transparent;
  overflow: hidden;
}

.music-card:hover {
  border-color: #1db954;
  box-shadow: 0 0 15px #1db95450;
}

.back-face {
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  background-color: #1e1e1e;
}

.flip-back-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #fff;
  font-weight: 600;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 0 10px #1db95480;
}

.user-name {
  font-size: 1rem;
  color: #e0e0e0;
}
</style>
