<template>
  <div class="gtContainer">
    <JsonViewer :value="context" :expand-depth="10" copyable class="gtContext"></JsonViewer>
    <div><el-button type="primary" @click="goBack">返回</el-button></div>
  </div>
</template>

<script>

import { previewImageContext } from '../../api/api'
export default {
  data() {
    return {
      context: ""
    }
  },
  methods: {
    initData() {
      previewImageContext({
        imageKeyId: this.$route.query.imageKeyId
      }).then(res => {
        if (res.state === 1000) {
          this.context =JSON.parse(res.data.context)
        }
      })
    },
    goBack(){
      this.$router.push({
        path:this.$route.query.from
      })
    }
  },
  created() {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.gtContainer{
  margin: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  align-items: center;
  .gtContext{
    flex: 1;
    overflow: auto;
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>