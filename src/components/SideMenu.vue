<template>
  <el-row class="tac sideBar">
    <el-col class="sideMenu">
      <el-menu
        :default-active="$route.path"     
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#1890ff"
        unique-opened
        router
      >
        <!-- <el-submenu index="1">
          <template slot="title">
            <span>项目管理</span>
          </template>
          <el-menu-item index="/manage/myProject" >我的项目</el-menu-item>
          <el-menu-item index="/manage/user" v-if="isAdmin">项目人员信息</el-menu-item>
          <el-menu-item index="1-3">项目配置</el-menu-item>
        </el-submenu> -->
        <!-- <el-submenu index="2">
          <template slot="title">
            <span>版本管理</span>
          </template>
          <el-submenu index="2-1">
            <template slot="title">软件包管理</template>
            <el-menu-item index="2-1-1">配置文件管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="2-2">baseline管理</el-menu-item>
        </el-submenu>-->
        <el-submenu index="3" v-if="!isAdmin">
          <template slot="title">
            <span>场景数据管理</span>
          </template>
          <el-menu-item index="/manage/sceneManagement">场景管理</el-menu-item>
          <el-menu-item index="/manage/sceneLibrary">场景库管理</el-menu-item>
          <el-menu-item index="/manage/pack">PACK数据管理</el-menu-item>
          <el-menu-item index="/manage/gt">GT数据管理</el-menu-item>
          <el-menu-item index="/manage/image">Image数据管理</el-menu-item>
          <el-menu-item index="/manage/dataset">数据集管理</el-menu-item>
        </el-submenu> 
        <el-submenu index="4" v-if="!isAdmin">
          <template slot="title">
            <span>badcase管理</span>
          </template>
          <el-menu-item index="/manage/badcase" >算法测试badcase</el-menu-item>
        </el-submenu>
        <el-submenu index="5" v-if="isAdmin">
          <template slot="title">
            <span>评测标准管理</span>
          </template>
          <el-menu-item index="/manage/label">场景标签管理</el-menu-item>
          <!-- <el-menu-item index="4-2">算法定义</el-menu-item>
          <el-menu-item index="4-3">算法模型定义</el-menu-item>
          <el-menu-item index="4-4">评测指标定义</el-menu-item>
          <el-menu-item index="4-5">标注规范定义</el-menu-item> -->
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data(){
    return{
      isAdmin:''
    }
  },
  mounted(){
    this.isAdmin=sessionStorage.getItem('isAdmin')==='true'?true:false
  }

}
</script>

<style lang="scss">
.sideBar{
  width: 250px;
  background: #001529;
  height: 100%;
}
</style>