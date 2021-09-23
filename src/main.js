// this is the entry point (import stuff)

// import createApp (vue 3)
import { createApp } from 'vue'
// import the App component for entry
import App from './App.vue'

// import store (for storing state)
// @/sth the @/ is mena src/
import store from "@/store"
// import the ui plugin that you like (or other plugins)
import naive from 'naive-ui'

// set app by createApp (I don't know how to explain)
const app = createApp(App)

// use the plugins
app.use(store)
app.use(naive)

// start! (I don't know how to explain)
app.mount('#app')