<template>
  <div class="login">
    <header class="login-header">
      <img src="../assets/logo.png" class="title-img" alt="logo" />
      <span>算法测试平台</span>
    </header>
    <div class="form-container">
      <div class="form">
        <p class="title">{{this.isAdmin?'管理员登录':'用户登录'}}</p>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="50px"
          class="loginForm"
        >
          <el-form-item label=" " prop="projectId" v-if="!isAdmin">
            <el-select v-model="ruleForm.projectId" placeholder="选择项目" class="itemSelect">
              <el-option
                v-for="item in projectName"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="userAccount">
            <el-input v-model="ruleForm.userAccount" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item label=" " prop="password">
            <el-input
              v-model="ruleForm.password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login('ruleForm')" class="loginButton">登录</el-button>
          </el-form-item>
        </el-form>
        <span class="adminLogin" @click="changeLogin('ruleForm')">{{this.isAdmin?'用户登录':'管理员登录'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { loginPower, getProjectName } from "../api/api.js";
export default {
  data() {
    return {
      projectName: [],
      ruleForm: {
        projectId: '',
        userAccount: '',
        password: '',
      },
      isAdmin: false,
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        userAccount: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      projectId: '',
    }
  },
  methods: {
    changeLogin(ruleForm) {
      this.isAdmin = !this.isAdmin
       this.$refs[ruleForm].resetFields();
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const userType = this.isAdmin ? 2 : 1
          loginPower({
            userAccount: this.ruleForm.userAccount,
            password: this.ruleForm.password,
            projectId: this.ruleForm.projectId,
            userType
          }).then(res => {
            if (res.state === 1000) {
              this.$message({
                type: 'success',
                message: '登录成功',
                duration: 1000
              })
              sessionStorage.setItem('token', res.data.token);
              sessionStorage.setItem('userAccount', this.ruleForm.userAccount)
              sessionStorage.setItem('isAdmin',this.isAdmin)
              sessionStorage.setItem('projectId',this.ruleForm.projectId)
              setTimeout(() => {
                if(this.isAdmin){
                  this.$router.push({ path: '/manage/label' })
                }else{
                  this.$router.push({ path: '/manage/sceneManagement' })
                }
                 
              }, 1000);
            }
            else{
               this.$message({
                type: 'error',
                message: res.message,
                duration: 1000
              })
            }
          })
        } else {
          return false;
        }
      });
    },
    getAllProject() {
      getProjectName().then(res => {
        if (res.state === 1000) {
          this.projectName = res.data.projects
        }
      })
    }
  },
  mounted() {
    this.getAllProject()
  }
}
</script>
<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/bg.png');
  .login-header {
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    .title-img {
      margin: 10px 30px;
    }
    span {
      color: #fff;
      font-size: 30px;
    }
  }
  .form-container {
    flex: 1;
    display: flex;
    align-items: center;
    .form {
      width: 340px;
      height: 450px;
      border-radius: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .loginForm {
        width: 100%;
        .loginButton {
          width: 100%;
        }
        .itemSelect {
          width: 100%;
        }
      }
      .title {
        font-size: 25px;
        color: #fff;
        letter-spacing: 10px;
        padding-left: 30px;
      }
      .adminLogin {
        text-align: right;
        color: #fff;
        width: 100%;
      }
    }
  }
}
</style>