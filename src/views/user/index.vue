
<!-- 用户管理 -->
<template>
  <div class="erp-content">
    <!--查询条件-->
    <div class="erp-content-header">
      <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item>
          <el-input
            v-model="searchForm.nickname"
            clearable
            placeholder="用户姓名"
          />
        </el-form-item>
        <el-form-item>
           <el-select
            v-model="searchForm.roles"
            clearable
            placeholder="角色"
          >
            <el-option
              v-for="item in rolesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchClick()">查询</el-button>
          <el-button type="default" @click="cleanClick()">重置</el-button>
          <el-button type="default" @click="openEditDialog()">新增用户</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 主体表格 -->
    <div class="erp-content-body" v-loading="listLoading">
      <vxe-table height="100%" :data="dataList">
        
        <vxe-table-column field="nickname" title="姓名" min-width="120" show-overflow />
        <vxe-table-column field="username" title="用户名" min-width="120" show-overflow />
        <vxe-table-column field="department" title="部门" min-width="120" show-overflow />
        <vxe-table-column title="角色" min-width="200">
          <template slot-scope="{row}">
            <span class="role-item" v-for="(role,index) in row.roles" :key="index">
              <el-tag v-if="role =='dev'">操作人</el-tag>
              <el-tag v-if="role =='leader'" type="success">审核人</el-tag>
              <el-tag v-if="role =='admin'" type="danger">管理员</el-tag>
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="状态" min-width="80">
          <template slot-scope="{row}">
            <el-tag v-if="row.us_status == 1" type="success" effect="dark">启用</el-tag>
            <el-tag v-else type="info" effect="dark">禁用</el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="创建时间" min-width="150">
          <template slot-scope="{row}">
            <span>{{row.create_time | formatDate('yyyy-MM-dd HH:mm') }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="operate" min-width="100" title="操作">
          <template slot-scope="{row}">
            <el-button type="text" @click="openEditDialog(row)">编辑</el-button>
            <el-dropdown class="sw-dropdown">
              <el-button type="text" class="ml10">操作<i class="el-icon-arrow-down"></i></el-button>
              <el-dropdown-menu class="sw-dropdown-menu" slot="dropdown">
                <el-dropdown-item>
                  <el-button type="text" @click="openPwdDialog(row)">重置密码</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="text"
                    @click="changeStatusUser(row)"
                  >
                    <span v-if="row.us_status === 1">禁用</span>
                    <span v-else>启用</span>
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="text" @click="deleteUser(row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>

    <!-- 分页 -->
    <div class="erp-content-footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.pageNumber"
        :page-sizes="[10,20, 50, 100, 200]"
        :page-size.sync="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog 
      :close-on-click-modal="false"
      :title="editDialog.title"
      :visible.sync="editDialog.visible"
       @close='closedEditDialog'
      center
      width="450px">
      <el-form
        v-loading = 'editDialog.loading'
        size="small"
        label-width="80px"
        ref="editForm"
        :model="editForm"
        :rules="editFormRules" 
      >
       
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model="editForm.nickname" clearable></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="editForm.department" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
            v-model="editForm.roles"
            multiple 
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in rolesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" v-if="editDialog.action=='add'" prop="username">
          <el-input  v-model="editForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="editDialog.action=='add'">
          <el-input  type="password"  v-model="editForm.password" clearable></el-input>
        </el-form-item>
      </el-form>

      
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialog.visible = false">取 消
        </el-button>
        <el-button size="small" type="primary"  @click="confirmClick()" >确 定
        </el-button>
      </div>
    </el-dialog>


    <!-- 修改密码弹窗 -->
    <el-dialog 
      :close-on-click-modal="false"
      :title="pwdDialog.title"
      :visible.sync="pwdDialog.visible"
       @close='closedPwdDialog'
      center
      width="450px">
      <el-form
        v-loading = 'pwdDialog.loading'
        size="small"
        label-width="80px"
        ref="pwdForm"
        :model="pwdForm"
        :rules="pwdFormRules" 
      >
       
        <el-form-item label="姓名" >
          <el-input :disabled="true" v-model="pwdForm.nickname" ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input  type="password" v-model="pwdForm.password" autocomplete clearable></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2" >
            <el-input  type="password" v-model="pwdForm.password2" autocomplete clearable></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="pwdDialog.visible = false">取 消
        </el-button>
        <el-button size="small" type="primary"  @click="pwdConfirmClick()" >确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { userList,userAdd,userupuserinfo,useruppasswd,userdel,userupenabled } from '@/api/system/user'


export default {
  name: "User",
 
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.pwdForm.password2 !== '') {
          this.$refs.pwdForm.validateField('password2');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      listLoading:false,
      searchForm:{
        nickname:'',
        roles:'',
      },
      page: {
        pageNumber: 1,
        pageSize: 20,
        total: 0,
      },
      dataList:[],

      // 新增、编辑弹窗
      editDialog:{
        visible:false,
        loading:false,
        title:'新增用户',
        action:''
      },
      editForm:{
        nickname:'',
        department:'',
        roles:[],
        username:'',
        password:''
      },
      rolesOptions:[
        {
          label:'操作员',
          value:'dev'
        },
        {
          label:'审核人',
          value:'leader'
        },
        {
          label:'管理员',
          value:'admin'
        }
      ],
      editFormRules: {
        nickname: [
          {required: true, message: "请输入姓名", trigger: "blur"}
        ],
        department: [
          {required: true, message: "请选择部门", trigger: "blur"}
        ],
        roles: [
          {required: true, message: "请选择角色", trigger: "blur"}
        ],
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"}
        ],
      },

      // 修改密码
      pwdDialog:{
        visible:false,
        loading:false,
        title:'修改密码',
      },
      pwdForm:{
        nickname:'',
        username:'',
        password:'',
        password2:''
      },
      pwdFormRules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          {  required: true,validator: validatePass2, trigger: 'blur' }
        ],
      },

    };
  },
  computed: {
  },
  created() {
    
  },
  mounted() {
    this.searchClick()
  },
  
  methods: {
    // 搜索
    searchClick() {
      console.log(this.searchForm)
      this.page.pageNumber = 1;
      this.getList();
    },

    //重置
    cleanClick() {
      this.searchForm = {
        nickname:'',
        roles:'',
      };
      this.page.pageNumber = 1;
      this.page.pageSize = 20;
      this.getList();
    },

    // 分页方法
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNumber = 1;
      this.getList()
    },
    handleCurrentChange(val) {
      this.getList()
    },

    // 列表查询
    async getList(){
      this.listLoading = true
      const params={
        nickname:this.searchForm.nickname ? this.searchForm.nickname : null,
        roles:this.searchForm.roles ? this.searchForm.roles : null,
        pageNumber:this.page.pageNumber,
        pageSize:this.page.pageSize,
      }
      console.log('params',params)
      try{
        const {data} = await userList(params)
        console.log('getList',data)
        if(data.records.length>0){
          this.dataList = data.records.map(item=>{
            item.roles = item.roles.split(',')
            return item
          })
        }else{
          this.dataList = []
        }
        
        this.page.total = data.totalRecord
      }
      finally{
        this.listLoading = false
      }
    },

    // 新增、编辑弹窗打开
    openEditDialog(info){
      console.log('openEditDialog',info)
      if(info){
        console.log('编辑',info)
        this.editDialog.action = 'update'
        this.editDialog.title='编辑用户'
        this.editForm = JSON.parse(JSON.stringify(info))
        console.log("this.editForm",this.editForm)
      }else{
        console.log('新增')
        this.editDialog.action = 'add'
        this.editDialog.title='新增用户'
      }
      this.editDialog.visible= true
    },

    // 关闭弹窗后事件回调
    closedEditDialog(){
      // 新增、编辑弹窗
      this.editDialog={
        visible:false,
        loading:false,
        title:'',
        action:''
      }
      this.editForm={
        nickname:'',
        department:'',
        roles:[],
        username:'',
        password:''
      }
      this.$refs['editForm'].clearValidate()
    },

    // 新增、编辑确认提交按钮
    confirmClick() {
      // console.log('editForm',this.editForm)
      this.$refs["editForm"].validate( async (valid) => {
        console.log('valid',valid)
          if(!valid) {
            return false
          }
          let fun 
          if(this.editDialog.action=='add'){
            // 新增
            fun = userAdd(this.editForm)
          }else{
            // 编辑
            fun = userupuserinfo(this.editForm)
          }
          this.editDialog.loading = true
          try{
            const {code,message} = await fun
            if(code == 200){
              this.$message.success(message)
              this.cleanClick()
              this.editDialog.visible = false
            }
          }
          finally{
            this.editDialog.loading = false
          }
          
      })
    },

    // 打开修改密码弹窗
    openPwdDialog(info){
      console.log(info)
      this.pwdForm = JSON.parse(JSON.stringify(info))
      this.pwdDialog.title='重置用户【'+ info.nickname +'】的登录密码'
      this.pwdDialog.visible= true
    },

    // 关闭弹窗后事件回调
    closedPwdDialog(){
      // 新增、编辑弹窗
      this.pwdDialog={
        visible:false,
        loading:false,
        title:'',
      }
      this.pwdForm={
        nickname:'',
        username:'',
        password:'',
        password2:''
      }
      this.$refs['pwdForm'].clearValidate()
    },

    // 修改密码确认
    pwdConfirmClick(){
      this.$refs['pwdForm'].validate(async (valid) => {
        if (valid) {
          console.log('提交')
          this.pwdDialog.loading = true
          const params = {
            username:this.pwdForm.username,
            password:this.pwdForm.password
          }
          try{
            const {code,message} = await useruppasswd(params)
            if(code == 200){
              this.$message.success(message)
              this.pwdDialog.visible = false
            }
          }
          finally{
            this.pwdDialog.loading = false
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 删除用户
    deleteUser(info) {
      console.log('deleteUser',info)
      let title = "确认删除用户【"+ info.nickname +"】吗？";
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          username: info.username,
        }
        this.listLoading = true
        userdel(params).then(res => {
          this.$message.success(res.message)
          this.getList()
        }).catch(error => {

        }).finally(()=>{
          this.listLoading = false;
        })
      }).catch(error => {

      })

    },

    // 启用禁用用户
    changeStatusUser(info){
      console.log('changeStatusUser',info)
      let optTitle = info.us_status == 1 ? "禁用" : "启用";
      let title = "确认"+optTitle + "用户【"+ info.nickname +"】吗？";
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          username: info.username,
        }
        this.listLoading = true
        userupenabled(params).then(res => {
          this.$message.success(res.message)
          this.getList()
        }).catch(error => {

        }).finally(()=>{
          this.listLoading = false;
        })
      }).catch(error => {

      })
    }
    
  },
};
</script>

<style lang="scss" scoped>
  .role-item ~ .role-item{
    display: inline-block;
    margin-left: 10px;
  }
</style>
