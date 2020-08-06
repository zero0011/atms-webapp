<template>
  <div class="box">
    <HeaderBar></HeaderBar>
    <div class="container">
      <SideMenu></SideMenu>
      <div class="container-right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from '../../components/HeaderBar.vue';
import SideMenu from '../../components/SideMenu.vue'

export default {
  components: {
    HeaderBar,
    SideMenu
  }

}
</script>

<style lang="scss">
.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  background:#f0f2f5;
  .container {
    flex: 1;
    display: flex;
    height: calc(100% - 64px);
    .container-right{
      flex: 1;
      margin: 20px;
      background:#fff;    
      width: calc(100% - 290px);
    }
  }
}
</style>