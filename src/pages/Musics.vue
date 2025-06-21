<template>
  <!-- music -->
  <v-app>
    <v-main class="music-app">
      <v-container class="py-10">
        <!-- Título -->
        <h1 class="title">{{ $t('musicPage.title') }}</h1>

        <!-- Campo de busca -->
        <v-text-field v-model="search" :placeholder="$t('musicPage.searchPlaceholder')" prepend-inner-icon="mdi-magnify"
          variant="solo" hide-details class="search-bar" density="comfortable" rounded />

        <!-- Cards das músicas ou mensagem de não encontrada -->
        <div v-if="filteredSongs.length > 0">
          <v-row class="mt-6" dense>
            <v-col v-for="song in filteredSongs" :key="song.id" cols="12" sm="6" md="4" lg="3">
              <div class="flip-card" @click="toggleFlip(song.id)">
                <div class="flip-card-inner" :class="{ flipped: flippedCardMap[song.id] }">
                  <!-- Frente do card -->
                  <v-card class="music-card" rounded="lg" elevation="4">
                    <v-img :src="song.cover" cover class="music-img" />

                    <v-card-text>
                      <div class="song-title">{{ song.title }}</div>
                      <div class="song-artist">{{ song.artist }}</div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn icon size="small" color="green-accent-4" @click.stop="playSong(song)">
                        <v-icon>mdi-play-circle</v-icon>
                      </v-btn>
                      <v-btn icon size="small" color="blue" @click.stop="downloadSong(song)">
                        <v-icon>mdi-download</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>

                  <!-- Verso do card -->
                  <v-card class="music-card back-face" rounded="lg" elevation="4">
                    <v-card-text class="flip-back-text">
                      <div class="user-info">
                        <div class="user-avatar" @click.stop="goToProfile(song.user_id)" style="cursor: pointer">
                          <v-icon size="32">mdi-account-circle</v-icon>
                        </div>
                        <div class="user-name">
                          {{ $t('musicPage.addedBy') }}
                          <strong>{{ usersMap[song.user_id] || "Desconhecido" }}</strong>
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
          <p class="text-grey text-subtitle-1 mt-2">{{ $t('musicPage.notFound') }}</p>
        </div>
      </v-container>

      <!-- Botão flutuante -->
      <v-btn icon class="fab" color="green-accent-4" @click="openAddMusic = true">
        <v-icon size="32">mdi-plus</v-icon>
      </v-btn>

      <!-- Modal de Adicionar Música -->
      <v-dialog v-model="openAddMusic" max-width="500px" persistent>
        <v-card class="add-music-modal">
          <v-card-title>
            <span class="text-h6">{{ $t('musicPage.modal.title') }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="newSong.url" :label="$t('musicPage.modal.urlLabel')" outlined dense
              :placeholder="$t('musicPage.modal.placeholder')" />
            <v-progress-linear v-if="showProgress" v-model="progress" color="green-accent-4" height="10" striped rounded
              class="mt-4"></v-progress-linear>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="cancelAddMusic" :disabled="loading">
              {{ $t('musicPage.modal.cancel') }}
            </v-btn>
            <v-btn color="green-accent-4" @click="saveSong" :loading="loading" :disabled="loading || !newSong.url">
              {{ $t('musicPage.modal.save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>

  <!-- Snackbar -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="bottom center">
    {{ snackbarText }}
  </v-snackbar>

  <!-- Player fixo no rodapé -->
  <v-footer v-if="currentSongUrl" app class="footer-player" height="80" color="#121212"
    style="position: fixed; bottom: 0; width: 100%; z-index: 9999">
    <v-container class="d-flex align-center justify-space-between">
      <div class="d-flex align-center gap-4">
        <v-icon color="green-accent-3">mdi-music</v-icon>
        <div class="text-white font-weight-medium">
          {{ currentSongTitle || $t('musicPage.player.nowPlaying') }}
        </div>
      </div>

      <div class="d-flex align-center" style="flex: 1; margin: 0 20px">
        <v-slider v-model="currentTime" :max="duration" color="green-accent-4" track-color="grey darken-1" thumb-label
          hide-details class="flex-grow-1" @change="seekAudio"></v-slider>
      </div>

      <div class="d-flex align-center gap-2">
        <v-btn icon @click="togglePlayPause" color="green-accent-3">
          <v-icon>{{ isPlaying ? "mdi-pause" : "mdi-play" }}</v-icon>
        </v-btn>
        <v-btn icon @click="closePlayer" color="red" class="ml-3">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-footer>

  <!-- ELEMENTO DE ÁUDIO -->
  <audio ref="audioPlayer" :src="currentSongUrl" @ended="onSongEnded" @pause="isPlaying = false"
    @play="isPlaying = true" />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";

// Router
const router = useRouter();

// Estado principal
const search = ref("");
const songs = ref([]);
const flippedCardMap = ref({});
const currentSongUrl = ref(null);
const audioPlayer = ref(null);

// Token e autenticação
const token = ref(localStorage.getItem("token"));
const isLogin = ref(!!token.value);

// Mapeamento de usuários
const usersMap = ref({});

// Estados do modal de nova música
const openAddMusic = ref(false);
const newSong = ref({ url: "" });
const loading = ref(false);
const progress = ref(0);
const showProgress = ref(false);

// Snackbar
const snackbar = ref(false);
const snackbarColor = ref("green");
const snackbarText = ref("");

// Computado de filtro
const filteredSongs = computed(() => {
  return songs.value.filter(
    (song) =>
      song.title.toLowerCase().includes(search.value.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Alternar o card flip
function toggleFlip(id) {
  flippedCardMap.value = {
    ...flippedCardMap.value,
    [id]: !flippedCardMap.value[id],
  };
}

// Tocar música
function playSong(song) {
  if (!song.file_path) {
    showSnackbar("Arquivo não disponível para reprodução", "red");
    return;
  }

  currentSongUrl.value = `http://localhost:3001/downloads/${song.file_path}`;

  nextTick(() => {
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      audioPlayer.value.load();
      audioPlayer.value.play();
    }
  });

  showSnackbar(`Tocando: ${song.title}`, "green");
}

function onSongEnded() {
  showSnackbar("Música finalizada", "blue");
}

// Navegar para o perfil
function goToProfile(userId) {
  router.push(`/profile/${userId}`);
}

// Snackbar util
function showSnackbar(message, color = "green") {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

// Download
function downloadSong(song) {
  if (song.file_path) {
    const link = document.createElement("a");
    link.href = `http://localhost:3001/force-download/${song.file_path}`;
    link.setAttribute("download", `${song.title}.webm`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    showSnackbar("Arquivo não disponível para download", "red");
  }
}

// Nova música
function cancelAddMusic() {
  if (!loading.value) {
    newSong.value = { url: "" };
    openAddMusic.value = false;
    showProgress.value = false;
  }
}

async function saveSong() {
  const { url } = newSong.value;
  if (!url) return showSnackbar("Informe uma URL!", "red");
  if (!token.value) return showSnackbar("Autenticação necessária", "red");

  loading.value = true;
  showProgress.value = true;
  progress.value = 0;

  const progressInterval = setInterval(() => {
    if (progress.value < 90) progress.value += 10;
  }, 500);

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
    clearInterval(progressInterval);

    if (!response.ok) throw new Error(data.error || "Erro ao salvar");

    progress.value = 100;

    songs.value = [
      {
        id: data.id || Date.now(),
        title: data.title,
        artist: data.artist,
        cover: data.cover,
        url: data.url || url,
        file_path: data.file_path,
      },
      ...songs.value,
    ];

    setTimeout(() => {
      newSong.value = { url: "" };
      openAddMusic.value = false;
      loading.value = false;
      showProgress.value = false;
      showSnackbar("Música adicionada!", "green");
    }, 500);
  } catch (err) {
    console.error(err);
    clearInterval(progressInterval);
    loading.value = false;
    showProgress.value = false;
    showSnackbar(err.message || "Erro desconhecido", "red");
  }
}

// Fetch dados
async function fetchUsers() {
  try {
    const res = await fetch("http://localhost:3001/api/users");
    const users = await res.json();
    usersMap.value = Object.fromEntries(users.map((u) => [u.id, u.name]));
  } catch (e) {
    showSnackbar("Erro ao buscar usuários", "red");
  }
}

async function fetchPrivateSongs() {
  try {
    const res = await fetch("http://localhost:3001/api/songs", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    songs.value = await res.json();
  } catch (err) {
    showSnackbar("Erro ao obter músicas", "red");
  }
}

async function fetchPublicSongs() {
  try {
    const res = await fetch("http://localhost:3001/api/songs/public");
    songs.value = await res.json();
  } catch (err) {
    showSnackbar("Erro ao obter músicas públicas", "red");
  }
}

// Player - controle de áudio
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

// Atualizar progresso do áudio
function updateAudioProgress() {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime;
    duration.value = audioPlayer.value.duration || 0;
  }
}

// Alterar tempo da música com slider
function seekAudio(value) {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = value;
  }
}

// Alternar play/pause
function togglePlayPause() {
  if (!audioPlayer.value) return;

  if (audioPlayer.value.paused) {
    audioPlayer.value.play();
  } else {
    audioPlayer.value.pause();
  }
}

function closePlayer() {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
  }
  currentSongUrl.value = null;
  currentTime.value = 0;
  duration.value = 0;
}


// Inicialização
onMounted(async () => {
  await fetchUsers();
  token.value ? await fetchPrivateSongs() : await fetchPublicSongs();
  setInterval(updateAudioProgress, 1000);
});
</script>

<style scoped>
.music-app {
  background-color: #121212;
  color: #e0e0e0;
  min-height: 100vh;
  padding-top: 64px;
  /* espaço para a AppToolbar */
}

@media (max-width: 600px) {
  .music-app {
    padding-top: 56px;
    /* espaço menor para mobile */
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

.add-music-modal .v-progress-linear {
  transition: all 0.3s ease;
}

.add-music-modal .v-btn--loading {
  opacity: 0.8;
}
</style>
