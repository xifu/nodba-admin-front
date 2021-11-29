
<!-- 数据库管理 -->
<template>
  <div class="erp-content">
    <!--查询条件-->
    <div class="erp-content-header">
      <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item>
          <el-input
            v-model="searchForm.db_alias"
            clearable
            placeholder="连接名称"
          />
        </el-form-item>
        <el-form-item>
           <el-select
            v-model="searchForm.id_c"
            clearable
            placeholder="环境"
          >
            <el-option
              v-for="item in idcList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchClick()">查询</el-button>
          <el-button type="default" @click="cleanClick()">重置</el-button>
          <el-button type="default" @click="openEditDialog()">新增数据库</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 主体表格 -->
    <div class="erp-content-body" v-loading="listLoading">
      <vxe-table height="100%" :data="dataList">
        
        <vxe-table-column field="db_alias" title="连接名称" min-width="160" show-overflow />
        <vxe-table-column field="data_source" title="数据库地址" min-width="120" show-overflow />
        <vxe-table-column field="id_c" title="环境" min-width="100" show-overflow />
        <vxe-table-column title="数据源类型" min-width="100">
          <template slot-scope="{row}">
            <el-tag v-if="row.is_query =='1'">只读</el-tag>
            <el-tag v-if="row.is_query =='2'" type="success">读写</el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column field="port" title="端口" min-width="100" show-overflow />
        <vxe-table-column field="username" title="用户名" min-width="100" show-overflow />
        <vxe-table-column field="password" title="密码" min-width="100" show-overflow />

        <vxe-table-column field="operate" min-width="100" title="操作">
          <template slot-scope="{row}">
            <el-button type="text" @click="openEditDialog(row)">编辑</el-button>
            <el-button type="text" @click="deleteDB(row)">删除</el-button>
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
        label-width="100px"
        ref="editForm"
        :model="editForm"
        :rules="editFormRules" 
      >
       
        <el-form-item label="连接名称" prop="db_alias">
          <el-input  v-model="editForm.db_alias" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据地址" prop="data_source">
          <el-input v-model="editForm.data_source" clearable></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="editForm.port" clearable></el-input>
        </el-form-item>
        <el-form-item label="环境" prop="id_c">
          <el-select
            v-model="editForm.id_c"
            placeholder="环境"
          >
            <el-option
              v-for="item in idcList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据源类型" prop="is_query">
          <el-select
            v-model="editForm.is_query"
            placeholder="请选择"
          >
            <el-option
              v-for="item in is_queryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input  v-model="editForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input  v-model="editForm.password" clearable></el-input>
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
import { getIdc,geDatabaseList,dbadd,dbupconninfo,dbdelconninfo } from '@/api/database'


export default {
  name: "Database",
  data() {
    return {
      listLoading:false,

      idcList:[],
      searchForm:{
        db_alias:'',
        id_c:'',
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
        title:'新增数据库',
        action:''
      },
      editForm:{
        db_alias:'',
        data_source:'',
        port:'',
        id_c:'',
        is_query:'',
        username:'',
        password:''
      },
      is_queryOptions:[
        {
          label:'只读',
          value:1,
        },
        {
          label:'读写',
          value:2,
        }
        
      ],
      editFormRules: {
        db_alias: [
          {required: true, message: "请输入连接名称", trigger: "blur"}
        ],
        data_source: [
          {required: true, message: "请输入数据地址", trigger: "blur"}
        ],
        port: [
          {required: true, message: "请输入端口号", trigger: "blur"}
        ],
        id_c: [
          {required: true, message: "请选择数据库环境", trigger: "blur"}
        ],
        is_query: [
          {required: true, message: "请选择数据源类型", trigger: "blur"}
        ],
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"}
        ],
      },

      

    };
  },
  computed: {
  },
  created() {
    this.getIdcList()
  },
  mounted() {
    this.searchClick()
  },
  
  methods: {
    // 获取idc
    async getIdcList(){
      this.listLoading = true
      
      try{
        const {data} = await getIdc()
        this.idcList = data.records.id_c
        console.log('getIdcList',this.idcList)

      }
      finally{
        this.listLoading = false
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
        db_alias:this.searchForm.db_alias ? this.searchForm.db_alias : null,
        id_c:this.searchForm.id_c ? this.searchForm.id_c : null,
        pageNumber:this.page.pageNumber,
        pageSize:this.page.pageSize,
      }
      console.log('params',params)
      try{
        const {data} = await geDatabaseList(params)
        console.log('getList',data)
        this.dataList = data.records
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
        this.editDialog.title='编辑数据库'
        this.editForm = JSON.parse(JSON.stringify(info))
        console.log("this.editForm",this.editForm)
      }else{
        console.log('新增')
        this.editDialog.action = 'add'
        this.editDialog.title='新增数据库'
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
        db_alias:'',
        data_source:'',
        port:'',
        id_c:'',
        is_query:'',
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
            fun = dbadd(this.editForm)
          }else{
            // 编辑
            fun = dbupconninfo(this.editForm)
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

    
    // 删除数据库
    deleteDB(info) {
      console.log('deleteDB',info)
      let title = "确认删除数据库【"+ info.db_alias +"】吗？";
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          id: info.id,
        }
        this.listLoading = true
        dbdelconninfo(params).then(res => {
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
