<template>
  <div class="datasetDetail">
        <PackManage v-if="this.$route.query.dataType==='pack'"></PackManage>
        <ImageManage v-else-if="this.$route.query.dataType==='image'"></ImageManage>
  </div>
</template>
<script>
import PackManage from './pack-manage.vue'
import ImageManage from './image-manage.vue'
export default {
  data() {
    return {

    }
  },
  components: {
    PackManage,
    ImageManage
  }

}
</script>
<style lang="scss">
.datasetDetail {
  .el-tabs--border-card{
    height: 100%;
  }
}
</style>