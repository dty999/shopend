<template>
  <el-dialog
    title="添加分类"
    :visible.sync="Visible"
    width="50%"
    @close="handleClose"
  >
    <!-- 表单 -->
    <el-form label-width="100px" :model="addCateForm" ref="mainForm">
      <el-form-item label="分类名称:">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类:">
        <!-- options指定数据源 -->
        <el-cascader
          v-model="cascaderSelected"
          :options="parentCate"
          :props="cascaderProps"
          @change="handleCascaderChange"
          clearable
          change-on-select
        ></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Visible = false">
        取 消
      </el-button>
      <el-button type="primary" @click="addCate">
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
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      parentCate: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      cascaderSelected: [],
    };
  },
  methods: {
    handleClose() {
      // this.$refs.mainForm.resetFields();
      this.cascaderSelected = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_name = "";
      console.log(this.addCateForm);
      this.$emit("refsh");
    },
    addCate() {
      // console.log(this.addCateForm);
      this.$http.post(`categories`, this.addCateForm).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 201)
          return this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.Visible = false;
      });
    },
    handleCascaderChange() {
      // console.log(this.cascaderSelected);
      if (this.cascaderSelected.length > 0) {
        this.addCateForm.cat_pid = this.cascaderSelected[
          this.cascaderSelected.length - 1
        ];
        this.addCateForm.cat_level = this.cascaderSelected.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
  },
  created() {
    this.$http.get("categories", { params: { type: 2 } }).then((res) => {
      if (res.data.meta.status !== 200)
        return this.$message.error("获取父级分类失败");
      this.parentCate = res.data.data;
      // console.log(this.parentCate);
    });
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
