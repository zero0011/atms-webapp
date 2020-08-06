<template>
  <div class="versionManagement">
    <el-button type="primary" @click="createVersion">创建版本</el-button>
    <div class="tableArea">
      <el-table :data="tableData" border style="width: 100%" stripe height="670">
        <el-table-column prop="niceName" label="版本名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="版本描述" align="center"></el-table-column>
        <el-table-column prop="type" label="版本类型" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="labelDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="returnButton">
      <el-button type="primary" @click="returnLastPage">返 回</el-button>
    </div>
    <el-dialog title="创建版本" :visible.sync="dialogVisible" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="版本名称" prop="niceName">
          <el-input v-model="ruleForm.niceName" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="remark">
          <el-input v-model="ruleForm.remark" maxlength="200"></el-input>
        </el-form-item>   
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getVersionListBySecneLibraryId, creatOneVersion, versionList } from '../../api/api'
export default {
  data() {
    return {
      tableData: [],
      sceneRepId: 0,
      path: '',
      dialogVisible: false,
      ruleForm: {
        niceName: '',
        remark: '',
      },
      rules: {
        niceName: [
          {
            required: true,
            message: '请输入版本名称',
            trigger: 'blur',
          }
        ],
      },
    }
  },
  methods: {
    initData() {
      if (this.$route.query.from === '/manage/label') {
        versionList({
          dataType: 6
        }).then(res => {
          if (res.state === 1000) {
            this.tableData = res.data.allVersionList
          }
        })
      } else {
        getVersionListBySecneLibraryId({
          sceneRepId: this.sceneRepId,
        }).then((res) => {
          if (res.state === 1000) {
            this.tableData = res.data.sceneRepVersionHistory
          }
        })
      }
    },
    returnLastPage() {
      this.$router.push({
        path: this.path,
      })
    },
    createVersion() {
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$route.query.from === '/manage/label') {
            creatOneVersion({
              ...this.ruleForm,
              type: 6,
              userAccount: sessionStorage.getItem('userAccount')
            }).then(res => {
              if (res.state === 1000) {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.initData()
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }
              this.dialogVisible = false
              this.$refs[formName].resetFields()
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    labelDetail(rowData){
      this.$router.push({
        path:'/manage/historyLabel',
        query:{
          versionId:rowData.id
        }
      })
    }
  },
  created() {
    if (this.$route.query.from === '/manage/sceneLibrary') {
      this.sceneRepId = this.$route.query.sceneRepId
    }
    this.path = this.$route.query.from
    this.initData()
  },
}
</script>

<style lang="scss">
.versionManagement {
  box-sizing: border-box;
  padding: 20px;
  height: 100%;
  .tableArea {
    margin-top: 10px;
  }
  .returnButton {
    width: 100%;
    margin-top: 20px;
    text-align: center;
  }
}
</style>
