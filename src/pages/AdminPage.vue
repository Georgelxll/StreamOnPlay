<template>
  <v-container>
    <h1 class="text-h5 font-weight-bold mt-16">Painel Administrativo</h1>

    <!-- Músicas adicionadas -->
    <v-card class="mb-6">
      <v-card-title>Músicas Adicionadas</v-card-title>
      <v-data-table :headers="songHeaders" :items="songs" class="elevation-1">
        <template #item.cover="{ item }">
          <v-avatar size="40">
            <img :src="item.cover" alt="Capa" />
          </v-avatar>
        </template>
      </v-data-table>
    </v-card>

    <!-- Arquivos em downloads -->
    <v-card>
      <v-card-title>
        Downloads
        <v-spacer />
        <v-btn @click="loadDownloads" color="primary" variant="outlined">Atualizar</v-btn>
      </v-card-title>
      <v-data-table :headers="downloadHeaders" :items="downloads" class="elevation-1">
        <template #item.actions="{ item }">
          <v-btn color="red" icon @click="deleteFile(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const songs = ref([])
const downloads = ref([])
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

const songHeaders = [
  { text: 'Título', value: 'title' },
  { text: 'Artista', value: 'artist' },
  { text: 'Capa', value: 'cover' },
  { text: 'Adicionado por', value: 'added_by' },
  { text: 'Data', value: 'created_at' }
]

const downloadHeaders = [
  { text: 'Arquivo', value: 'name' },
  { text: 'Ações', value: 'actions', sortable: false }
]

const loadSongs = async () => {
  try {
    const res = await axios.get('http://localhost:3001/api/admin/songs', { headers });
    songs.value = res.data;
  } catch (err) {
    console.error("Erro ao carregar músicas:", err);
  }
};

const loadDownloads = async () => {
  try {
    const res = await axios.get('http://localhost:3001/api/admin/downloads', { headers });
    downloads.value = res.data.map((f) => ({ name: f }));
  } catch (err) {
    console.error("Erro ao carregar downloads:", err);
  }
};

const deleteFile = async (file) => {
  if (!confirm(`Tem certeza que deseja excluir ${file.name}?`)) return;

  try {
    await axios.delete(`http://localhost:3001/api/admin/downloads/${file.name}`, { headers });
    downloads.value = downloads.value.filter(f => f.name !== file.name);
  } catch (err) {
    alert("Erro ao deletar o arquivo");
    console.error(err);
  }
};

onMounted(() => {
  loadSongs()
  loadDownloads()
})
</script>