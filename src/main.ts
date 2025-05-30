import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from "./router";
import { createPinia } from 'pinia'
import '@/theme/index.scss'
import '@icon-park/vue-next/styles/index.css'
import 'splitpanes/dist/splitpanes.css'

const pinia = createPinia()

createApp(App)
.use(router)
.use(pinia)
.mount('#app')
.$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
