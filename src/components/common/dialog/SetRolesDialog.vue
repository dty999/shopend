<template>
  <el-dialog
    title="分配角色"
    :visible.sync="Visible"
    width="50%"
    @close="handleClose"
  >
    <div>
      <p>当前用户:{{ userInfo.username }}</p>
      <p>当前角色:{{ userInfo.role_name }}</p>
      <p>
        分配角色:
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Visible = false">
        取 消
      </el-button>
      <el-button type="primary" @click="setRoles">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      Visible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId: null,
    };
  },
  methods: {
    handleClose() {
      // this.userInfo = {};
      this.selectedRoleId = null;
    },
    setRoles() {
      if (!this.selectedRoleId) return;
      console.log(this.selectedRoleId);
      console.log(this.userInfo.id);
      this.$http
        .put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200)
            return this.$message.error("分配角色失败");
          this.Visible = false;
          this.$message.success("分配角色成功");
          this.$emit("success");
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
