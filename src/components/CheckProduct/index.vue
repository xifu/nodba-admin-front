<!-- 选择产品 -->
<template>
  <div class="erp-content" style="padding:10px 20px 0">
      <el-tabs
      class="erp-page-tabs"
      @tab-click="handleClick"
      v-model="activeName"
    >
      <el-tab-pane label="常规产品" name="1">
        <el-row v-if="activeName=='1'" class="sw-menu-row erp-content-body">
          <el-col :span="12" class="erp-content"  style="padding:0 20px 0 0">
            <div class="erp-content-header">
              <el-form :inline="true" size="small">
                <el-form-item label="主产品">
                  <el-input
                    placeholder="输入主产品名称搜索"
                    v-model="productSearchForm.name"
                    clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchProduct()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 主体表格 -->
            <div class="erp-content-body">
              <vxe-table
                ref="productTable"
                height="100%"
                :data="productList"
                highlight-current-row
                @current-change="getCheckedProduct"
               >
                <vxe-table-column field="img" title="产品图片" width="70">
                  <template slot-scope="{row}">
                    <sw-cover :src="row.img"></sw-cover>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="name"
                  title="产品名称/SPU"
                  min-width="240"
                >
                  <template slot-scope="{row}">
                    <sw-title :title="row.name">
                      <p class="color-gray">{{row.code ? row.code :'-' }}</p>
                    </sw-title>
                  </template>
                </vxe-table-column>
              </vxe-table>
            </div>

            <!-- 分页 -->
            <div class="erp-content-footer">
              <el-pagination
                @size-change="productHandleSizeChange"
                @current-change="productHandleCurrentPageChange"
                :current-page.sync="productSearchForm.pageNumber"
                :page-size.sync="productSearchForm.pageSize"
                layout="total, prev, next"
                :total="productTotal"
              >
              </el-pagination>
            </div>
          </el-col>
          <el-col :span="12" class="erp-content" style="padding:0" v-loading="subTableLoading">
            <div class="erp-content-header">
              <el-form :inline="true" size="small">
                <el-form-item label="子产品">
                  <el-input
                    placeholder="输入子产品名称搜索"
                    v-model="subSearchForm.name"
                    clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchSubProduct()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 主体表格 -->
            <div class="erp-content-body">
              <vxe-table
                ref="subProductTable"
                height="100%"
                :data="subProductList"
                :radio-config="{ trigger: 'row'}"
                @radio-change="getCheckedSubProduct">
                <vxe-table-column type="radio" title="选择" width="50"></vxe-table-column>
                <vxe-table-column field="img" title="产品图片" width="70">
                  <template slot-scope="{row}">
                    <sw-cover :src="row.img"></sw-cover>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="name"
                  title="产品名称/SKU"
                  min-width="240"
                >
                  <template slot-scope="{row}">
                    <sw-title :title="row.name">
                      <p class="color-gray">{{row.code ? row.code :'-' }}</p>
                    </sw-title>
                  </template>
                </vxe-table-column>
                <!-- <vxe-table-column
                  field="colorName"
                  title="颜色"
                  min-width="100"
                  show-overflow
                ></vxe-table-column>
                <vxe-table-column
                  field="sizeName"
                  title="尺寸"
                  min-width="100"
                  show-overflow
                ></vxe-table-column> -->
              </vxe-table>
            </div>

            <!-- 分页 -->
            <div class="erp-content-footer">
              <el-pagination
                @size-change="subHandleSizeChange"
                @current-change="subHandleCurrentPageChange"
                :current-page.sync="subSearchForm.pageNumber"
                :page-size.sync="subSearchForm.pageSize"
                layout="total, prev, next"
                :total="subProductTotal"
              >
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="组合产品" name="2">
        <div class="erp-content" v-if="activeName=='2'" style="padding:0"   v-loading="gropuTableLoading">
            <div class="erp-content-header">
              <el-form :inline="true" size="small">
                <el-form-item>
                  <el-input
                    placeholder="输入组合产品名称搜索"
                    v-model="groupSearchForm.name"
                    clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchGroupProduct()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 主体表格 -->
            <div class="erp-content-body">
              <vxe-table
                ref="groupProductTable"
                height="100%"
                :data="groupProductList"
                :radio-config="{ trigger: 'row'}"
                @radio-change="getCheckedGroupProduct">
                <vxe-table-column type="radio" title="选择" width="50"></vxe-table-column>
                <vxe-table-column field="img" title="产品图片" min-width="70">
                  <template slot-scope="{row}">
                    <sw-cover :src="row.img"></sw-cover>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="name"
                  title="产品名称/SKU"
                  min-width="300"
                >
                  <template slot-scope="{row}">
                    <sw-title :title="row.name">
                      <p class="color-gray">{{row.code ? row.code :'-' }}</p>
                    </sw-title>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="specs"
                  title="规格"
                  min-width="100"
                  show-overflow
                ></vxe-table-column>
              </vxe-table>
            </div>

            <!-- 分页 -->
            <div class="erp-content-footer">
              <el-pagination
                @size-change="groupHandleSizeChange"
                @current-change="groupHandleCurrentPageChange"
                :current-page.sync="subSearchForm.pageNumber"
                :page-sizes="[20, 50, 100, 200]"
                :page-size.sync="groupSearchForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="groupProductTotal"
              >
              </el-pagination>
            </div>
          </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {searchCommProduct, searchCommSubProduct} from "@/api/product/product"
import SwCover from "@/components/SwCover";
import SwTitle from "@/components/SwTitle";
export default {
  name: "checkProduct",
  components: {
    SwCover,
    SwTitle
  },
  data() {
    return {
      activeName: "1",
      filterProductName:'',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 主要产品查询条件
      productSearchForm: {
        name: "",
        type:"1",
        pageNumber: 1,
        pageSize:10,
      },
      productListLoading:false,
      productList:[],
      productTotal:0,

      // 子产品查询条件
      subSearchForm: {
        productId:'',
        name: "",
        pageNumber: 1,
        pageSize: 20,
      },
      subTableLoading:false,
      subProductList:[],
      subProductTotal:0,

       // 组合产品查询条件
      groupSearchForm: {
        name: "",
        pageNumber: 1,
        pageSize: 20,
      },
      gropuTableLoading:false,
      groupProductList:[],
      groupProductTotal:0,

      // 选中的产品
      checkedProduct:"",
      checkedSubProduct:"",
      checkedGroupProduct:"",
    };
  },
  created() {
    this.getProductList()
    this.getGroupProductList()
  },
  mounted() {
    console.log("选择产品")

  },
  // watch: {
  //   filterProductName(val) {
  //     this.$refs.productTree.filter(val);
  //   }
  // },
  methods: {
    //tabs切换
    handleClick(tab, event) {
      console.log(this.activeName)
    },

    // 获取常规主产品列表
    getProductList(){
      const params = this.productSearchForm
      this.productListLoading = true
      searchCommProduct(params).then(res => {
        this.productListLoading = false
        this.productList = res.data.records;
        this.productTotal = res.data.totalRecord;
        console.log("this.productList",this.productList)
        if(this.productList.length>0){
          this.subSearchForm.productId = this.productList[0].id
          this.getSubProductList()

            if(this.$refs.productTable){
              this.$refs.productTable.setCurrentRow(this.productList[0])
              let obj = {
                row:this.productList[0]
              }
              this.getCheckedProduct(obj)
            }

        }
      }).catch(err => {
        this.productListLoading = false
        this.$message.error(err)
      })
    },
    // 搜索主产品
    searchProduct(){
      this.productSearchForm.pageNumber = 1;
      this.getProductList();
    },
     //主产品分页
    productHandleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.productSearchForm.pageSize = val;
      this.productSearchForm.pageNumber = 1;
      this.getProductList();
    },
    productHandleCurrentPageChange(val) {
      console.log(`当前页: ${val}`,this.productSearchForm);
      this.getProductList();
    },


    // 获取子产品列表
    getSubProductList() {
      const params = this.subSearchForm
      this.subTableLoading = true
      searchCommSubProduct(params).then(res => {
        this.subProductList = res.data.records;
        this.subProductTotal = res.data.totalRecord;
        console.log("this.subProductList",this.subProductList)
      }).catch(err => {

      }).finally(err => {
        this.subTableLoading = false
      })
    },

    // 搜索子产品
    searchSubProduct(){
      this.subSearchForm.pageNumber = 1;
      this.getSubProductList();
    },
     //子产品分页
    subHandleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.subSearchForm.pageSize = val;
      this.subSearchForm.pageNumber = 1;
      this.getSubProductList();
    },
    subHandleCurrentPageChange(val) {
      console.log(`当前页: ${val}`,this.subSearchForm);
      this.getSubProductList();
    },

    // 获取组合产品列表
    getGroupProductList() {
      let params = {
        type: "2",
        name: this.groupSearchForm.name,
        pageNumber: this.groupSearchForm.pageNumber,
        pageSize: this.groupSearchForm.pageSize
      }
      this.gropuTableLoading = true
      searchCommProduct(params).then(res => {
        this.groupProductList = res.data.records;
        this.groupProductTotal = res.data.totalRecord;
        this.gropuTableLoading = false
      }).catch(err => {
        this.gropuTableLoading = false
      })
    },
    // 搜索组合产品
    searchGroupProduct(){
      this.groupSearchForm.pageNumber = 1;
      this.getGroupProductList();
    },
    //组合产品分页
    groupHandleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.groupSearchForm.pageSize = val;
      this.groupSearchForm.pageNumber = 1;
      this.getGroupProductList();
    },
    groupHandleCurrentPageChange(val) {
      console.log(`当前页: ${val}`,this.groupSearchForm);
      this.getGroupProductList();
    },

    // 选中主产品
    getCheckedProduct({ row }) {
      this.checkedProduct = row
      this.checkedProduct.spu = this.checkedProduct.code
      this.checkedProduct.spuId = this.checkedProduct.id
      this.checkedProduct.sku = this.checkedProduct.code
      this.checkedProduct.skuId = this.checkedProduct.id
      this.checkedProduct.checkedType = "1" //1-主产品，2-子产品，3-组合产品
      console.log('选中主产品',this.checkedProduct)
      this.$emit('checkProduct',this.checkedProduct)
      this.subSearchForm.productId = row.id
      this.searchSubProduct();
    },

    // 选中子产品
    getCheckedSubProduct({row}){
      this.checkedSubProduct = row
      this.checkedSubProduct.spu = this.checkedProduct.code
      this.checkedSubProduct.spuId = this.checkedProduct.id
      this.checkedSubProduct.sku = this.checkedSubProduct.code
      this.checkedSubProduct.skuId = this.checkedSubProduct.id
      this.checkedSubProduct.checkedType = "2" //1-主产品，2-子产品，3-组合产品
      console.log('选中子产品',this.checkedSubProduct)
      this.$emit('checkProduct',this.checkedSubProduct)
    },

    // 选中组合产品
    getCheckedGroupProduct({row}){
      this.checkedGroupProduct = row
      this.checkedGroupProduct.spu = this.checkedGroupProduct.code
      this.checkedGroupProduct.spuId = this.checkedGroupProduct.id
      this.checkedGroupProduct.sku = this.checkedGroupProduct.code
      this.checkedGroupProduct.skuId = this.checkedGroupProduct.id
      this.checkedGroupProduct.checkedType = "3" //1-主产品，2-子产品，3-组合产品
      console.log('选中组合产品',this.checkedGroupProduct)
      this.$emit('checkProduct',this.checkedGroupProduct)
    },

    //传出选中产品信
    emitCheckedProduct (data) {
      console.log("emitCheckedProduct",data)
      this.$emit('checkProduct',data)
    },


  },
};
</script>

<style lang="scss" scoped>
  .sw-menu-row{
    .el-col{
        height: 100%;
    }
  }
  .sw-product-tree{
    ::v-deep .el-tree-node{
      white-space: pre-wrap;

      .el-tree-node__expand-icon.is-leaf{
        display: none;
      }
      .el-tree-node__content{
        height: auto;
         padding:5px !important;
      }
      .el-tree-node__label{
        color: #000;
      }
    }
  }
</style>
