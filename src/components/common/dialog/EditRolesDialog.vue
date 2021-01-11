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
        <el-input v-model="RolesForm.rolesName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="RolesForm.rolesDesc"></el-input>
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
        rolesName: "",
        rolesDesc: "",
      },
    };
  },
  methods: {
    handleClose() {},
    addRoles() {},
  },
};
</script>

<style lang="less" scoped></style>
