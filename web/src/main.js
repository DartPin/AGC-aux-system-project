import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios";

Vue.config.productionTip = false

export const httpServer = axios.create(
    {
      withCredentials: true,
      baseURL: '/api/',
      headers:{"Accept-Language": "ru-RU,ru"}
    }
)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
