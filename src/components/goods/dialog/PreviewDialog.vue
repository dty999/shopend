<template>
  <el-dialog
    :title="title"
    :visible.sync="Visible"
    width="50%"
    @close="handleClose"
  >
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: "预览图片",
      Visible: false,
    };
  },
  methods: {
    handleClose() {
      this.Visible = false;
    },
  },
};
</script>

<style lang="less" scoped></style>
