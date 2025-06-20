import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createI18n } from 'vue-i18n';

import en from './locales/en';
import pt from './locales/pt';
import es from './locales/es';
import fr from './locales/fr';

// Plugins
import { registerPlugins } from "@/plugins";

// Styles
import "unfonts.css";


const i18n = createI18n({
  locale: 'en', // idioma padrão
  fallbackLocale: 'en',
  messages: {
    en,
    pt,
    es,
    fr,
  },
});

const app = createApp(App);

// Registre o Pinia antes de qualquer outro plugin
app.use(createPinia());

// Registre outros plugins após o Pinia
registerPlugins(app);

app.use(i18n);

app.mount("#app");
