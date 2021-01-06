<template>
	<el-container class="home_container">
		<el-header>
			<div>
				<img src="../assets/logo.png" alt="" />
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>
		<el-container>
			<el-aside width="200px">
				<el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
					<!-- //一级菜单 -->
					<el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
						<!-- 一级菜单的模板区域 -->
						<template slot="title">
							<!-- 图标 -->
							<i class="el-icon-location"></i>
							<!-- 文本 -->
							<span>{{ item.authName }}</span>
						</template>
						<!-- 一级菜单里的二级菜单 -->
						<el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{ subItem.authName }}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>Main</el-main>
		</el-container>
	</el-container>
</template>
<!--  -->
<script>
	export default {
		data() {
			return {
				menulist: [],
			};
		},
		methods: {
			logout() {
				//清空token返回登录页
				window.sessionStorage.clear();
				this.$router.push("./login");
			},
			async getMenuList() {
				const {
					data: res
				} = await this.$http.get("menus");
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
				this.menulist = res.data;
			},
		},
		created() {
			this.getMenuList();
		},
	};
</script>

<style scoped lang="less">
	.el-header {
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// padding-left: 0;
		color: #fff;
		font-size: 20px;

		>div {
			display: flex;
			align-items: center;

			span {
				margin-left: 15px;
			}

			img {
				width: 40px;
			}
		}
	}

	.el-aside {
		background-color: #333744;
	}

	.el-main {
		background-color: #eaedf1;
	}

	.home_container {
		height: 100%;
	}
</style>
