<template>
  <v-app>
    <v-main>
      <v-container class="fill-height no-scroll" max-width="900">
        <div>
          <div class="mb-8 text-center">
            <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
            <v-img class="mb-4" height="150" src="@/assets/logo.png" />
          </div>

          <v-row>
            <v-col cols="12">
              <v-card
                class="py-4"
                color="surface-variant"
                rounded="lg"
                variant="tonal"
              >
                <template #title>
                  <h2 class="text-h5 font-weight-bold">Github</h2>
                </template>

                <template #subtitle>
                  <div class="text-subtitle-1">
                    View this page on my github <br />
                    <v-kbd>
                      <a
                        href="https://github.com/Georgelxll"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="text-decoration: none; color: inherit"
                      >
                        https://github.com/Georgelxll
                      </a>
                    </v-kbd>
                  </div>
                </template>
                <template #image>
                  <v-img
                    src="@/assets/github.png"
                    position="right"
                    width="50"
                    height="50"
                  />
                </template>
              </v-card>
            </v-col>
            <v-col v-for="link in links" :key="link.href" cols="12">
              <v-card
                append-icon="mdi-open-in-new"
                class="py-4"
                color="surface-variant"
                :href="link.href"
                :prepend-icon="link.icon"
                rel="noopener noreferrer"
                rounded="lg"
                :subtitle="link.subtitle"
                target="_blank"
                :title="link.title"
                variant="tonal"
              />
            </v-col>
          </v-row>
        </div>
      </v-container>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
const links = [
  {
    href: "https://github.com/Georgelxll/StreamOnPlay",
    icon: "mdi-text-box-outline",
    subtitle: "Learn about all things StreamON Play in our documentation.",
    title: "How i use this?",
  },
];
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden; /* pode tentar aqui também */
}
</style>
