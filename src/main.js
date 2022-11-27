import { createApp } from 'vue'
import App from './App.vue'
import { GlobalCmComponent } from "codemirror-editor-vue3";
createApp(App).use(GlobalCmComponent).mount('#app')
