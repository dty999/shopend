<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table></tree-table>
      <!-- 分页 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      total: 0,
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
    };
  },
  created() {
    this.getCateData();
  },
  methods: {
    getCateData() {
      this.$http
        .get("categories", {
          params: this.querInfo,
        })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("获取商品分类失败");
          this.cateList = res.data.data.result;
          // console.log(this.cateList);
          this.total = res.data.data.total;
          // console.log(this.total);
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
