<template>
  <div class="labelGroup">
    <h2>{{nodeData[1]}}</h2>
    <el-form ref="form" :model="labelForm" label-width="100px">
      <el-form-item label="标签组名称">
        <el-input v-model="labelForm.labelGroupName" disabled></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="labelForm.labelGroupDesc" disabled></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="labelForm.creator" disabled></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="labelForm.createTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="修改人">
        <el-input v-model="labelForm.updator" disabled></el-input>
      </el-form-item>
      <el-form-item label="修改时间">
        <el-input v-model="labelForm.updateTime" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { labelDetailByVersionId } from '../../api/api'
export default {
  props: ['nodeData'],
  data() {
    return {
      labelForm: {
        labelGroupName: '',
        labelGroupDesc: '',
        creator: '',
        createTime: '',
        updator: '',
        updateTime: ''
      }
    }
  },
  methods: {
    initData() {
      labelDetailByVersionId({ id: this.nodeData[0] }).then(res => {
        if (res.state === 1000) {
          this.labelForm = res.data.node
        }
      })
    },
  },
  created() {
    this.initData()
  },
  watch: {
    nodeData (newVal) {
      console.log(newVal)
      this.initData()
    }
  }
}
</script>
<style lang="scss">
.labelGroup {
  width: 69.7%;
  text-align: center;
}
</style>