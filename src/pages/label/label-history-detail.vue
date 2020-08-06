<template>
  <div class="labelDetail">
    <h2>{{nodeData[1]}}</h2>
    <el-form ref="form" :model="labelForm" label-width="100px">
      <el-form-item label="标签名称">
        <el-input v-model="labelForm.labelName" disabled></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="labelForm.labelDesc" disabled></el-input>
      </el-form-item>
      <el-form-item label="正例">
        <el-carousel v-if="labelForm.caseOk&&labelForm.caseOk.length>0">
          <el-carousel-item v-for="item in labelForm.caseOk" :key="item">
            <div class="blockImg">
              <img :src="item" height="100%" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
      <el-form-item label="反例">
        <el-carousel v-if="labelForm.caseNoOk&&labelForm.caseNoOk.length>0">
          <el-carousel-item v-for="item in labelForm.caseNoOk" :key="item">
            <div class="blockImg">
              <img :src="item" height="100%" />
            </div>
          </el-carousel-item>
        </el-carousel>
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
        labelName: '',
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
    }
  },
  created() {
    this.initData()
  },
  watch: {
    nodeData(newVal) {
      this.initData()
    }
  }
}
</script>
<style lang="scss">
.labelDetail {
  width: 69.7%;
  height: 100%;
  overflow: auto;
  .upload-demo {
    float: left;
    margin-right: 20px;
  }
  h2 {
    text-align: center;
  }
  .save {
    text-align: center;
  }
}
.blockImg {
  display: flex;
  justify-content: center;
  height: 100%;
}
</style>