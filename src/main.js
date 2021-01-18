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
Vue.filter("dateForm", function (dateStr, pattern = '') {
	var dt = new Date(dateStr)
	var yy = dt.getFullYear()
	// ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
	var mm = (dt.getMonth() + 1).toString().padStart(2, '0')
	var dd = dt.getDate().toString().padStart(2, '0')
	var h = dt.getHours().toString().padStart(2, '0')
	var m = dt.getMinutes().toString().padStart(2, '0')
	var s = dt.getSeconds().toString().padStart(2, '0')

	if (pattern.toLowerCase() === 'yyyy-mm-dd') {
		return yy + '-' + mm + '-' + dd
	} else {
		return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s
	}
})

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
