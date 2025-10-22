// src/main.js
import './style.css'

import { createApp } from 'vue'
import App from './App.vue'

// 1. Impor router
import router from './router'

const app = createApp(App)

// 2. Gunakan router
app.use(router)

app.mount('#app')