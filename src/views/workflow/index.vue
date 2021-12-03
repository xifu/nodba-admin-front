
<!-- 权限管理 -->
<template>
  <div class="erp-content">
    <!--查询条件-->
    <div class="erp-content-header">
      <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item>
          <el-input
            v-model="searchForm.workflowname"
            clearable
            placeholder="工作流名称"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.department"
            clearable
            placeholder="部门"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchClick()">查询</el-button>
          <el-button type="default" @click="cleanClick()">重置</el-button>
          <el-button type="default" @click="openEditDialog()">新增流程</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 主体表格 -->
    <div class="erp-content-body" v-loading="listLoading">
      <vxe-table height="100%" :data="dataList">
        <vxe-table-column field="workflowname" title="工作流名称" min-width="140" show-overflow fixed="left" />
        <vxe-table-column field="department" title="所属部门" min-width="120" show-overflow />
        <vxe-table-column title="流程步骤" min-width="100">
          <template slot-scope="{row}">
            <el-popover
              placement="bottom-end"
              width="300"
              trigger="hover"
              :open-delay="500"
            >
              
              <div class="workflow-list">
                <!-- <p class="workflow-item" v-for="">
                  {{item.}}
                </p> -->
              </div>
              <span slot="reference" style="cursor: pointer" >
                共{{row.workflow.workflow.length+row.workflow.executors.length}}步<i
                  class="el-icon-arrow-down sw-icon-more"
                ></i
              >
              </span>
            </el-popover> 
          </template>
        </vxe-table-column>
        <vxe-table-column field="operate" min-width="100" title="操作" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" @click="openEditDialog(row)">编辑</el-button>
            <el-button
              type="text"
              @click="changeStatus(row)"
            >
              <span v-if="row.is_query === 1">禁用</span>
              <span v-else>启用</span>
            </el-button>
            
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
      @opened='openedEditDialog'
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
        <el-form-item label="用户" prop="suser">
          <el-select
            v-model="editForm.suser"
            placeholder="请选择"
            :disabled="editDialog.action=='update'"
          >
            <el-option
              v-for="item in userList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="连接串" prop="dbconn_string">
          <el-input  v-model="editForm.dbconn_string" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据名称" prop="dbname">
          <el-input v-model="editForm.dbname" clearable></el-input>
        </el-form-item>
        
        <el-form-item label="ddl权限" prop="ddl_pri">
          <el-switch
            v-model="editForm.ddl_pri"
            :active-value='1'
            :inactive-value='0'
          >
          </el-switch>
          <span v-if="editForm.ddl_pri==1" class="ml5 color-primary" >开启</span>
          <span v-else class="ml5 color-gray">关闭</span>
        </el-form-item>
        <el-form-item label="dml权限" prop="dml_pri">
          <el-switch
            v-model="editForm.dml_pri"
            :active-value='1'
            :inactive-value='0'
          >
          </el-switch>
          <span v-if="editForm.dml_pri==1" class="ml5 color-primary" >开启</span>
          <span v-else class="ml5 color-gray">关闭</span>
        </el-form-item>
        <el-form-item label="select权限" prop="select_pri">
          <el-switch
            v-model="editForm.select_pri"
            :active-value='1'
            :inactive-value='0'
          >
          </el-switch>
          <span v-if="editForm.select_pri==1" class="ml5 color-primary" >开启</span>
          <span v-else class="ml5 color-gray">关闭</span>
        </el-form-item>
        <el-form-item label="审核权限" prop="rev_pri">
          <el-switch
            v-model="editForm.rev_pri"
            :active-value='1'
            :inactive-value='0'
          >
          </el-switch>
          <span v-if="editForm.rev_pri==1" class="ml5 color-primary" >开启</span>
          <span v-else class="ml5 color-gray">关闭</span>
        </el-form-item>
        <el-form-item label="审核人" prop="reviews">
          <el-select
            v-model="editForm.reviews"
            multiple
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="item in reviewUserList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>

      
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialog.visible = false">取 消
        </el-button>
        <el-button size="small" type="primary"  @click="confirmClick()" >确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {usergetpri,dbreviewuser,dbadduserdbpri,dbupuserdbpri,dbuserendisable } from '@/api/authorization'
import { getworkflows } from '@/api/workflow'


export default {
  name: "Authorization",
  data() {
    return {
      listLoading:false,

      userList:[],
      reviewUserList:[],
      searchForm:{
        suser:'',
        dbconn_string:'',
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
        title:'新增用户权限',
        action:''
      },
      editForm:{
        suser:'',
        dbconn_string:'',
        dbname:'',
        ddl_pri:0,
        dml_pri:0,
        select_pri:0,
        rev_pri:0,
        reviews:[]
      },
      editFormRules: {
        suser: [
          {required: true, message: "请选择用户", trigger: "blur"}
        ],
        dbconn_string: [
          {required: true, message: "请输入连接串", trigger: "blur"}
        ],
        dbname: [
          {required: true, message: "请输入数据名称", trigger: "blur"}
        ],
        reviews: [
          {required: true, message: "请选择审核人", trigger: "blur"}
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

    // 获取权限用户列表
    async getUserList(){
      this.editDialog.loading = true
      try{
        const {data} = await usergetpri()
        console.log('getUserList',data)
        this.userList = data.records
      }
      finally{
        this.editDialog.loading = false
      }
    },

    // 获取审核用户列表
    async getReviewUserList(){
      this.editDialog.loading = true
      try{
        const {data} = await dbreviewuser()
        console.log('getReviewUserList',data)
        this.reviewUserList = data.records.reviewusers
      }
      finally{
        this.editDialog.loading = false
      }
    },
    
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
        workflowname:this.searchForm.workflowname ? this.searchForm.workflowname : null,
        department:this.searchForm.department ? this.searchForm.department : null,
        pageNumber:this.page.pageNumber,
        pageSize:this.page.pageSize,
      }
      console.log('params',params)
      try{
        const {data} = await getworkflows(params)
        console.log('getList',data)
        if( data?.records?.length>0){
          this.dataList = data.records.map(item=>{
            item.workflow = JSON.parse(item.workflow)
            return item
          })
        }
        console.log('dataList',this.dataList)
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
        this.editDialog.title='编辑权限'
        this.editForm = JSON.parse(JSON.stringify(info))
        if(this.editForm.reviews){
          this.editForm.reviews = this.editForm.reviews.split(",")
        }
        console.log("this.editForm",this.editForm)
      }else{
        console.log('新增')
        this.editDialog.action = 'add'
        this.editDialog.title='新增权限'
      }
      this.editDialog.visible= true
    },
    // 打开编辑弹窗后回调
    openedEditDialog(){
       this.getUserList()
       this.getReviewUserList()
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
        suser:'',
        dbconn_string:'',
        dbname:'',
        ddl_pri:0,
        dml_pri:0,
        select_pri:0,
        rev_pri:0,
        reviews:[]
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
            fun = dbadduserdbpri(this.editForm)
          }else{
            // 编辑
            fun = dbupuserdbpri(this.editForm)
          }
          this.editDialog.loading = true
          try{
            const {code,message} = await fun
            if(code == 200){
              this.$message.success(message)
              this.editDialog.visible = false
              this.cleanClick()
            }
          }
          finally{
            this.editDialog.loading = false
          }
          
      })
    },
    
    // 启用禁用
    changeStatus(info){
      console.log('changeStatus',info)
      let optTitle = info.is_query == 1 ? "禁用" : "启用";
      let title = "确认"+optTitle + "用户【"+ info.suser +"】的权限吗？";
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          sid: info.id,
          is_query:info.is_query === 1?0:1
        }
        this.listLoading = true
        dbuserendisable(params).then(res => {
          this.$message.success(res.message)
          this.getList()
        }).catch(error => {

        }).finally(()=>{
          this.listLoading = false;
        })
      }).catch(error => {

      })
    },
    
  },
};
</script>

<style lang="scss" scoped>
  .role-item ~ .role-item{
    display: inline-block;
    margin-left: 10px;
  }
</style>
