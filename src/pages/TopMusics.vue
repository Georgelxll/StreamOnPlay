<template>
  <v-app>
    <v-main>
      <!-- Conteúdo da página TopMusics -->
      <v-container>
        <h1 style="text-align: center;">Top Músicas</h1>
        <v-card class="mt-12 mx-auto" color="surface-light" max-width="400">
          <v-card-text>
            <v-text-field
              :loading="loading"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search Musics"
              variant="solo"
              hide-details
              single-line
              @click:append-inner="onClick"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-container>

      <v-col cols="3" class="mx-auto">
        <v-card color="#1F7087">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5"> Halcyon Days </v-card-title>

              <v-card-subtitle>Ellie Goulding</v-card-subtitle>

              <v-card-actions>
                <v-btn class="ms-2" icon="mdi-play" variant="text"></v-btn>
              </v-card-actions>
            </div>

            <v-avatar class="ma-3" rounded="0" size="125">
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"
              ></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="3" class="mx-auto">
        <v-card color="#952175">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5"> Halcyon Days </v-card-title>

              <v-card-subtitle>Ellie Goulding</v-card-subtitle>

              <v-card-actions>
                <v-btn class="ms-2" icon="mdi-play" variant="text"></v-btn>
              </v-card-actions>
            </div>

            <v-avatar class="ma-3" rounded="0" size="125">
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
              ></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const loaded = ref(false);
const loading = ref(false);

function onClick() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    loaded.value = true;
  }, 2000);
}
</script>
