<template>
  <el-dialog
    title="编辑权限"
    :visible.sync="Visible"
    width="50%"
    @close="handleClose"
  >
    <el-tree
      ref="treeRef"
      :data="rightsList"
      :props="treeProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="def_keys"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Visible = false">
        取 消
      </el-button>
      <el-button type="primary" @click="allotRights">
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
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      def_keys: [],
      roles: null,
    };
  },
  methods: {
    getLeafRights(node) {
      const that = this;
      if (!node.children) {
        return that.def_keys.push(node.id);
      }
      node.children.forEach((item) => {
        that.getLeafRights(item);
      });
    },
    handleClose() {
      this.def_keys = [];
    },
    allotRights() {
      this.Visible = false;
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ].join(",");
      this.$http
        .post(`roles/${this.roles.id}/rights`, { rids: keys })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("分配失败");
          this.$message.success("分配成功");
          this.$emit("Rufsh");
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
