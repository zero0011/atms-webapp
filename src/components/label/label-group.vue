<template>
  <div class="labelGroup">
    <h2>{{nodeData[1]}}</h2>
    <el-form ref="form" :model="labelForm" label-width="100px">
      <el-form-item label="标签组名称">
        <el-input v-model="labelForm.labelGroupName"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="labelForm.labelGroupDesc"></el-input>
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
    <el-button type="primary" @click="saveLabelGroup">保存</el-button>
  </div>
</template>
<script>
import { labelOrlabelGroupMes, editLabelOrLabelGroup } from '../../api/api'
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
      labelOrlabelGroupMes({ id: this.nodeData[0] }).then(res => {
        if (res.state === 1000) {
          this.labelForm = res.data.labelGroupDetail
        }
      })
    },
    // 编辑标签组
    saveLabelGroup() {
      const { labelGroupName, labelGroupDesc } = this.labelForm
      editLabelOrLabelGroup({
        nodeId: this.nodeData[0],
        labelName:labelGroupName,
        labelDesc:labelGroupDesc,
        updateAccount:sessionStorage.getItem('userAccount')
      }).then(res => {
        if (res.state === 1000) {
          this.$message({
            type: 'success',
            message: '修改成功',
            duration: 1000
          })
          this.initData()
        }else{
           this.$message({
            type: 'error',
            message: res.message,
            duration: 1000
          })
        }
      })
    }
  },
  created() {
    this.initData()
  },
  watch: {
    nodeData (newVal) {
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