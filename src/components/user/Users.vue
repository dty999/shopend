<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="users" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180px">
          <template v-slot="">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes,prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClose"
      >
        <!-- 表单 -->
        <el-form
          ref="addUserFormRef"
          label-width="70px"
          :model="addUserForm"
          :rules="addUserRules"
        >
          <!-- 用户名 -->
          <el-form-item prop="username" label="用户名">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password" label="密码">
            <el-input v-model="addUserForm.password" type="password"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="phone" label="手机">
            <el-input v-model="addUserForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">
            取 消
          </el-button>
          <el-button type="primary" @click="addUser">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1, //当前的页
        pagesize: 2,
      },
      total: 0,
      users: [],
      addDialogVisible: false,
      addUserForm: {
        //表单数据
        username: "",
        password: "",
        email: "",
        phone: "",
      },
      addUserRules: {
        //表单验证规则
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 5,
            message: "三到五个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 9,
            message: "六到九个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {},
        ],
        phone: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.total = res.data.total;
      this.users = res.data.users;
      // console.log(this.users);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听用户状态
    async userStateChanged(user) {
      const { data: res } = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state;
        return this.$message.error("更改用户状态失败");
      }
      this.$message.success("修改成功");
    },
    addDialogClose() {
      // 监听添加用户对话框的关闭事件
      this.$refs.addUserFormRef.resetFields();
    },
    //添加用户
    addUser() {
      //表单预校验
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return; //valid为假表单数据不合法,则不发送网络请求
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 201) this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
