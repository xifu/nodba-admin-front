<!--
 * @FileDescription: 
 * @Author: WangQiang
 * @Date: 2021-08-13 10:16:41
-->
<template>
     <el-dialog :close-on-click-modal="false" 
      :title="title"
      :visible="isShow"
      :append-to-body="true"
      center
      width="600px"
      @close="cancel"
    >
      <el-form
        :model="userForm"
        size="small"
        :rules="rules"
        ref="userForm"
        label-width="100px"
        v-loading="loading"
      >
        <el-form-item v-if="isInfo" label="用户角色" prop="roleIds">
          <el-select
            style="width: 100%"
            v-model="userForm.roleIds"
            clearable
            collapse-tags
            multiple
            :disabled="true"
            placeholder="选择角色"
          >
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input  v-model="userForm.username" disabled clearable></el-input>
        </el-form-item>
        <el-form-item
          label="原始密码"
          prop="password"
          v-if="!isInfo"
        >
          <el-input
            v-model="userForm.password"
            type="password"
            clearable
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="confirmPwdOne"
          v-if="!isInfo"
        >
          <el-input
            v-model="userForm.confirmPwdOne"
            type="password"
            clearable
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPwdTwo"
          v-if="!isInfo"
        >
          <el-input
            v-model="userForm.confirmPwdTwo"
            type="password"
            clearable
            placeholder="请确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" v-if="isInfo" prop="realname">
          <el-input v-model="userForm.realname" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" v-if="isInfo" prop="phoneNumber">
          <el-input
            v-model="userForm.phoneNumber"
            clearable
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" v-if="isInfo" prop="email">
          <el-input v-model="userForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="入职时间" v-if="isInfo" prop="entryTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="userForm.entryTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
         <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm"
          >确 定
        </el-button>
       
      </div>
    </el-dialog>
</template>

<script>
import { searchRole } from "@/api/system/role";
import { modifyPassWord, updateUser } from "@/api/system/user";

export default {
    props: {
        isShow: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '修改密码',
        },
        type: {
          type: String,
          default: 'info'
        }
    },
    data() {
        const pwdOne = (rule, value, callback) => {
            if ((this.userForm.confirmPwdOne && this.userForm.confirmPwdTwo) && this.userForm.confirmPwdOne !== this.userForm.confirmPwdTwo) {
                return callback(new Error('两次密码不一样'));
            }
            callback();
        };
        const emailValidate = (rule, value, callback) => {
            let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
            if (value && !reg.test(value)) {
                return callback(new Error('邮箱格式错误'));
            }
            callback();
        };
        const phoneValidate = (rule, value, callback) => {
            let reg = /^1(3|4|5|6|7|8|9)\d{9}$/; //正则表达式
            if (value && !reg.test(value)) {
                return callback(new Error('手机号码格式不对'));
            }
            callback();
        };
        return {
            userForm: {
                roleIds: '',
                username: '',
                password: '',
                realname: '',
                email: '',
                phoneNumber: '',
                entryTime: '',
                confirmPwdOne: '',
                confirmPwdTwo: '',
            },
            loading: false,
            rules: {
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                realname: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
                email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: emailValidate, trigger: 'blur' }],
                phoneNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, { validator: phoneValidate, trigger: 'blur' }],
                confirmPwdOne: [
                  { required: true, message: '密码不能为空', trigger: 'blur' },
                  { min: 6, max: 15, message: '密码长度为 6 ~ 15', trigger: 'blur' },
                  { validator: pwdOne, trigger: 'blur' }
                ],
                confirmPwdTwo: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, max: 15, message: '密码长度为 6 ~ 15', trigger: 'blur' }, { validator: pwdOne, trigger: 'blur' }],
            },
            roleList: [],
        };
    },
    watch: {
      isShow () {
        if (this.isShow) {
          // 查询所有角色
          let param = {
            pageNumber: 1,
            pageSize: 1000000,
            status: 1,
          };
          this.loading = true;
          searchRole(param).then((response) => {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            let roles = [];
            if (userInfo.roles && userInfo.roles.length > 0) {
              roles = userInfo.roles.map((item) => {
                return Number(item.id);
              })
            }
            this.userForm = {
              roleIds: roles,
              username: userInfo.username,
              password: '',
              realname: userInfo.realname,
              email: userInfo.email,
              phoneNumber: userInfo.phoneNumber,
              entryTime: userInfo.entryTime,
              id: userInfo.id
            }
            console.log(roles)
            this.roleList = response.data.records;
          }).finally(() => {
            this.loading = false;
          });
          
        }
      }
    },
    computed: {
      isInfo ({ type }) {
        return type === 'info';
      }
    },
    mounted() {

    },
    methods: {
        confirm () {
          this.$refs.userForm.validate((valid) => {
            if (valid) {
              if (!this.isInfo) {
                let params = {
                  oldPassWord: this.userForm.password,
                  newPassWord: this.userForm.confirmPwdOne,
                }
                this.loading = true;
                modifyPassWord(params).then(() => {
                  this.$message.success('修改成功');
                  this.cancel();
                }).finally(() => {
                  this.loading = false;
                })
              } else {
                this.loading = true;
                let params = {
                  ...this.userForm,
                }
                updateUser(params)
                .then((response) => {
                  this.$message({
                    type: "success",
                    message: "修改成功",
                  });
                  this.cancel();
                })
                .finally(() => {
                  this.loading = false;
                });
              }
            }
          })
          
        },
        cancel () {
          this.$emit('update:isShow', false);
        },
    }
};
</script>

<style scoped lang="scss">

</style>
