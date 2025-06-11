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
          <h1 class="text-center mb-6">Musics</h1>

          <v-card class="mx-auto mb-12" color="surface-light" max-width="400">
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

        <v-dialog v-model="showAddMusicDialog" width="600" persistent>
          <v-card style="height: 600px">
            <v-card-title class="text-h6">Add New Music</v-card-title>
            <v-card-text>
              <!-- Coloque aqui os campos do formulário -->
              <v-text-field label="Title" />
              <v-text-field label="Artist" />
              <v-text-field label="Cover URL" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="addMusicURL">Add</v-btn>
              <v-btn color="grey" @click="showAddMusicDialog = false"
                >Cancel</v-btn
              >
            </v-card-actions>
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
