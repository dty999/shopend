<template>
  <el-dialog
    title="编辑角色"
    :visible.sync="Visible"
    width="30%"
    @close="handleClose"
  >
    <!-- 表单 -->
    <el-form label-width="100px" :model="RolesForm">
      <el-form-item label="角色名称">
        <el-input v-model="RolesForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="RolesForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Visible = false">
        取 消
      </el-button>
      <el-button type="primary" @click="addRoles">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      Visible: false,
      RolesForm: {
        roleName: "niha",
        roleDesc: "",
        roleId: 0,
      },
    };
  },
  methods: {
    handleClose() {},
    addRoles() {
      this.$http
        .put(`roles/${this.RolesForm.roleId}`, {
          roleName: this.RolesForm.roleName,
          roleDesc: this.RolesForm.roleDesc,
        })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("修改失败");
          this.Visible = false;
          this.$emit("editSuccess");
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
