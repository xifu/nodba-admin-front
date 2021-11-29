<!-- 数据字典管理 -->
<template>
  <div class="erp-content">
    <div class="erp-content-header">
      <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item>
          <el-select
            v-model="searchForm.typeId"
            clearable
            placeholder="选择类型"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="dictType in dictTypeList"
              :key="dictType.id"
              :label="dictType.name"
              :value="dictType.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="searchForm.name"
            clearable
            placeholder="配置名称"
          />
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="选择状态"
          >
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="searchForm.code"
            clearable
            placeholder="配置代码"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchClick">查询</el-button>
          <el-button type="default" @click="cleanClick">重置</el-button>
          <el-button type="default" @click="showDictView(true, null)"
            >新增配置
          </el-button>
          <el-button type="default" @click="showTypeAddView()"
            >新增类型
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="erp-content-body" v-loading="table.loading">
      <vxe-table height="100%" :data="dataList">
        <vxe-table-column field="typeName" title="配置类型" min-width="80">
        </vxe-table-column>

        <vxe-table-column
          field="typeCode"
          title="类型代码"
          show-overflow
          min-width="120"
        >
        </vxe-table-column>

        <vxe-table-column
          field="code"
          title="配置代码"
          show-overflow
          min-width="160"
        >
        </vxe-table-column>

        <vxe-table-column
          field="name"
          title="配置名称"
          show-overflow
          min-width="120"
        >
        </vxe-table-column>

        <vxe-table-column title="状态" min-width="80">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status == 1"
              type="success"
              size="mini"
              effect="dark"
              >启用
            </el-tag>
            <el-tag v-else type="info" size="mini" effect="dark">禁用</el-tag>
          </template>
        </vxe-table-column>

        <vxe-table-column
          field="description"
          title="备注信息"
          show-overflow
          min-width="160"
        >
        </vxe-table-column>

        <vxe-table-column title="操作" min-width="90">
          <template slot-scope="scope">
            <el-button type="text" @click="showChangeStatusConfim(scope.row)">
              <span v-if="scope.row.status === 1">禁用</span>
              <span v-else>启用</span>
            </el-button>
            <el-button type="text" @click="showDictEdit(scope.row)"
              >编辑
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

    <!-- 新增、编辑配置 模态框 -->
     <el-dialog :close-on-click-modal="false"
      :title="dictDialog.title"
      :visible.sync="dictDialog.show"
      center
      width="500px"
    >
      <el-form
        :model="dictForm"
        size="small"
        :rules="dictFormRules"
        ref="dictForm"
        label-width="80px"
      >
        <el-form-item label="配置类型" prop="typeId">
          <el-select
            v-model="dictForm.typeId"
            clearable
            @change="dictDialogTypeChange"
            placeholder="选择配置类型"
          >
            <el-option
              v-for="dictType in dictTypeList"
              :key="dictType.id"
              :label="dictType.name"
              :value="dictType.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="dictForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="配置代码" prop="code">
          <el-input v-model="dictForm.code" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="dictForm.orderNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="data" prop="dictData">
          <el-input v-model="dictForm.dictData" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            v-model="dictForm.description"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dictDialogCancelClick">取 消</el-button>
        <el-button size="small" type="primary" @click="dictDialogComfirmClick"
          >确 定
        </el-button>

      </div>
    </el-dialog>

    <!-- 新增类型模态框 -->
     <el-dialog :close-on-click-modal="false"
      :title="dictTypeDialog.title"
      :visible.sync="dictTypeDialog.show"
      center
      width="500px"
    >
      <el-form
        :model="dictTypeForm"
        size="small"
        :rules="dictTypeFormRules"
        ref="dictTypeForm"
        label-width="80px"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="dictTypeForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型代码" prop="code">
          <el-input v-model="dictTypeForm.code" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="dictTypeForm.orderNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            v-model="dictTypeForm.description"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          @click="dictTypeDialogComfirmClick"
          >确 定
        </el-button>
        <el-button size="small" @click="dictTypeDialogCancelClick"
          >取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  addDict,
  addDictType,
  changeDictStatus,
  searchDict,
  searchDictType,
  updateDict,
} from "@/api/system/dict";

export default {
  name: "dictionaryManage",
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
        typeId: null,
        name: null,
        status: null,
        code: null,
      },
      dictDialog: {
        isAddOpt: true,
        show: false,
        title: "新增",
      },
      dictForm: {
        typeId: null,
      },
      dictFormRules: {
        typeId: [
          { required: true, message: "请选配置类型", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入配置名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入配置代码", trigger: "blur" }],
        orderNum: [{ required: true, message: "请输入排序", trigger: "blur" }],
        dictData: [
          { required: true, message: "请输入配置data", trigger: "blur" },
        ],
      },
      dictTypeList: [],

      dictTypeDialog: {
        isAddOpt: true,
        show: false,
        title: "新增",
      },
      dictTypeForm: {},
      dictTypeFormRules: {
        name: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入类型代码", trigger: "blur" }],
        orderNum: [{ required: true, message: "请输入排序", trigger: "blur" }],
      },

      dataList: [],
    };
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  mounted() {
    this.searchAllDictTypes();
  },
  created() {
    console.log(this.roles);
    this.doSearch();
  },
  methods: {
    cleanClick(){
      this.searchForm={
        typeId: null,
        name: null,
        status: null,
        code: null,
      }
      this.page.pageNumber=1
      this.doSearch();
    },
    /** 通用方法=====>>> */
    indexMethod(index) {
      let rs = (this.page.pageNumber - 1) * this.page.pageSize + 1;
      return rs + index;
    },
    iRowStyle: function ({ row, rowIndex }) {
      let hStyle = {
        height: "50px",
      };
      return hStyle;
    },
    iHeaderRowStyle: function ({ row, rowIndex }) {
      let hStyle = {
        height: "50px",
      };
      return hStyle;
    },
    iCellStyle: function ({ row, column, rowIndex, columnIndex }) {
      let hStyle = {
        padding: "0px",
      };
      return hStyle;
    },
    iHeaderCellStyle: function ({ row, column, rowIndex, columnIndex }) {
      let hStyle = {
        padding: "0px",
        "background-color": "#f9f9f9 !important",
      };
      return hStyle;
    },
    /** 通用方法<<<===== */

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
    showDictEdit(data) {
      console.log(data);
      this.showDictView(false, data);
    },

    // 字典状态变更
    showChangeStatusConfim(dictData) {
      let optTitle = dictData.status == 1 ? "禁用" : "启用";
      let title = "确认要" + optTitle + "该配置吗？";
      let newStatus = dictData.status == 1 ? 0 : 1;
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: dictData.id,
            status: newStatus,
          };
          this.table.loading = true;
          changeDictStatus(params)
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

    // 显示删除配置确认弹窗
    showDictDelete(data) {
      console.log(data);
    },

    dictDialogTypeChange() {
      // this.$forceUpdate();
    },

    // 查询所有配置类型
    searchAllDictTypes() {
      let param = {
        pageNumber: 1,
        pageSize: 1000000,
        status: 1,
      };
      searchDictType(param).then((response) => {
        console.log("searchAllDictTypes res==>", response.data);
        this.dictTypeList = response.data.records;
      });
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
        typeId: this.searchForm.typeId,
        name: this.searchForm.name,
        status: this.searchForm.status,
        code: this.searchForm.code,
      };
      this.dataList = [];
      searchDict(param)
        .then((response) => {
          console.log("searchDict res==>", response.data);
          this.page.total = response.data.totalRecord;
          this.dataList = response.data.records;
        })
        .finally((error) => {
          this.table.loading = false;
        });
    },

    // 显示新增框
    showDictView(isAddOpt, dict) {
      let title = isAddOpt ? "新增配置信息" : "编辑配置信息";
      console.log(title, dict);

      this.dictDialog.isAddOpt = isAddOpt;
      this.dictDialog.title = title;
      this.dictDialog.show = true;

      if (dict === null) {
        this.dictForm = {
          typeId: null,
        };
      } else {
        this.dictForm = dict;
      }
      setTimeout(() => {
        this.$refs["dictForm"].clearValidate();
      }, 5);
    },

    // 显示新增字典类型框
    showTypeAddView() {
      let title = "新增类型信息";

      this.dictTypeDialog.isAddOpt = true;
      this.dictTypeDialog.title = title;
      this.dictTypeDialog.show = true;

      this.dictTypeForm = {};
      setTimeout(() => {
        this.$refs["dictTypeForm"].clearValidate();
      }, 5);
    },

    dictTypeDialogCancelClick() {
      this.dictTypeDialog.show = false;
    },
    dictTypeDialogComfirmClick() {
      this.$refs["dictTypeForm"].validate((valid) => {
        if (valid) {
          console.log("submit 字典类型==>", this.dictTypeForm);
          if (this.dictTypeDialog.isAddOpt) {
            // add dictType
            addDictType(this.dictTypeForm)
              .then((response) => {
                this.$message({
                  type: "success",
                  message: "添加成功",
                });
                this.dictTypeDialog.show = false;
                this.searchAllDictTypes();
              })
              .finally((error) => {});
          } else {
            // update dictType
          }
        } else {
          return false;
        }
      });
    },

    dictDialogCancelClick() {
      this.dictDialog.show = false;
    },

    dictDialogComfirmClick() {
      this.$refs["dictForm"].validate((valid) => {
        if (valid) {
          console.log("submit 字典信息==>", this.dictForm);
          if (this.dictDialog.isAddOpt) {
            // add dict
            addDict(this.dictForm)
              .then((response) => {
                this.$message({
                  type: "success",
                  message: "添加成功",
                });
                this.dictDialog.show = false;
                this.searchClick();
              })
              .finally((error) => {});
          } else {
            // update dict
            updateDict(this.dictForm)
              .then((response) => {
                this.$message({
                  type: "success",
                  message: "编辑成功",
                });
                this.dictDialog.show = false;
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
