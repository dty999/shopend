import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

const Home = () => import('../components/Home')
const Welcome = () => import('../components/Welcome')
const Users = () => import('../components/user/Users')
const Rights = () => import('../components/power/Rights')
const Roles = () => import('../components/power/Roles')
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
	component: Home,
	redirect: '/welcome',
	children: [{
		path: '/welcome',
		component: Welcome
	}, {
		path: '/users',
		component: Users
	}, {
		path: '/rights',
		component: Rights

	},
	{
		path: '/roles',
		component: Roles
	}]
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
