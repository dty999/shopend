import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

const Home = () => import('../components/Home')

Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/Home',
		component: Home
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	if (to.path === '/login' || window.sessionStorage.getItem('token')) return next()
	next('/login')
})

export default router
