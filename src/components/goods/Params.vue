<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意:只允许为三级分类设置参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!--  -->
          <el-cascader
            v-model="selectedCascKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleCascChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisableBtn"
            >添加参数</el-button
          >
          <!-- 参数表格区 -->
          <el-table :data="manyTable" style="width: 100%">
            <el-table-column type="expand"> </el-table-column>

            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="isDisableBtn"
            >添加属性</el-button
          >
          <!-- 参数表格区 -->
          <el-table :data="onlyTable" style="width: 100%">
            <el-table-column type="expand"> </el-table-column>

            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedCascKeys: [],
      activeName: "many",
      manyTable: [],
      onlyTable: [],
    };
  },
  computed: {
    // 直接当做普通属性调用不加括号
    // 任何data中数据变化立即重新计算
    // 计算属性会缓存
    isDisableBtn() {
      if (this.selectedCascKeys.length != 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectedCascKeys.length === 3) {
        return this.selectedCascKeys[2];
      }
      return null;
    },
  },
  created() {
    this.getCateList();
  },
  methods: {
    handleTabsClick() {
      console.log(this.activeName);
      this.getParams();
    },
    getCateList() {
      this.$http.get("categories").then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取商品分类失败");
        this.cateList = res.data.data;
        // console.log(this.cateList);
      });
    },
    handleCascChange() {
      // 级联选择框选择变化触发
      if (this.selectedCascKeys.length < 3) {
        this.selectedCascKeys = [];
        return;
      }
      // console.log(this.selectedCascKeys);
      this.getParams();
    },
    getParams() {
      this.$http
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName },
        })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("获取参数列表失败");
          console.log(res.data.data);
          if (this.activeName === "many") {
            this.manyTable = res.data.data;
          } else {
            this.onlyTable = res.data.data;
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
