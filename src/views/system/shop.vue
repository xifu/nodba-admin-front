<!-- 店铺管理 -->
<template>
  <div class="erp-content">
    <div class="erp-content-header">
      <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item>
          <el-input
            v-model="searchForm.name"
            clearable
            placeholder="店铺名"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchClick">查询</el-button>
          <el-button type="default" @click="showShopView(true, null)"
            >新增店铺</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="erp-content-body" v-loading="table.loading">
      <vxe-table
        height="100%" :data="dataList"
      >
        <vxe-table-column field="name" title="店铺名" min-width="100">
        </vxe-table-column>

        <vxe-table-column field="markets" title="开通市场" min-width="100">
        </vxe-table-column>

        <vxe-table-column field="salesPlatform" title="销售平台" min-width="80">
        </vxe-table-column>

        <vxe-table-column title="账号类型" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">主账号</span>
            <span v-else>子账号</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="loginName" title="登录名" show-overflow min-width="200">
        </vxe-table-column>

        <vxe-table-column field="sellerName" title="卖家名称" show-overflow min-width="150">
        </vxe-table-column>
        <vxe-table-column title="状态" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success" effect="dark">启用</el-tag>
            <el-tag v-else type="info" effect="dark">禁用</el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="ERP调用账号" min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.erpApiAccount == 1" type="success" effect="dark">是</el-tag>
            <el-tag v-else type="info" effect="dark">否</el-tag>
          </template>
        </vxe-table-column>
        <!-- <vxe-table-column field="description" title="备注" show-overflow min-width="150">
        </vxe-table-column> -->

        <vxe-table-column label="操作" min-width="100" >
          <template slot-scope="scope">
            <el-button type="text" @click="showShopEdit(scope.row)">编辑</el-button>
            <el-dropdown
              class="sw-dropdown"
              >
              <el-button type="text" class="ml10">操作<i class="el-icon-arrow-down"></i></el-button>
              <el-dropdown-menu class="sw-dropdown-menu" slot="dropdown">
                <el-dropdown-item >
                  <el-button type="text" @click="showChangeStatusConfim(scope.row)">
                    <span v-if="scope.row.status === 1">禁用</span>
                    <span v-else>启用</span>
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item >
                  <el-button type="text" @click="showMarketList(scope.row)">店铺市场</el-button>
                </el-dropdown-item>
                <el-dropdown-item >
                  <el-button type="text" @click="showMwsEdit(scope.row)">MWS配置</el-button>
                </el-dropdown-item>
                <el-dropdown-item >
                  <el-button type="text" @click="showShopDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>

    <div class="erp-content-footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.pageNumber"
        :page-sizes="[20, 50, 100, 200]"
        :page-size.sync="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </div>

    <!-- 模态框 -->
     <el-dialog :close-on-click-modal="false"
        :title="shopDialog.title"
        :visible.sync="shopDialog.show"
        center
        width="600px">
      <el-form :model="shopForm" size="small" :rules="shopFormRules" ref="shopForm" label-width="100px">
        <el-form-item label="店铺名" prop="name">
          <el-input v-model="shopForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售平台" prop="realname">
          <el-input v-model="shopForm.salesPlatform" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号类型" prop="type">
          <el-select
            v-model="shopForm.type"
            clearable
            placeholder="请选择账号类型">
            <el-option
              v-for="type in typeList"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="shopForm.loginName" clearable></el-input>
        </el-form-item>
        <el-form-item label="卖家名称" prop="sellerName">
          <el-input v-model="shopForm.sellerName" clearable></el-input>
        </el-form-item>
        <el-form-item label="ERP调用账号" prop="erpApiAccount">
          <el-switch
            v-model="shopForm.erpApiAccount"
            @change="erpApiAccountChange"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" :rows="2" v-model="shopForm.description" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
         <el-button size="small" @click="shopDialogCancelClick">取 消</el-button>
        <el-button size="small" type="primary" @click="shopDialogComfirmClick">确 定</el-button>

      </div>
    </el-dialog>

    <!-- MWS模态框 -->
     <el-dialog :close-on-click-modal="false"
        :title="shopMwsDialog.title"
        :visible.sync="shopMwsDialog.show"
        center
        width="600px">
      <el-form :model="shopForm" size="small" ref="shopMwsForm" style="padding-right:50px" label-width="170px">
        <el-form-item label="开发者账号" prop="mwsDevAccount">
          <el-input v-model="shopForm.mwsDevAccount" clearable></el-input>
        </el-form-item>
        <el-form-item label="卖家ID" prop="mwsSellerId">
          <el-input v-model="shopForm.mwsSellerId" clearable></el-input>
        </el-form-item>
        <el-form-item label="卖家授权码" prop="mwsSellerAuthcode">
          <el-input v-model="shopForm.mwsSellerAuthcode" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号所属国家(MWS端点)" prop="mwsAccountHomeCountry">
          <!-- <el-input v-model="shopForm.mwsAccountHomeCountry" clearable></el-input> -->
          <el-select
            v-model="shopForm.mwsAccountHomeCountry"
            clearable
            placeholder="选择账号所属国家(MWS端点)">
            <el-option
              v-for="mwsCountry in mwsCountryList"
              :key="mwsCountry.key"
              :label="mwsCountry.key"
              :value="mwsCountry.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="secretKey" prop="secretKey">
          <el-input v-model="shopForm.secretKey" clearable></el-input>
        </el-form-item>
        <el-form-item label="awsAccessKeyid" prop="awsAccessKeyid">
          <el-input v-model="shopForm.awsAccessKeyid" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="shopMwsDialogCancelClick">取 消</el-button>
        <el-button size="small" type="primary" @click="shopMwsDialogComfirmClick">确 定</el-button>

      </div>
    </el-dialog>

    <!-- 店铺市场模态框 -->
     <el-dialog :close-on-click-modal="false"
      :title="marketDialog.title"
      :visible.sync="marketDialog.show"
      @close="marketClose"
      center
      width="800px">
      <market-manage  v-if="marketDialog.show" :shopData="currShop"></market-manage>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { searchShop,addShop,updateShop } from "@/api/system/shop"
import marketManage from "./market"

export default {
  name: "storeManage",
  components: {
    marketManage
  },
  data() {
    return {
      currShop: null,
      table: {
        loading: false,
      },
      page: {
        pageNumber: 1,
        pageSize: 20,
        total: 0,
      },
      searchForm: {
        name: null
      },
      shopDialog: {
        isAddOpt: true,
        show: false,
        title: "新增",
      },
      marketDialog: {
        isAddOpt: true,
        show: false,
        title: "新增",
      },
      shopForm: {

      },
      shopFormRules: {
          name: [
            {required: true, message: "请输入店铺名", trigger: "blur"}
          ],
          type: [
            {required: true, message: "请选择账号类型", trigger: "blur"}
          ]
      },
      shopMwsFormRules: {

      },
      shopMwsDialog: {
        isAddOpt: false,
        show: false,
        title: "",
      },
      typeList: [
          {id: 1, name: "主账号"},
          {id: 2, name: "子账号"}
      ],
      dataList: [

      ],
      // mwsCountryList: [
      //   "Brazil",
      //   "Canada",
      //   "Mexico",
      //   "US",
      //   "United Arab Emirates (U.A.E.)",
      //   "Germany",
      //   "Spain",
      //   "France",
      //   "UK",
      //   "India",
      //   "Italy",
      //   "Sweden",
      //   "Turkey",
      //   "Australia",
      //   "Japan",
      //   "China"
      // ],
      mwsCountryList: [
          {
            key: "Brazil",
            value: "https://mws.amazonservices.com"
          },
          {
            key: "Canada",
            value: "https://mws.amazonservices.ca"
          },
          {
            key: "Mexico",
            value: "https://mws.amazonservices.com.mx"
          },
          {
            key: "US",
            value: "https://mws.amazonservices.com"
          },
          {
            key: "United Arab Emirates (U.A.E.)",
            value: "https://mws.amazonservices.ae"
          },
          {
            key: "Germany",
            value: "https://mws-eu.amazonservices.com"
          },
          {
            key: "Spain",
            value: "https://mws-eu.amazonservices.com"
          },
          {
            key: "France",
            value: "https://mws-eu.amazonservices.com"
          },
          {
            key: "UK",
            value: "https://mws-eu.amazonservices.com"
          },
          {
            key: "India",
            value: "https://mws.amazonservices.in"
          },
          {
            key: "Italy",
            value: "https://mws-eu.amazonservices.com"
          },
          {
            key: "Sweden",
            value: "https://mws-eu.amazonservices.com"
          },
          {
            key: "Turkey",
            value: "https://mws-eu.amazonservices.com"
          },
          {
            key: "Australia",
            value: "https://mws.amazonservices.com.au"
          },
          {
            key: "Japan",
            value: "https://mws.amazonservices.jp"
          },
          {
            key: "China",
            value: "https://mws.amazonservices.com.cn"
          }
      ],
    };
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  mounted() {

  },
  created() {
    console.log(this.roles);
    this.doSearch();
  },
  methods: {
    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.page.pageNumber = 1;
      this.doSearch();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.doSearch();
    },

    // 表格选择行触发事件
    handleTableSelectionChange(val) {
      console.log("选择val==>");
      console.log(val);
    },

    // 显示编辑弹窗
    showShopEdit(data) {
      console.log(data);
      this.showShopView(false, data);
    },

    // 显示店铺市场列表弹窗
    showMarketList(data) {
      console.log(data);
      this.currShop = data;
      this.marketDialog.title = "店铺市场【"+ data.name +"】";
      this.marketDialog.show = true;
    },
    marketClose(){
      this.searchClick()
    },

    // 显示MWS配置弹窗
    showMwsEdit(shopData) {
      console.log(shopData);
      let title = "店铺【"+ shopData.name +"】MWS配置";
      console.log(title, shopData);

      this.shopMwsDialog.title = title;
      this.shopMwsDialog.show = true;

      this.shopForm = shopData;
      setTimeout(() => {
           this.$refs["shopMwsForm"].clearValidate();
         }, 5);
    },

    // 店铺状态变更
    showChangeStatusConfim(shopData) {
      let optTitle = shopData.status == 1 ? "禁用" : "启用";
      let title = "确认要"+ optTitle +"【"+ shopData.name +"】吗？";
      let newStatus = shopData.status == 1 ? 0 : 1;
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = JSON.parse(JSON.stringify(shopData));
        params.status = newStatus;
        this.table.loading = true;
        updateShop(params).then(response => {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.searchClick();
        }).catch(error => {

        }).finally(()=>{
          this.table.loading = false;
        })
      }).catch(error => {

      })

    },

    // 显示删除店铺确认弹窗
    showShopDelete(shopData) {
      console.log(shopData);
      let optTitle = "删除";
      let title = "确认要"+ optTitle +"店铺【"+ shopData.name +"】吗？";
      let newDeleted = 1;
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = JSON.parse(JSON.stringify(shopData));
        params.deleted = newDeleted;
        this.table.loading = true;
        updateShop(params).then(response => {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.searchClick();
        }).catch(error => {

        }).finally(()=>{
          this.table.loading = false;
        })
      }).catch(error => {

      })
    },

    erpApiAccountChange(value) {
      console.log("new value==>", value);
      this.shopForm.erpApiAccount = value;
    },

    // 搜索
    searchClick() {
      console.log("searchForm==>", this.searchForm);
      this.page.pageNumber = 1;
      this.doSearch();
    },

    doSearch(){
      this.table.loading = true;
      let param = {
        pageNumber: this.page.pageNumber,
        pageSize: this.page.pageSize,
        name: this.searchForm.name
      }
      this.dataList = [];
      searchShop(param).then(response => {
        console.log("searchShop res==>", response.data);
        this.page.total = response.data.totalRecord;
        this.dataList = response.data.records;
      }).finally(error => {
        this.table.loading = false;
      });

    },

    // 显示新增框
    showShopView(isAddOpt, shop) {
      let title = isAddOpt ? "新增店铺" : "编辑店铺";
      console.log(title, shop);

      this.shopDialog.isAddOpt = isAddOpt;
      this.shopDialog.title = title;
      this.shopDialog.show = true;

      if(shop === null) {
         this.shopForm = {

         }
      } else {
        this.shopForm = shop;
        console.log(this.shopDialog.erpApiAccountValue)
        // this.$set(this.shopDialog,'erpApiAccountValue', erpApiAccountValue);
      }
       setTimeout(() => {
           this.$refs["shopForm"].clearValidate();
         }, 5);
    },

    shopDialogCancelClick() {
        this.shopDialog.show = false;
    },

    shopMwsDialogCancelClick() {
        this.shopMwsDialog.show = false;
    },

    shopDialogComfirmClick() {
        this.$refs["shopForm"].validate((valid) => {
            if(valid) {
                console.log("submit 店铺信息==>", this.shopForm);
                if(this.shopDialog.isAddOpt){
                    // add shop
                    addShop(this.shopForm).then(response => {
                      this.$message({
                        type: "success",
                        message: "添加成功"
                      })
                      this.shopDialog.show = false;
                      this.searchClick();
                    }).finally (error => {

                    })
                } else {
                    // update shop
                    updateShop(this.shopForm).then(response => {
                      this.$message({
                        type: "success",
                        message: "编辑成功"
                      })
                      this.shopDialog.show = false;
                      this.searchClick();
                    }).finally (error => {

                    })
                }
            } else {
                return false;
            }
        });
    },

    shopMwsDialogComfirmClick() {
        this.$refs["shopMwsForm"].validate((valid) => {
            if(valid) {
                let mwsCountry = this.mwsCountryList.find(data => data.key == this.shopForm.mwsAccountHomeCountry);
                if(mwsCountry != null) {
                  this.shopForm.mwsEndPoint = mwsCountry.value;
                } else {
                  this.shopForm.mwsEndPoint = null;
                }
                console.log("submit 店铺信息==>", this.shopForm);

                // update shop
                updateShop(this.shopForm).then(response => {
                    this.$message({
                    type: "success",
                    message: "MWS配置成功"
                    })
                    this.shopMwsDialog.show = false;
                    this.searchClick();
                }).finally (error => {

                })
            } else {
                return false;
            }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
