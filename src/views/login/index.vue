<template>
  <div class="login-container">

    <div class="login-inner">
      <div class="login-banner">
        <span class="logo"></span>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form"  label-position="left">
        <h3 class="title">登 录</h3>
        <el-form-item class="login-form-item" prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="账号"
            name="username"
            type="text"
            tabindex="1"
          />
        </el-form-item>
        <el-form-item class="login-form-item" prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-button :loading="loading" type="primary" class="btn-save"  @click.native.prevent="handleLogin">登 录</el-button>
        <p class="footer">版权所有 © {{new Date().getFullYear()}} 数威. All Rights Reserved</p>
      </el-form>
    </div>

  </div>
</template>

<script>
// import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  data() {
   
    return {
      loginForm: {
        username: null,
        password: null
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: "请输入账号" }],
        password: [{ required: true, trigger: 'blur', message: "请输入密码" }]
      },
      // loginRules: {
      //   username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      //   password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      // },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          // this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
   
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              console.log("登录成功，跳转下一页")
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;


/* reset element-ui css */
.login-container {
  background: url('../../assets/login-images/login_bg.png')  center no-repeat;
	background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-input {
    z-index: 1;
    input {
      background: transparent;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 40px;
      color: $light_gray;
      height: 47px;
      font-size: 14px;
      color: #000;
      border-width: 0 0px 1px;
    }
    
  }
  .el-form-item {
    background: #fff;
    color: #000;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-inner{
    width: 1000px;
    display: flex;
    align-items:center;
    .login-banner{
      box-sizing: border-box;
      padding-top:60px ;
      text-align: center;
      width: 50%;
      height:500px ;
      background: url('../../assets/login-images/login_img.png')  center no-repeat;
      background-size: cover;
      border-radius:20px 0 0 20px ;
      .logo{
        display: inline-block;
        width: 290px;
        height: 55px;
        background: url('../../assets/login-images/logo.png')  center no-repeat;
        background-size: cover;
      }
    }
    .login-form {
      height: 500px;
      padding: 80px 80px 0;
      position: relative;
      width: 50%;
      background: #fff;
      border-radius: 0 20px 20px 0;
      position: relative;
      .title{
        font-size: 32px;
        font-weight: 600;
        color: #3f81e3;
        line-height: 50px;
        text-align: center;
        margin-bottom: 20px;
      }
      .login-form-item{
        .el-form-item__content{
          position: relative;
         
        }
      }
      .btn-save{
        width: 100%;
        margin-top: 50px;
        padding:12px 20px;
        font-size: 16px;
      }
      .footer{
        font-size: 12px;
        line-height: 30px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        color: #aaa;
      }
     
    }
  }
  
 
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    width: 40px;
    text-align: center;
    color: $dark_gray;
    display: inline-block;
    position: absolute;
    left:0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    z-index: 2;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
