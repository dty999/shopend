import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/base.css' //直接导入css
import './assets/fonts/iconfont.css'

import axios from 'axios'

// axios.defaults.baseURL = 'https://api.naccl.top/vue/shop/api/private/v1/'

axios.defaults.baseURL = 'http://vueshop.pixiv.download/api/private/v1/'

axios.interceptors.request.use(config => {
	// console.log(config)
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})
Vue.prototype.$http = axios

import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)


Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
