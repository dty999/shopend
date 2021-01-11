<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表表格区 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand"> </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting" size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClose"
      >
        <!-- 表单 -->
        <el-form
          ref="addRolesFormRef"
          label-width="100px"
          :model="addRolesForm"
          :rules="addRolesRules"
        >
          <!-- 角色名称 -->
          <el-form-item label="角色名称">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <!-- 角色描述 -->
          <el-form-item label="角色描述">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">
            取 消
          </el-button>
          <el-button type="primary" @click="addRoles">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <!-- 编辑对话框 -->
      <EditRolesDialog ref="editRolesDialog" @editSuccess="cb_editSuccess" />
    </el-card>
  </div>
</template>

<script>
import EditRolesDialog from "../common/dialog/EditRolesDialog.vue";
export default {
  components: {
    EditRolesDialog,
  },
  data() {
    return {
      //所有角色列表数据
      rolesList: [],
      //添加角色对话框
      addDialogVisible: false,
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      addRolesRules: {
        //表单验证规则
        rolesName: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //获取角色列表
    getRolesList() {
      this.$http.get(`roles`).then((res) => {
        const data = res.data;
        if (data.meta.status !== 200)
          return this.$message.error("获取角色列表失败");
        this.rolesList = data.data;
        // console.log(this.rolesList);
      });
    },
    addDialogClose() {
      console.log("关闭");
      this.$refs.addRolesFormRef.resetFields();
    },
    addRoles() {
      this.$refs.addRolesFormRef.validate((valid) => {
        if (!valid) return;
        this.$http.post("roles", this.addRolesForm).then((res) => {
          if (res.data.meta.status !== 201)
            return this.$message.error("添加角色失败");
          this.$message.success("添加角色成功");
          this.addDialogVisible = !this.addDialogVisible;
          this.getRolesList();
        });
      });
    },
    handleEdit(id) {
      this.$refs.editRolesDialog.Visible = true;
      // console.log(id);
      //发起网络请求获取角色详情
      this.$http.get("roles/" + id).then((res) => {
        const data = res.data;
        if (data.meta.status !== 200)
          return this.$message.error("获取角色详情失败");
        // console.log(data.data);
        this.$refs.editRolesDialog.RolesForm = data.data;
        // console.log(this.$refs.editRolesDialog.RolesForm);
      });
    },
    cb_editSuccess() {
      this.getRolesList();
    },
    deleteRoles(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //执行删除操作的网络请求
          this.$http.delete(`roles/${id}`).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除失败");
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getRolesList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
