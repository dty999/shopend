import Vue from 'vue'
import {
	Button,
	Form,
	FormItem,
	Input,
	Message
} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//消息弹框的用法不一样
Vue.prototype.$message = Message
