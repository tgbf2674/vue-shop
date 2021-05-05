<template>
  <div class="login-container">
    <div class="form-container">
      <!-- 头像区域   -->
      <div class="form-logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--  登录表单区域    -->
      <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" label-width="0px" class="loginForm">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user">
          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password">
          </el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button :plain="true" type="primary" @click="login">登录</el-button>
          <el-button :plain="true" type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: result } = await this.$http.post('login', this.loginForm)
        if (result.meta.status !== 200) return this.$message.error('登录失败')
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        window.sessionStorage.setItem('token', result.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b4b6b;

  .form-container {
    width: 450px;
    height: 300px;
    background: #ffffff;
    border-radius: 4px;
    position: relative;

    .form-logo {
      width: 152px;
      height: 152px;
      border-radius: 50%;
      border: 1px solid #fff;
      box-shadow: 0 0 10px #ddd;
      position: relative;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 5;
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        box-shadow: 0 0 10px #ddd;
        background-color: #dddddd;
      }
    }

    .loginForm {
      position: relative;
      top: -44px;
      box-sizing: border-box;
      padding: 0 20px;

      .btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
