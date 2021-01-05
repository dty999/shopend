import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/base.css'//直接导入css
import './assets/fonts/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL = 'https://api.naccl.top/vue/shop/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
