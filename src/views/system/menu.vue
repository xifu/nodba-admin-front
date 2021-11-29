<template>
  <div class="erp-content">
    <el-row class="sw-menu-row">
      <!-- 左侧 -->
      <el-col :span="6" style="padding-right:20px">
        <el-card class="sw-menu-card" shadow="never">
            <div slot="header" class="header">
                <span class="title">权限</span>
                <el-button size="mini" @click="showDialog(true)" type="text">新增</el-button>
            </div>
            <el-input
                size="small"
                suffix-icon="el-icon-search"
                placeholder="输入关键字进行过滤"
                clearable
                v-model="filterText"
                >
            </el-input>
            <el-scrollbar class="mt20" style=" height: calc(100% - 52px)">
                <el-tree
                    node-key="id"
                    :data="menuTreeData"
                    :props="defaultProps"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    default-expand-all
                    @current-change="currentChange"
                    ref="menuTree"
                    >
                </el-tree>
            </el-scrollbar>
            
        </el-card>
        
      </el-col>
      <!-- 右侧 -->
      <el-col :span="18">
          <el-card class="sw-menu-card" shadow="never">
            <div slot="header" class="header">
                <span class="title">权限信息</span>
            </div>
            <el-form  class="sw-detail-list" label-width="100px">
                <div>
                <el-form-item label="权限名称">
                    <div>{{ currMenu.name }}</div>
                </el-form-item>
                <el-form-item label="权限类型">
                    <div  v-if="currMenu != ''">{{ menuTypes[currMenu.type].key }}</div>
                </el-form-item>
                <el-form-item label="权限url">
                    <div >{{ currMenu.url }}</div>
                </el-form-item>
                <el-form-item label="权限标识">
                    <div >{{ currMenu.permission }}</div>
                </el-form-item>
                <el-form-item  label="权限序号">
                    <div >{{ currMenu.orderNum }}</div>
                </el-form-item>
                <el-form-item  label="创建时间">
                    <div >{{ currMenu.createTime }}</div>
                </el-form-item>
                <el-form-item class="mt10" label="">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="showDialog(false)"
                        >编辑
                    </el-button>
                    <el-button
                        v-show="!currMenu.children || currMenu.children.length == 0"
                        size="mini"
                        @click="deleteMenuOpt()"
                        >删除
                    </el-button>
                </el-form-item>
                </div>
            </el-form>
          </el-card>
      </el-col>
    </el-row>

    <!-- add update dialog -->
     <el-dialog :close-on-click-modal="false" 
      width="500px"
      :title="dialog.title"
      :visible.sync="dialog.show"
      center
    >
        <el-form
            :model="dialog.data"
            ref="menuOptForm"
            label-width="100px"
            :rules="dialog.rules"
        >
            <!-- <el-form-item label="父节点名称" prop="parentId" v-show="dialog.isAdd">
            <el-select
                v-model="dialog.data.parentId"
                :label-width="dialog.inputWidth"
                placeholder="请选择父节点"
            >
                <el-option
                v-for="item in menuParentData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
                </el-option>
            </el-select>
            </el-form-item> -->
            <el-form-item v-if="dialog.isAdd" label="父节点名称" prop="parentName" >
              <el-input 
                v-model="dialog.data.parentName" 
                placeholder="请选择父节点"
                @focus="showParentDialogHandle" 
                readonly="">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="权限名称" prop="name">
            <el-input
                v-model="dialog.data.name"
                :label-width="dialog.inputWidth"
                clearable
            ></el-input>
            </el-form-item>
            <el-form-item label="权限类型" prop="type">
            <el-select
                v-model="dialog.data.type"
                :label-width="dialog.inputWidth"
                placeholder="请选择类型"
            >
                <el-option
                v-for="item in menuTypes"
                :key="item.value"
                :label="item.key"
                :value="item.value"
                >
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="权限url">
            <el-input
                v-model="dialog.data.url"
                :label-width="dialog.inputWidth"
                clearable
            ></el-input>
            </el-form-item>
            <el-form-item label="权限标识">
            <el-input
                v-model="dialog.data.permission"
                :label-width="dialog.inputWidth"
                clearable
            ></el-input>
            </el-form-item>
            <el-form-item label="权限序号" prop="orderNum">
            <el-input
                v-model.number="dialog.data.orderNum"
                :label-width="dialog.inputWidth"
                clearable
            ></el-input>
            </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialog.show = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="menuOptSubmit()"
          :loading="dialog.loading"
          >确 定</el-button
        >
        
      </div>
    </el-dialog>

     <el-dialog :close-on-click-modal="false" 
      width="500px"
      :title="parentDialog.title"
      :visible.sync="parentDialog.show"
      center
    >
      <!-- <el-scrollbar class="mt20" style=" height: calc(100% - 52px)"> -->
      <div style="max-height:380px;overflow-y:scroll">
        <el-tree
            node-key="id"
            :data="menuTreeData"
            :props="defaultProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            default-expand-all
            @current-change="currentChange2"
            ref="menuTree2"
            >
        </el-tree>
      </div>
    <!-- </el-scrollbar> -->
      <!-- <div slot="footer" class="dialog-footer">
        <el-button
          class="btn"
          size="medium"
          type="primary"
          @click="menuOptSubmit()"
          :loading="dialog.loading"
          >确 定</el-button
        >
        <el-button class="btn" size="medium" @click="dialog.show = false"
          >取 消</el-button
        >
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { allMenus, addMenu, updateMenu, deleteMenu } from "@/api/system/menu";

export default {
  name: 'resourceManage',
  data() {
    return {
      filterText: "",
      currMenu: "",
      currParentMenu: null,
      menuTreeData: [],
      menuParentRoot: { id: 0, name: "根节点" },
      menuParentData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      menuTypes: [
        { key: "目录", value: 0 },
        { key: "菜单", value: 1 },
        { key: "按钮", value: 2 }
      ],
      deleteDialog: {
        show: false,
        loading: false
      },
      dialog: {
        title: "新增",
        show: false,
        loading: false,
        isAdd: true,
        inputWidth: "50px",
        data: {
          id: null,
          name: null,
          type: null,
          url: null,
          permission: null,
          orderNum: null,
          parentId: null
        },
        rules: {
          parentName: [
            { required: true, message: "请选择父节点", trigger: "change" }
          ],
          name: [
            { required: true, message: "请输入名称", trigger: "change" }
            // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
          ],
          type: [{ required: true, message: "请选择类型", trigger: "change" }],
          orderNum: [
            { required: true, message: "请填写权限序号", trigger: "change" },
            { type: "number", message: "请填写数字", trigger: "change" }
          ]
        }
      },
      parentDialog: {
        title: "选择父节点",
        show: false,
        loading: false,
        inputWidth: "50px",
      }
    };
  },
  mounted() {
    this.featchMenus();
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    featchMenus() {
      allMenus()
        .then(res => {
          if (res.code != 200) {
            console.log(res.data);
            this.$message({
              message: "查询权限失败!【" + res.message + "】",
              type: "warning"
            });
            return;
          }
          this.menuTreeData = res.data.menus;
          this.currMenu = this.menuTreeData[0];
          this.menuParentData = [];
          this.menuParentData.push(this.menuParentRoot);
          this.allMenuParents(this.menuTreeData);
          this.$nextTick(function() {
            this.$refs["menuTree"].setCurrentKey(this.currMenu.id);
          });
        })
        .catch(error => {
          console.log(error);
          this.$message.error("获取权限列表失败");
        });
    },
    allMenuParents(menuTreeData) {
      if (!menuTreeData || menuTreeData.length == 0) return;
      menuTreeData.forEach(node => {
        if (node.type != 2) {
          this.menuParentData.push(node);
        }
        let children = node.children;
        if (node.children && node.children.length > 0) {
          this.allMenuParents(node.children);
        }
      });
    },
    currentChange(data, node) {
      this.currMenu = JSON.parse(JSON.stringify(data));
    },
    currentChange2(data, node) {
      this.currParentMenu = JSON.parse(JSON.stringify(data));
      this.parentDialog.show = false;
      this.dialog.data.parentId = data.id;
      // this.dialog.data.parentName = data.name;
      this.$set(this.dialog.data,"parentName", data.name);
      
    },
    showDialog(isAdd) {
      this.dialog.isAdd = isAdd;
      this.dialog.show = true;
      if (!isAdd) {
        this.dialog.data = JSON.parse(JSON.stringify(this.currMenu));
        this.dialog.data.parentName = "parent";
        this.dialog.title = "编辑";
      } else {
        this.dialog.title = "新增";
        this.dialog.data = {};
      }
    },
    menuOptSubmit() {
      this.$refs["menuOptForm"].validate(valid => {
        console.log(valid)
        if (valid) {
      
          let param = this.dialog.data;
          console.log("參數==>", param);
          this.dialog.loading = true;
          if (this.dialog.isAdd) {
            addMenu(param)
              .then(res => {
                if (res.code == 200) {
                  this.dialog.show = false;
                  this.$message({
                    message: this.dialog.title + "成功!",
                    type: "success"
                  });
                  this.featchMenus();
                } else {
                  this.$message({
                    message: this.dialog.title + "失败!" + res.data.message,
                    type: "warning"
                  });
                }
                this.dialog.loading = false;
              })
              .catch(error => {
                console.log(error);
                this.dialog.loading = false;
                this.$message.error(this.dialog.title + "失败!");
              });
          } else {
            updateMenu(param)
              .then(res => {
                if (res.code == 200) {
                  this.dialog.show = false;
                  this.$message({
                    message: this.dialog.title + "成功!",
                    type: "success"
                  });
                  this.featchMenus();
                } else {
                  this.$message({
                    message: this.dialog.title + "失败!" + res.data.message,
                    type: "warning"
                  });
                }
                this.dialog.loading = false;
              })
              .catch(error => {
                console.log(error);
                this.dialog.loading = false;
                this.$message.error(this.dialog.title + "失败!");
              });
          }
        } else {
          return false;
        }
      });
    },
    deleteMenuOpt() {
        let title = "确认要删除【"+ this.currMenu.name +"】吗？";
        this.$confirm(title, "系统提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
           let id = this.currMenu.id;
            if (!id) {
                this.$message.error("id不存在,删除失败!");
                return;
            } else {
                this.deleteDialog.loading = true;
                deleteMenu(id)
                .then(res => {
                    if (res.code == 200) {
                    this.$message({ message: "删除成功!", type: "success" });
                    this.deleteDialog.show = false;
                    this.featchMenus();
                    } else {
                    this.$message({
                        message: id + "删除失败!" + res.data.message,
                        type: "warning"
                    });
                    }
                    this.deleteDialog.loading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.deleteDialog.loading = false;
                    this.$message.error(id + "删除失败!");
                });
            }
        }).catch(error => {

        })
    },

    showParentDialogHandle(){
      this.parentDialog.show = true;
    },
  }
};
</script>

<style lang="scss" scoped>
.sw-menu-row{
    height: 100%;
    .el-col{
        height: 100%;
    }
    .sw-menu-card{
        height: 100%;
        border:none;
        ::v-deep .el-card__header{
            padding: 0 0 10px;
        }
        ::v-deep .el-card__body{
            padding: 20px 0 0;
            height: calc(100% - 39px);
        }
        .header{
            display: flex;
            align-items: center;
            .title{
                flex: 1;
                line-height: 28px;
            }
        }
    }
    ::v-deep .el-scrollbar__wrap{
      overflow-x: hidden;
    }
}

</style>
