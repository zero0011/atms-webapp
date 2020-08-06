<template>
  <div class="headerContainer">
    <div class="headerTitle">
      <img src="../assets/logo.png" class="title-img" alt="logo" />
      <span class="titleText">算法测试平台</span>
    </div>
    <div class="headerMenu">
      <el-dropdown>
        <span class="userSpan">
          <i class="el-icon-user"></i>
          {{userAccount}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="signOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      userAccount:''
    }
  },
  methods:{
    signOut(){
      window.location.href = '/'
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userAccount')
      sessionStorage.removeItem('isAdmin')
    }
  },
  mounted(){
    this.userAccount = sessionStorage.getItem("userAccount")
  }

}
</script>
<style lang="scss">
.headerContainer {
  display: flex;
  align-items: center;
  background: #293463;
  height: 64px;
  .headerTitle {
    padding-left: 30px;
    display: flex;
    align-items: center;
    .titleText {
      color: #fff;
      padding-left: 20px;
    }
  }
  .headerMenu {
    flex: 1;
    display: flex;
    padding-right: 30px;
    justify-content: flex-end;
    .userSpan {
      color: #fff;
      font-size: 16px;
    }
  }

}
  .el-dropdown-menu {
    width: 100px;
    margin-left: 30px;
  }
</style>