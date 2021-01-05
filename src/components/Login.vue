<template>
	<div class="login_container">
		<div class="login_box">
			<!-- 头像 -->
			<div class="avatar_box">
				<img src="../assets/logo.png" alt="">
			</div>
			<!-- 表单 -->
			<el-form ref='loginFormRef' label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
				<!-- 用户名 -->
				<el-form-item prop="username">
					<!-- 使用第三方字体图标 -->
					<el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" type='password' prefix-icon="iconfont icon-3702mima"></el-input>
				</el-form-item>
				<!-- 按钮组 -->
				<el-form-item class="btns">
					<el-button type="primary" @click='handleLoginClick'>登录</el-button>
					<el-button type="info" @click='handleRestClick'>重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 登录表单的数据绑定对象
				loginForm: {
					username: 'admin',
					password: '123456'
				},

				loginFormRules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 5,
							message: '三到五个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 9,
							message: '六到九个字符',
							trigger: 'blur'
						}
					]
				},


			}
		},
		methods: {
			handleRestClick() {
				this.$refs.loginFormRef.resetFields()
			},
			handleLoginClick() {
				this.$refs.loginFormRef.validate(async (valid) => {
					if (!valid) return
					const {
						data: res
					} = await this.$http.post('login', this.loginForm)
					if (res.meta.status !== 200) return this.$message.error('登陆失败')
					this.$message.success('登陆成功')
					console.log(res);
					window.sessionStorage.setItem('token',res.data.token)
					this.$router.push('/home')
				})
			},
		},

	}
</script>

<style lang="less" scoped>
	.login_container {
		background-color: #2b4b6b;
		height: 100%;
	}

	.login_box {
		width: 450px;
		height: 300px;
		background-color: #FFFFFF;
		border-radius: 3px;
		// 居中
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.avatar_box {
		height: 130px;
		width: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #eee;
		//移动到中间靠上
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		//给padding加上背景
		background-color: white;

		img {
			width: 100%;
			height: 100%;
			border-radius: 50%; //给图片加圆角
			background-color: #eee;
		}
	}

	.login_form {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
	}

	.btns {
		display: flex;
		justify-content: flex-end;
	}
</style>
