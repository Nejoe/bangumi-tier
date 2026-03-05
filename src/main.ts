import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// html2canvas
import { Html2CanvasPlugin } from 'vue3-html2canvas'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const bangumiTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#F09199',
    secondary: '#00AEEC',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    white: '#FFFFFF',
    black: '#000000'
  }
}
const autoDarkTheme: ThemeDefinition = {
  dark: true
}
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'bangumiTheme',
    variations: {
      colors: ['primary', 'secondary'],
      lighten: 4,
      darken: 2
    },
    themes: {
      bangumiTheme,
      autoDarkTheme
    }
  }
})

app.use(pinia).use(router).use(vuetify).use(Html2CanvasPlugin)

app.mount('#app')
