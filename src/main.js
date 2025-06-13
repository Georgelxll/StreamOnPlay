import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Styles
import 'unfonts.css'

const app = createApp(App)

// Registre o Pinia antes de qualquer outro plugin
app.use(createPinia())

// Registre outros plugins após o Pinia
registerPlugins(app)

app.mount('#app')
