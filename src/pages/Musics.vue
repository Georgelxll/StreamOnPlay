<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        :style="{
          transition: 'background-color 1s ease',
          backgroundColor: playing ? lightenColor(currentColor, 0.5) : '',
          minHeight: '100vh',
        }"
      >
        <!-- titulo e busca -->
        <div v-if="!playing" class="py-8">
          <h1 class="text-center mt-16">Musics</h1>

          <v-card
            class="mx-auto mb-10 mt-10"
            color="surface-light"
            max-width="400"
          >
            <v-card-text>
              <v-row align="center" no-gutters>
                <v-col cols="10">
                  <v-text-field
                    :loading="loading"
                    append-inner-icon="mdi-magnify"
                    density="compact"
                    label="Search Musics"
                    variant="solo"
                    hide-details
                    single-line
                    @click:append-inner="onClick"
                  />
                </v-col>
                <v-col cols="2" class="d-flex justify-end">
                  <v-tooltip location="bottom" theme="dark" color="#2a9db4">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon
                        variant="text"
                        v-bind="props"
                        @click="addMusicModal"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    Add a new music
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- musicas -->
        <v-row v-if="!playing" justify="center" align="stretch" dense>
          <v-col cols="12" sm="6" md="3">
            <v-card color="#1F7087">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h6">Halcyon Days</v-card-title>
                  <v-card-subtitle>Ellie Goulding</v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      icon="mdi-play"
                      variant="text"
                      @click="
                        playMusic(
                          'Halcyon Days',
                          'Ellie Goulding',
                          'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
                          '#1F7087'
                        )
                      "
                    />
                  </v-card-actions>
                </div>
                <v-avatar class="ma-3" rounded="0" size="125">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"
                  />
                </v-avatar>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card color="#952175">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h6">Lights</v-card-title>
                  <v-card-subtitle>Ellie Goulding</v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      icon="mdi-play"
                      variant="text"
                      @click="
                        playMusic(
                          'Lights',
                          'Ellie Goulding',
                          'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
                          '#952175'
                        )
                      "
                    />
                  </v-card-actions>
                </div>
                <v-avatar class="ma-3" rounded="0" size="125">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                  />
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- reprodução -->
        <div
          v-if="playing"
          class="d-flex flex-column align-center justify-center"
          style="height: 100vh"
        >
          <!-- Botão de voltar -->
          <div style="position: absolute; top: 90px; left: 20px; background-color: black; border-radius: 100px;">
            <v-btn
              icon="mdi-chevron-left"
              @click="closeMusic"
              color="white"
              variant="text"
            ></v-btn>
          </div>
          
          <v-card
            :style="{
              height: '500px',
              width: '300px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              backgroundColor: currentColor,
              transition: 'all 0.5s ease',
            }"
            class="d-flex flex-column align-center justify-center pa-6"
          >
            <v-avatar
              size="150"
              class="mb-4"
              style="
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
                border: 5px solid white;
              "
            >
              <v-img :src="currentCover" />
            </v-avatar>
            <v-card-title class="text-center text-h6 font-weight-medium mb-2">
              {{ currentTitle }}
            </v-card-title>
            <v-card-subtitle
              class="text-center text-body-2 text-grey-darken-1 mb-4"
            >
              {{ currentArtist }}
            </v-card-subtitle>
            <v-row align="center" justify="space-around" class="w-100 mb-2">
              <v-icon>mdi-music-note</v-icon>
              <v-icon color="red">mdi-heart</v-icon>
              <v-icon>mdi-volume-high</v-icon>
            </v-row>

            <div
              class="d-flex align-center justify-space-between w-100 px-4 text-caption mb-1"
            >
              <span>0:00</span>
              <span>1:20</span>
            </div>

            <v-slider
              color="white"
              track-color="grey-lighten-1"
              thumb-label="always"
              class="w-100"
              v-model="progress"
              min="0"
              max="100"
            />

            <v-btn
              icon
              size="large"
              class="mt-6"
              :color="paused ? 'white' : 'grey-darken-2'"
              @click="togglePause"
            >
              <v-icon size="36">{{ paused ? "mdi-play" : "mdi-pause" }}</v-icon>
            </v-btn>
          </v-card>
        </div>

        <v-dialog
          v-model="showAddMusicDialog"
          max-width="420px"
          persistent
          hide-overlay
        >
          <v-card class="pa-6" style="background-color: #000" dark>
            <v-btn
              icon
              class="close-btn"
              @click="closeAddMusic"
              style="position: absolute; top: 18px; right: 22px; color: white"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-card-title class="justify-center">
              <h2 class="text-white text-h5 font-weight-bold text-center">
                Adicionar Música
              </h2>
            </v-card-title>

            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="musicTitle"
                  label="Título da música"
                  dense
                  hide-details
                  color="white"
                  variant="outlined"
                  bg-color="#12833e"
                  class="input-white mb-4"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="musicArtist"
                  label="Artista"
                  dense
                  hide-details
                  color="white"
                  variant="outlined"
                  bg-color="#12833e"
                  class="input-white mb-4"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="musicUrl"
                  label="URL da música"
                  dense
                  hide-details
                  color="white"
                  variant="outlined"
                  bg-color="#12833e"
                  class="input-white mb-6"
                  required
                ></v-text-field>

                <v-btn
                  @click="saveMusic"
                  block
                  class="text-white green-btn text-uppercase font-weight-bold"
                  size="large"
                >
                  Salvar Música
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const showAddMusicDialog = ref(false);

function addMusicModal() {
  showAddMusicDialog.value = true;
}

function addMusicURL() {}

// estados
const loaded = ref(false);
const loading = ref(false);
const paused = ref(false);

function onClick() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    loaded.value = true;
  }, 2000);
}

const playing = ref(false);
const currentTitle = ref("");
const currentArtist = ref("");
const currentCover = ref("");
const currentColor = ref("");

function playMusic(title, artist, cover, color) {
  currentTitle.value = title;
  currentArtist.value = artist;
  currentCover.value = cover;
  currentColor.value = color;
  playing.value = true;
}

function stopMusic() {
  playing.value = false;
  paused.value = false;
}

function togglePause() {
  paused.value = !paused.value;
}

function closeMusic() {
  playing.value = false;
  stopMusic();
}

function closeAddMusic() {
  showAddMusicDialog.value = false;
}

// Função para clarear a cor (hex) dinamicamente
function lightenColor(hex, amount = 0.5) {
  let col = hex.replace("#", "");
  if (col.length === 3) {
    col = col
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(col, 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + 255 * amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + 255 * amount);
  const b = Math.min(255, (num & 0xff) + 255 * amount);

  return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
}
</script>
<style scoped>
.v-dialog__content {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.close-btn {
  position: absolute;
  top: 18px;
  right: 22px;
  font-size: 1.5rem;
  background: transparent;
  border: none;
  color: White;
  cursor: pointer;
}

.input-white .v-input__control {
  background-color: #12833e !important;
  border-radius: 12px;
}

::v-deep(.input-white .v-field-label) {
  color: white !important;
  font-size: 16px;
  font-weight: 500;
}

::v-deep(.input-white .v-field.v-field--focused .v-field-label),
::v-deep(.input-white .v-field.v-field--dirty .v-field-label) {
  color: white !important;
  font-size: 17px;
  font-weight: 600;
}

.green-btn {
  background-color: #12833e;
  color: black;
  font-weight: 600;
  border-radius: 50px;
}

.green-btn:hover {
  background-color: #10702e;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
