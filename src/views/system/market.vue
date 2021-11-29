<!-- 店铺市场管理 -->
<template>
  <div>
    <el-button type="default" size="mini" @click="showMarketView(true, null)"
      >新增店铺市场
    </el-button>
    <div class="mt10" v-loading="table.loading">
      <vxe-table max-height="500px" :data="dataList">
        <vxe-table-column field="shopName" title="店铺名"></vxe-table-column>
        <vxe-table-column field="marketPlaces" title="市场"></vxe-table-column>
        <vxe-table-column field="taxRate" title="税率">
          <template slot-scope="{ row }">
            <span v-if="row.taxRate">{{ row.taxRate }}%</span>
            <span v-else>-</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="vat" title="VAT">
          <template slot-scope="{ row }">
            <span v-if="row.vat">{{ row.vat }}</span>
            <span v-else>-</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="status" title="状态">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status == 1"
              size="mini"
              type="success"
              effect="dark"
              >启用
            </el-tag>
            <el-tag v-else type="info" size="mini" effect="dark">禁用</el-tag>
          </template>
        </vxe-table-column>

        <vxe-table-column title="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="showChangeStatusConfim(scope.row)">
              <span v-if="scope.row.status === 1">禁用</span>
              <span v-else>启用</span>
            </el-button>
            <el-button type="text" @click="showMarketEdit(scope.row)"
              >编辑
            </el-button>
            <el-button type="text" @click="showMarketDelete(scope.row)"
              >删除
            </el-button>
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
      :title="marketDialog.title"
      :visible.sync="marketDialog.show"
      center
      append-to-body
      width="500px"
    >
      <el-form
        :model="marketForm"
        size="small"
        :rules="marketFormRules"
        ref="marketForm"
        label-width="80px"
      >
        <el-form-item label="店铺市场" prop="marketPlaces">
          <el-select
            v-model="marketForm.marketPlaces"
            clearable
            placeholder="请选择店铺市场"
          >
            <el-option
              v-for="dict in dictList"
              :key="dict.id"
              :label="dict.dictData"
              :value="dict.dictData"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="税率" prop="taxRate">
          <el-input
            v-model="marketForm.taxRate"
            type="number"
            clearable
            placeholder="税率"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="VAT" prop="vat">
          <el-input v-model="marketForm.vat" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="marketDialogComfirmClick"
          >确 定
        </el-button>
        <el-button size="small" @click="marketDialogCancelClick"
          >取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addMarket, searchMarket, updateMarket } from "@/api/system/shop";
import { searchDict } from "@/api/system/dict";

export default {
  name: "market-manage",
  props: ["shopData"],
  data() {
    return {
      table: {
        loading: false,
      },
      page: {
        pageNumber: 1,
        pageSize: 20,
        total: 0,
      },
      searchForm: {
        name: null,
      },
      marketDialog: {
        isAddOpt: true,
        show: false,
        title: "新增",
      },
      marketForm: {
        shopId: this.shopData.id,
      },
      marketFormRules: {
        marketPlaces: [
          { required: true, message: "请选择店铺市场", trigger: "blur" },
        ],
      },
      dataList: [],
      dictList: [],
    };
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  mounted() {
    this.searchDict("country");
  },
  created() {
    console.log(this.roles);
    console.log("shopData==>", this.shopData);
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

    // 查询数据字典
    searchDict(typeCode) {
      let param = {
        pageNumber: 1,
        pageSize: 9999999,
        typeCode: typeCode,
        status: 1,
      };
      this.dictList = [];
      searchDict(param)
        .then((response) => {
          console.log("searchDict res==>", response.data);
          this.dictList = response.data.records;
        })
        .finally((error) => {});
    },

    // 显示编辑弹窗
    showMarketEdit(data) {
      console.log(data);
      this.showMarketView(false, data);
    },

    // 店铺市场状态变更
    showChangeStatusConfim(marketData) {
      let optTitle = marketData.status == 1 ? "禁用" : "启用";
      let title =
        "确认要" + optTitle + "【" + marketData.marketPlaces + "】吗？";
      let newStatus = marketData.status == 1 ? 0 : 1;
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = JSON.parse(JSON.stringify(marketData));
          params.status = newStatus;
          this.table.loading = true;
          updateMarket(params)
            .then((response) => {
              this.$message({
                type: "success",
                message: "操作成功",
              });
              this.searchClick();
            })
            .catch((error) => {})
            .finally(() => {
              this.table.loading = false;
            });
        })
        .catch((error) => {});
    },

    // 显示删除店铺确认弹窗
    showMarketDelete(marketData) {
      console.log(marketData);
      let optTitle = "删除";
      let title =
        "确认要" + optTitle + "店铺市场【" + marketData.marketPlaces + "】吗？";
      let newDeleted = 1;
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = JSON.parse(JSON.stringify(marketData));
          params.deleted = newDeleted;
          this.table.loading = true;
          updateMarket(params)
            .then((response) => {
              this.$message({
                type: "success",
                message: "操作成功",
              });
              this.searchClick();
            })
            .catch((error) => {})
            .finally(() => {
              this.table.loading = false;
            });
        })
        .catch((error) => {});
    },

    // 搜索
    searchClick() {
      console.log("searchForm==>", this.searchForm);
      this.page.pageNumber = 1;
      this.doSearch();
    },

    doSearch() {
      this.table.loading = true;
      let param = {
        pageNumber: this.page.pageNumber,
        pageSize: this.page.pageSize,
        shopId: this.shopData.id,
      };
      this.dataList = [];
      searchMarket(param)
        .then((response) => {
          console.log("searchMarket res==>", response.data);
          this.page.total = response.data.totalRecord;
          this.dataList = response.data.records;
        })
        .finally((error) => {
          this.table.loading = false;
        });
    },

    // 显示新增框
    showMarketView(isAddOpt, market) {
      let title = isAddOpt
        ? "新增店铺市场"
        : "店铺市场【" + market.marketPlaces + "】编辑";
      console.log(title, market);

      this.marketDialog.isAddOpt = isAddOpt;
      this.marketDialog.title = title;
      this.marketDialog.show = true;

      if (market === null) {
        this.marketForm = {
          shopId: this.shopData.id,
        };
      } else {
        this.marketForm = market;
      }
      setTimeout(() => {
        this.$refs["marketForm"].clearValidate();
      }, 5);
    },

    marketDialogCancelClick() {
      this.marketDialog.show = false;
    },

    marketDialogComfirmClick() {
      this.$refs["marketForm"].validate((valid) => {
        if (valid) {
          console.log("submit 店铺市场信息==>", this.marketForm);
          if (this.marketDialog.isAddOpt) {
            // add market
            addMarket(this.marketForm)
              .then((response) => {
                this.$message({
                  type: "success",
                  message: "添加成功",
                });
                this.marketDialog.show = false;
                this.searchClick();
              })
              .finally((error) => {});
          } else {
            // update market
            updateMarket(this.marketForm)
              .then((response) => {
                this.$message({
                  type: "success",
                  message: "编辑成功",
                });
                this.marketDialog.show = false;
                this.searchClick();
              })
              .finally((error) => {});
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
