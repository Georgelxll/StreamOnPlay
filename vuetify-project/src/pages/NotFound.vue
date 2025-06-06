<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="py-8 text-center">
          <v-icon size="100" color="error">mdi-alert-circle-outline</v-icon>
          <v-card-title class="text-h4">404 - Página não encontrada</v-card-title>
          <v-card-text>
            A página que você está procurando não existe.
          </v-card-text>
          <v-btn to="/" color="primary" class="mt-4">Voltar para Home</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>