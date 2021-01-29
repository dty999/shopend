<template>
  <el-dialog
    :title="title"
    :visible.sync="Visible"
    width="50%"
    @close="handleClose"
  >
    <img :src="imgSrc" class="imgClass" />
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
  props: ["imgSrc"],
  methods: {
    handleClose() {
      this.Visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.imgClass {
  width: 100%;
  height: 100%;
}
</style>
