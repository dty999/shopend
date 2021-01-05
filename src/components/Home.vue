<template>
	<div>
		<el-button type='info' @click='logout'>退出</el-button>
	</div>
</template>
<!--  -->
<script>
	export default {
		methods: {
			logout() {
				//清空token返回登录页
				window.sessionStorage.clear()
				this.$router.push('./login')
			}
		}
	}
</script>

<style scoped>

</style>
