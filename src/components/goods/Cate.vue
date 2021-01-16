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
          <el-button type="primary" @click="handleAddGoodsCate"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color:green;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag
          ><el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          ><el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 50]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <AddGoodsCate ref="addGoodsCate" @refsh= "this.getCateData"></AddGoodsCate>
    </el-card>
  </div>
</template>

<script>
import AddGoodsCate from "../common/dialog/AddGoodsCate";
export default {
  components: {
    AddGoodsCate,
  },
  data() {
    return {
      // 表格相关
      cateList: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          // 定义模板列
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      // 分页相关
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
    // 添加商品分类
    handleAddGoodsCate() {
      this.$http.get("categories", { params: { type: 2 } }).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取父级分类失败");
        this.$refs.addGoodsCate.parentCate = res.data.data;
        // console.log(this.$refs.addGoodsCate.parentCate);
        this.$refs.addGoodsCate.Visible = true;
      });
    },
    // 监听pageSize
    handleSizeChange(newPageSize) {
      this.querInfo.pagesize = newPageSize;
      this.getCateData();
    },
    handleCurrentChange(newPageNum) {
      this.querInfo.pagenum = newPageNum;
      this.getCateData();
    },
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
    handleEdit(row) {},
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
