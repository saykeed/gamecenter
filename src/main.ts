import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/main.css'
import router from './router'
import OtherPages from './layout/OtherPages.vue'
import IngamePages from './layout/IngamePages.vue'

const app = createApp(App)
app.use(router).mount('#app')
app.component('other-pages', OtherPages)
app.component('ingame-pages', IngamePages)