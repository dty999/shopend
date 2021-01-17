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
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisableBtn"
            @click="handleAddParamsClick"
            >添加参数</el-button
          >
          <!-- 参数表格区 -->
          <el-table :data="manyTable" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                >
                  {{ item }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editClick(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteClick(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisableBtn"
            @click="handleAddParamsClick"
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
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editClick(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteClick(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <ParamsDialog ref="paramsDialog" @success="getParams"></ParamsDialog>
    </el-card>
  </div>
</template>

<script>
import ParamsDialog from "./dialog/ParamsDialog";
export default {
  components: {
    ParamsDialog,
  },
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
    editClick(row) {},
    deleteClick(row) {},
    handleAddParamsClick() {
      this.$refs.paramsDialog.Visible = true;
      this.$refs.paramsDialog.cateId = this.selectedCascKeys[2];
      if (this.activeName === "many") {
        this.$refs.paramsDialog.title = "添加动态参数";
        this.$refs.paramsDialog.sel = "many";
        this.$refs.paramsDialog.labelText = "动态参数:";
      } else {
        this.$refs.paramsDialog.title = "添加静态属性";
        this.$refs.paramsDialog.sel = "only";
        this.$refs.paramsDialog.labelText = "静态属性";
      }
    },
    handleTabsClick() {
      // console.log(this.activeName);

      if (this.selectedCascKeys.length < 3) {
        this.selectedCascKeys = [];
        this.manyTable = [];
        this.onlyTable = [];
        return;
      }
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
        this.manyTable = [];
        this.onlyTable = [];
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
          res.data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
          });
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
.el-tag {
  margin: 5px 5px;
}
</style>
