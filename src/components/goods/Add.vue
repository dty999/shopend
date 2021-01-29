<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="leaveTab"
          @tab-click="handleTabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleCascChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                  :label="item1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item2.attr_name"
              v-for="(item2, index2) in onlyTableData"
              :key="index2"
            >
              <el-input v-model="item2.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headersObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <PreviewDialog ref="previewDialog" :imgSrc="imgUrl" />
    </el-card>
  </div>
</template>

<script>
import PreviewDialog from "./dialog/PreviewDialog";
import _ from "lodash";
export default {
  components: {
    PreviewDialog,
  },
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        children: "children",
        label: "cat_name",
        value: "cat_id",
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 上传图片的地址
      uploadUrl: "http://vueshop.pixiv.download/api/private/v1/upload",
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      imgUrl: "",
    };
  },
  methods: {
    getCateList() {
      this.$http.get("categories").then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取商品分类失败");
        this.cateList = res.data.data;
        // console.log(this.cateList);
        // this.total = res.data.data.total;
        // console.log(this.total);
      });
    },
    handleCascChange() {
      // console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },
    leaveTab(goTab, oldTab) {
      if (oldTab === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请填写商品分类");
        return false;
      }
      return true;
    },
    handleTabClick() {
      if (this.activeIndex === "1") {
        // console.log("动态参数面板");
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "many" },
          })
          .then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error("获取数据失败");
            // console.log(res.data.data);
            res.data.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
            });
            this.manyTableData = res.data.data;
            // console.log(this.manyTableData);
          });
      } else if (this.activeIndex === "2") {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "only" },
          })
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("获取失败");
            }
            const data = res.data.data;
            // console.log(data);
            this.onlyTableData = data;
          });
      }
    },
    handlePreview(file) {
      console.log(file);
      this.$refs.previewDialog.Visible = true;
      this.imgUrl = file.response.data.url;
      console.log(this.imgUrl);
    },
    handleRemove(file) {
      // console.log(file);
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm.pics);
    },
    handleSuccess(resp) {
      this.addForm.pics.push({ pic: resp.data.tmp_path });
      // console.log(this.addForm.pics);
    },
    addGoods() {
      // console.log(this.addForm);
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error("请添加必要的表单项");
        } else {
          // console.log("发起添加请求");
          const form = _.cloneDeep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");

          // console.log(form);
        }
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length !== 3) {
        return null;
      }
      return this.addForm.goods_cat[2];
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 5px 0 0;
}
.btnAdd {
  margin-top: 15px;
}
</style>
