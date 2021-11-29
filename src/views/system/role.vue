<!-- 角色管理 -->
<template>
  <div class="erp-content">
    <div class="erp-content-header">
      <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item>
          <el-input
            v-model="searchForm.name"
            clearable
            placeholder="角色名称"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchClick">查询</el-button>
          <el-button type="default" @click="showRoleView(true, null)"
            >新增角色</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="erp-content-body" v-loading="table.loading">
      <vxe-table
        height="100%" :data="dataList"
      >
        <vxe-table-column field="name" title="角色名称" show-overflow min-width="200">
        </vxe-table-column>
        <vxe-table-column title="创建时间" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate('yyyy-MM-dd') }}</span>
          </template>
        </vxe-table-column>

         <vxe-table-column title="状态" min-width="90">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success" effect="dark">启用</el-tag>
            <el-tag v-else type="info" effect="dark">禁用</el-tag>
          </template>
        </vxe-table-column>

        <vxe-table-column title="操作" min-width="90" >
          <template slot-scope="scope">
            <el-button type="text" @click="showRoleEdit(scope.row)">编辑</el-button>
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
                  <el-button type="text" @click="showPermissionEdit(scope.row)">权限</el-button>
                </el-dropdown-item>
                <el-dropdown-item >
                  <el-button type="text" @click="showDeleteConfim(scope.row)">删除</el-button>
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
        :title="roleDialog.title"
        :visible.sync="roleDialog.show"
        center
        width="450px">
      <el-form :model="roleForm" size="small" :rules="roleFormRules" ref="roleForm" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="roleDialogCancelClick">取 消</el-button>
        <el-button size="small" type="primary" @click="roleDialogComfirmClick">确 定</el-button>

      </div>
    </el-dialog>

     <el-dialog :close-on-click-modal="false"
      :title="roleMenuDialog.title"
      :visible.sync="roleMenuDialog.show"
      width="450px"
      >
      <div style="max-height:380px;overflow-y:scroll">
        <el-tree
            ref="menuTree"
            :data="menuTreeData"
            show-checkbox
            node-key="id"
            :default-checked-keys.sync="currRoleMenuIds"
            :default-expanded-keys="expandedMenuIds"
            :props="menuTreeProps"
            @check-change="menuTrueChangeHandler">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button size="small" @click="roleMenuDialogCancelClick">取 消</el-button>
        <el-button size="small" type="primary" @click="roleMenuDialogComfirmClick">确 定</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { searchRole,addRole,updateRole,changeStatus,roleBindMenus,deleteRole } from "@/api/system/role"
import { allMenus } from "@/api/system/menu"

export default {
  name: "roleManage",
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
      roleDialog: {
        isAddOpt: true,
        show: false,
        title: "新增",
      },
      roleForm: {
        roleIds: []
      },
      roleFormRules: {
          name: [
            {required: true, message: "请输入角色名称", trigger: "blur"}
          ],
      },
      dataList: [

      ],

      roleMenuDialog: {
        show: false,
        title: "配置权限"
      },

      currRole: {},

      menuTreeData: [],
      checkedMenus: [],
      checkedMenuIds: [],
      currRoleMenuIds: [],
      expandedMenuIds: [],
      menuTreeProps: {
          children: 'children',
          label: "name"
      },
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
    this.featchMenus();
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
    showRoleEdit(data) {
      console.log(data);
      this.showRoleView(false, data);
    },

    showPermissionEdit(data) {
      this.showRoleMenuView(data);
    },

    // 用户状态变更
    showChangeStatusConfim(roleData) {
      let optTitle = roleData.status == 1 ? "禁用" : "启用";
      let title = "确认要"+ optTitle +"角色【"+ roleData.name +"】吗？";
      let newStatus = roleData.status == 1 ? 0 : 1;
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          id: roleData.id,
          status: newStatus
        }
        this.table.loading = true;
        changeStatus(params).then(response => {
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

    // 显示删除用户确认弹窗
    showDeleteConfim(roleData) {
      let title = "确认要删除" +"角色【"+ roleData.name +"】吗？";
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          id: roleData.id
        }
        this.table.loading = true;
        deleteRole(params).then(response => {
          if(response.code == 701) {
            this.$alert(response.message, "信息", {
                confirmButtonText: "确定",
                callback: action => {

                }
            });
          } else {
            this.$message({
                type: "success",
                message: "操作成功"
            })
            this.searchClick();
          }
        }).catch(error => {

        }).finally(()=>{
          this.table.loading = false;
        })
      }).catch(error => {

      })
    },

    roleDialogRoleChange() {
      // this.$forceUpdate();
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
      searchRole(param).then(response => {
        console.log("searchRole res==>", response.data);
        this.page.total = response.data.totalRecord;
        this.dataList = response.data.records;
      }).finally(error => {
        this.table.loading = false;
      });

    },

    // 显示新增框
    showRoleView(isAddOpt, role) {
      let title = isAddOpt ? "新增角色" : "编辑角色";
      console.log(title, role);

      this.roleDialog.isAddOpt = isAddOpt;
      this.roleDialog.title = title;
      this.roleDialog.show = true;

      if(role === null) {
         this.roleForm = {

         }
      } else {
        this.roleForm = role;
      }
      setTimeout(() => {
          this.$refs["roleForm"].clearValidate();
        }, 5);
    },

    roleDialogCancelClick() {
        this.roleDialog.show = false;
    },

    roleDialogComfirmClick() {
        this.$refs["roleForm"].validate((valid) => {
            if(valid) {
                console.log("submit 用户信息==>", this.roleForm);
                if(this.roleDialog.isAddOpt){
                    // add role
                    addRole(this.roleForm).then(response => {
                      this.$message({
                        type: "success",
                        message: "添加成功"
                      })
                      this.roleDialog.show = false;
                      this.searchClick();
                    }).finally (error => {

                    })
                } else {
                    // update role
                    updateRole(this.roleForm).then(response => {
                      this.$message({
                        type: "success",
                        message: "编辑成功"
                      })
                      this.roleDialog.show = false;
                      this.searchClick();
                    }).finally (error => {

                    })
                }
            } else {
                return false;
            }
        });
    },


    featchMenus() {
        allMenus().then(res => {
          if (res.code != 200) {
                console.log(res.data);
                this.$message({message:"查询权限失败!【"+ res.message +"】",type:"success"});
                return;
            }
            this.menuTreeData = res.data.menus;
            this.currMenu = this.menuTreeData[0];
            this.rootMenuIds(this.menuTreeData);
        }).catch(error => {
            console.log(error);
            this.$message.error("获取权限列表失败");
        })
    },
    rootMenuIds(menuTreeData){
        if(!menuTreeData || menuTreeData.length == 0) {
          return
        };
        menuTreeData.forEach(node => {
            this.expandedMenuIds.push(node.id);
        });
    },

    // 显示权限配置框
    showRoleMenuView(role) {
      let title = "【"+ role.name +"】权限配置";
      console.log(title, role);

      this.roleMenuDialog.title = title;
      this.roleMenuDialog.show = true;

      this.currentRoleChange(role);
    },

    roleMenuDialogCancelClick() {
        this.roleMenuDialog.show = false;
    },

    roleMenuDialogComfirmClick() {
        console.log("权限配置confirm:", this.currRoleMenuIds);
        console.log("checked menuIds:", this.checkedMenuIds)
        console.log("currRoleId:", this.currRole.id);
        if(this.checkedMenuIds == null || this.checkedMenuIds.length == 0){
          this.$message.error("请选择权限");
        } else {
          let param = {
            id: this.currRole.id,
            bindMenuIds: this.checkedMenuIds
          }
          roleBindMenus(param).then(res => {
            this.roleMenuDialog.show = false;
            // this.searchClick();
            location.reload();
          })
        }
    },

    // 角色选中变动事件
    currentRoleChange(data) {
        this.currRole = JSON.parse(JSON.stringify(data));
        console.log("当前角色==>", this.currRole);
        this.currRoleMenuIds = this.currRole.roleMenuIds ? this.currRole.roleMenuIdsNoChildren.slice(0) : [];
        this.$nextTick(() => {
          this.$refs.menuTree.setCheckedKeys(this.currRoleMenuIds);
        });

        console.log("currRoleMenuIds==>", this.currRoleMenuIds);
        this.freshCheckedMenuIds();
    },

    // 权限菜单选项变动触发事件
    menuTrueChangeHandler(data,node) {
      this.freshCheckedMenuIds();
      // console.log("选中的ids 2==>", this.checkedMenuIds);
    },

    freshCheckedMenuIds(){
      this.$nextTick(() => {
        this.checkedMenus = this.$refs.menuTree.getCheckedNodes();
        this.checkedMenuIds = this.$refs.menuTree.getCheckedKeys();
        this.checkedMenuIds = this.checkedMenuIds.concat(this.$refs.menuTree.getHalfCheckedKeys());
        // console.log("选中的ids==>", this.checkedMenuIds);
      })
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
