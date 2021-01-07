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
			<el-aside :width="isCollapse ? '64px' : '200px'">
				<div class="toggle_btn" @click="toggle_Collapse">|||</div>
				<!-- 菜单栏区域 -->
				<el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.fullPath">
					<!-- //一级菜单 -->
					<el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
						<!-- 一级菜单的模板区域 -->
						<template slot="title">
							<!-- 图标 -->
							<i :class="iconsObj[item.id]"></i>
							<!-- 文本 -->
							<span>{{ item.authName }}</span>
						</template>
						<!-- 一级菜单里的二级菜单 -->
						<el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click='saveNavState'>
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{ subItem.authName }}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>
<!--  -->
<script>
	export default {
		data() {
			return {
				menulist: [],
				iconsObj: {
					125: "iconfont icon-user",
					103: "iconfont icon-tijikongjian",
					101: "iconfont icon-shangpin",
					102: "iconfont icon-danju",
					145: "iconfont icon-baobiao",
				},
				//是否折叠
				isCollapse: false,
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
			//点击切换菜单折叠状态
			toggle_Collapse() {
				this.isCollapse = !this.isCollapse;
			},
			saveNavState(){
				// console.log(this.$route.fullPath);
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

		.el-menu {
			// 解决右侧对不齐
			border-right: none;
		}
	}

	.el-main {
		background-color: #eaedf1;
	}

	.home_container {
		height: 100%;
	}

	.iconfont {
		margin-right: 10px;
	}

	.toggle_btn {
		background-color: #4a5064;
		font-size: 10px;
		line-height: 24px;
		color: white;
		text-align: center;
		letter-spacing: 0.3em;
		cursor: pointer;
	}
</style>
