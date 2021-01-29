<template>
  <el-dialog
    :title="title"
    :visible.sync="Visible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="addForm" label-width="100px" width="50%" ref="dailogRef">
      <el-form-item :label="labelText">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="Visible = false">
        取 消
      </el-button>
      <el-button type="primary" @click="addParams">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      Visible: false,
      addForm: {},
      labelText: "",
      sel: "",
      cateId: "",
    };
  },
  methods: {
    handleClose() {
      this.Visible = false;
      // this.$refs.dailogRef.resetFields();
      this.addForm = {};
    },
    addParams() {
      this.$http
        .post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.sel,
        })
        .then((res) => {
          if (res.data.meta.status !== 201) {
            return this.$message.error("添加失败");
          }
          this.$message.success("添加成功");
          this.Visible = false;
          this.$emit("success");
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
