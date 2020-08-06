<template>
  <div class="labelDetail">
    <h2>{{nodeData[1]}}</h2>
    <el-form ref="form" :model="labelForm" label-width="100px">
      <el-form-item label="标签名称">
        <el-input v-model="labelForm.labelName"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="labelForm.labelDesc"></el-input>
      </el-form-item>
      <el-form-item label="正例">
        <el-carousel v-if="labelForm.caseOk&&labelForm.caseOk.length>0">
          <el-carousel-item v-for="item in labelForm.caseOk" :key="item">
            <div class="blockImg">
              <img :src="item" height="100%" />
            </div>
          </el-carousel-item>
        </el-carousel>
        <el-button size="small" type="primary" @click="uploadCaseOkPicture()">上传</el-button>
      </el-form-item>
      <el-form-item label="反例">
        <el-carousel v-if="labelForm.caseNoOk&&labelForm.caseNoOk.length>0">
          <el-carousel-item v-for="item in labelForm.caseNoOk" :key="item">
            <div class="blockImg">
              <img :src="item" height="100%" />
            </div>
          </el-carousel-item>
        </el-carousel>
        <el-button size="small" type="primary" @click="uploadCaseNoOkPicture()">上传</el-button>
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
    <div class="save">
      <el-button type="primary" @click="saveLabel" class="save">保存</el-button>
    </div>
    <!-- 正例查看弹窗 -->
    <el-dialog :visible.sync="caseOkVisible">
      <el-carousel>
        <el-carousel-item v-for="item in labelForm.caseOk" :key="item">
          <img :src="item" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!-- 反例查看弹窗 -->
    <el-dialog :visible.sync="caseNoOkVisible">
      <el-carousel>
        <el-carousel-item v-for="item in labelForm.caseNoOk" :key="item">
          <img :src="item" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <el-dialog title="上传图片" :visible.sync="caseOkUpload" :destroy-on-close="true" width="30%">
      <el-upload
        class="upload-demo"
        :action="url"
        multiple
        :on-success="uploadSuccess"
        :file-list="fileList"
        :on-change="fileChange"
        :on-remove="fileRemove"
        :auto-upload="false"
        ref="upload"
        accept="image/jpeg, image/jpg, image/png"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传图片，且不超过5M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadCase()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { labelOrlabelGroupMes, editLabelOrLabelGroup, uploadPic } from '../../api/api'
import { baseUrl } from '../../util/http'
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
      },
      caseOkVisible: false,//正例查看弹窗
      caseNoOkVisible: false, //反例查看弹窗
      caseOkUpload: false, // 上传弹框
      fileList: [],
      isOk: 0,
      url: ''
    }
  },
  methods: {
    initData() {
      labelOrlabelGroupMes({ id: this.nodeData[0] }).then(res => {
        if (res.state === 1000) {
          this.labelForm = res.data.labelDetail
        }
      })
    },
    saveLabel() {
      const { labelName, labelDesc } = this.labelForm
      editLabelOrLabelGroup({
        nodeId: this.nodeData[0],
        labelName: labelName,
        labelDesc: labelDesc,
        updateAccount: sessionStorage.getItem('userAccount')
      }).then(res => {
        if (res.state === 1000) {
          this.$message({
            type: 'success',
            message: '修改成功',
            duration: 1000
          })
          this.initData()
        } else {
          this.$message({
            type: 'error',
            message: res.message,
            duration: 1000
          })
        }
      })
    },
    // 预览正例
    lookCaseOk() {
      this.caseOkVisible = true
    },
    // 预览反例
    lookCaseNoOk() {
      this.caseNoOkVisible = true
    },
    // 检测文件变动获取文件
    fileChange(file, fileList) {
      this.fileList = fileList
    },
    // 检测文件删除
    fileRemove(file, fileList) {
      this.fileList = fileList
    },
    // 文件上传后提示
    uploadSuccess(response) {
      if (response.state === 1000) {
        this.$message({
          showClose: true,
          message: '上传成功',
          type: 'success'
        })
        this.initData()
      } else {
        this.$message({
          showClose: true,
          message: response.message,
          type: 'error'
        })
      }
    },
    // 文件上传
    uploadCase() {
      let params = {
        fileList: this.fileList,
        nodeId: this.nodeData[0],
        isok: this.isOk
      }
      let paramsNew = new FormData()
      paramsNew.append('nodeId', params.nodeId)
      paramsNew.append('isok', params.isok)
      params.fileList && params.fileList.forEach(file => {
        const size = file.raw.size / 1024 / 1024 < 5
        if (!size) {
          this.$message.error(`${file.raw.name}大小超过5m`)
          return
        }
        paramsNew.append('file', file.raw)
      })
      uploadPic(paramsNew).then(
        res => {
          if (res.state === 1000) {
            this.$message.success(res.message)
          }
        },
        rej => {
          this.$message.error('网络错误')
        })
      this.caseOkUpload = false
      this.$refs.upload.clearFiles()
      this.fileList = []
    },
    uploadCaseOkPicture() {
      this.caseOkUpload = true
      this.isOk = 1
    },
    uploadCaseNoOkPicture() {
      this.caseOkUpload = true
      this.isOk = 2
    }
  },
  created() {
    this.initData()
    this.url = baseUrl + '/open/task/updateCaseResult.action'
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