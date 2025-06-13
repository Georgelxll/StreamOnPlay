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
          <v-col
            v-for="(music, index) in cards"
            :key="index"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card :color="music.color">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h6">{{ music.title }}</v-card-title>
                  <v-card-subtitle>{{ music.artist }}</v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      icon="mdi-play"
                      variant="text"
                      @click="
                        playMusic(
                          music.title,
                          music.artist,
                          music.cover,
                          music.color
                        )
                      "
                    />
                  </v-card-actions>
                </div>
                <v-avatar class="ma-3" rounded="0" size="125">
                  <v-img :src="music.cover" />
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
          <div style="position: absolute; top: 90px; left: 20px">
            <v-btn
              icon="mdi-chevron-left"
              @click="showFooterOn"
              color="black"
              variant="text"
            ></v-btn>
          </div>
          <!-- Botão close -->
          <div style="position: absolute; top: 90px; right: 20px">
            <v-btn
              icon="mdi-close"
              @click="stopMusic"
              color="black"
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

        <v-footer
          v-if="showFooter"
          app
          class="px-4 py-2"
          height="80"
          :style="{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: playing ? lightenColor(currentColor, 0.5) : '',
            zIndex: 1000,
            transition: 'transform 0.3s ease, background-color 1s ease',
          }"
        >
          <v-row align="center" class="w-100" no-gutters>
            <v-col cols="auto">
              <v-btn
                icon="mdi-close"
                @click="stopMusic"
                color="black"
                variant="text"
              ></v-btn>
            </v-col>
            <v-col class="text-center">
              <v-btn
                icon
                :color="paused ? 'white' : 'grey-darken-2'"
                @click="togglePause"
              >
                <v-icon size="36">{{ paused ? "mdi-play" : "mdi-pause" }}</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                icon
                :color="paused ? 'white' : 'grey-darken-2'"
                @click="togglePause"
              >
                <v-icon size="36">{{ paused ? "mdi-play" : "mdi-pause" }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-footer>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const musicTitle = ref("");
const musicArtist = ref("");
const musicUrl = ref("");
const showAddMusicDialog = ref(false);
const showFooter = ref(false);
const playing = ref(false);
const paused = ref(false);
const currentColor = ref("#1a73e8");
const currentTitle = ref("");
const currentArtist = ref("");
const currentCover = ref("");
const progress = ref(0);
const loading = ref(false);

const cards = ref([
  {
    title: "Song Title",
    artist: "Artist Name",
    cover: "https://via.placeholder.com/150",
    color: "#FF5733",
  },
]);

const addMusicModal = () => {
  showAddMusicDialog.value = true;
};

const closeAddMusic = () => {
  showAddMusicDialog.value = false;
};

const saveMusic = async () => {
  if (!musicTitle.value || !musicArtist.value || !musicUrl.value) {
    alert("Informe todos os campos!");
    return;
  }

  try {
    loading.value = true;

    const response = await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: musicTitle.value,
        artist: musicArtist.value,
        url: musicUrl.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      cards.value.push({
        title: musicTitle.value,
        artist: musicArtist.value,
        cover: data.cover || "https://via.placeholder.com/150", 
        color: "#FF5733", 
      });

      alert("Música adicionada com sucesso!");
    } else {
      alert(`Erro: ${data.error || "Erro desconhecido."}`);
    }
  } catch (err) {
    alert("Erro ao salvar música!");
    console.error(err);
  } finally {
    loading.value = false;
  }

  closeAddMusic();
};
</script>

<style scoped>
/* Custom CSS */
.green-btn {
  background-color: #12833e;
  color: white;
}
.input-white .v-input__control .v-input__slot {
  background-color: #000 !important;
}
</style>
