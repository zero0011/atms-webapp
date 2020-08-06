<template>
  <div class="sceneLibrary">
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>场景库管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="searchArea">
      <el-input placeholder="场景库名称" v-model="sceneLibraryName"></el-input>
      <!-- <el-input placeholder="版本" v-model="sceneLibraryVer" clearable></el-input> -->
      <el-button type="primary" @click="filterSceneLibraryData">查询</el-button>
    </div>
    <div class="createSceneLibrary">
      <el-button type="primary" @click="createSceneLibrary">创建场景库</el-button>
    </div>
    <div class="tableArea">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="sceneRepoName" label="场景库名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sceneNum" label="关联场景数" align="center"></el-table-column>
        <el-table-column prop="dataCoverRate" label="数据覆盖度" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-button @click="editSceneLibrary(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteSceneLibrary(scope.row)" type="text" size="small">删除</el-button>
            <!-- <el-button @click="versionManagement(scope.row)" type="text" size="small">版本管理</el-button> -->
            <el-button @click="sceneManagement(scope.row)" type="text" size="small">场景管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size= "currentSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="sizeChange"
        @current-change="pageChange">
      </el-pagination>
    </div>
    <div class="dialog">
      <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :show-close=false :before-close="beforeClose">
        <div class="create">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="场景库名称" prop="sceneLibraryName">
              <el-input v-model="ruleForm.sceneLibraryName" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="场景库描述" prop="sceneLibraryDescription">
              <el-input v-model="ruleForm.sceneLibraryDescription" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">{{ action }}</el-button>
              <el-button @click="resetForm('ruleForm')">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="edit"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { searchSceneLibrary, createSceneLibrary, deleteSceneLibrary, editSceneLibrary } from '../../api/api'
export default {
  data () {
    return {
      sceneLibraryName: '',
      // sceneLibraryVer: '',
      tableData: [],
      currentPage: 1,
      currentSize: 10,
      total: 0,
      dialogVisible: false,
      title: '',
      ruleForm: {
        sceneLibraryName: '',
        sceneLibraryDescription: ''
      },
      rules: {
        sceneLibraryName: [
          {
            required: true,
            message: '请输入场景库名称',
            trigger: 'blur'
          }, {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur'
          }
        ]
      },
      action: '',
      sceneRepoId: ''
    }
  },
  methods: {
    initData () {
      searchSceneLibrary({
        repoName: this.sceneLibraryName,
        startNum: this.currentPage,
        range: this.currentSize,
        projectId: sessionStorage.getItem('projectId')
      }).then(res => {
        if (res.state === 1000) {
          this.tableData = res.data.sceneRepoLists
          this.total = res.data.total
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    filterSceneLibraryData () {
      this.initData()
    },
    createSceneLibrary () {
      this.title = '创建场景库'
      this.action = '创 建'
      setTimeout(() => {
        this.dialogVisible = true
      }, 0)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      setTimeout(() => {
        this.ruleForm.sceneLibraryName = '',
        this.ruleForm.sceneLibraryDescription = ''
        this.dialogVisible = false
      }, 0);
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.action === '创 建') {
            createSceneLibrary({
              repName: this.ruleForm.sceneLibraryName,
              repDesc: this.ruleForm.sceneLibraryDescription,
              creator: sessionStorage.getItem('userAccount'),
              projectId: sessionStorage.getItem('projectId')
            }).then(res => {
              if (res.state === 1000) {
                this.$message({
                  message: '创建场景库成功',
                  type: 'success'
                })
                this.dialogVisible = false
                setTimeout(() => {
                  this.ruleForm.sceneLibraryName = '',
                  this.ruleForm.sceneLibraryDescription = ''
                  this.action = ''
                  this.initData()
                }, 0)
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
            })
          } else {
            editSceneLibrary({
              id: this.sceneRepoId,
              repName: this.ruleForm.sceneLibraryName,
              repDesc: this.ruleForm.sceneLibraryDescription
            }).then(res => {
              if (res.state === 1000) {
                this.dialogVisible = false
                setTimeout(() => {
                  this.ruleForm.sceneLibraryName = '',
                  this.ruleForm.sceneLibraryDescription = ''
                  this.action = ''
                  this.initData()
                }, 0)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    beforeClose(done) {
      this.$confirm('确认关闭？')
      .then(_ => {
        this.ruleForm.sceneLibraryName = '',
        this.ruleForm.sceneLibraryDescription = ''
        done()
      })
      .catch(_ => {})
    },
    editSceneLibrary (rowData) {
      this.title = '编辑场景库'
      this.action = '编 辑'
      this.sceneRepoId = rowData.sceneRepoId
      this.ruleForm.sceneLibraryName = rowData.sceneRepoName
      setTimeout(() => {
        this.dialogVisible = true
      }, 0)
    },
    deleteSceneLibrary (rowData) {
      this.$confirm('此操作将删除该场景库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSceneLibrary({
          sceneRepoId: rowData.sceneRepoId
        }).then(res => {
          if (res.state === 1000) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            setTimeout(() => {
              this.initData()
            }, 0)
          }
        })
      })
    },
    versionManagement (rowData) {
      // getVersionListBySecneLibraryId({
      //   sceneRepId: rowData.sceneRepoId
      // }).then(res => {
      //   if (res.state === 1000) {
      //   }
      // })
      this.$router.push({
        path: '/manage/versionManagement',
        query: {
          from: '/manage/sceneLibrary',
          sceneRepId: rowData.sceneRepoId
        }
      })
    },
    sceneManagement (rowData) {
      this.$router.push({
        path: '/manage/scene',
        query: {
          from: '/manage/sceneLibrary',
          sceneName: rowData.sceneRepoName,
          sceneRepoId: rowData.sceneRepoId
        }
      })
    },
    sizeChange (size) {
      this.currentSize = size
      this.currentPage = 1
      this.initData()
    },
    pageChange (page) {
      this.currentPage = page
      this.initData()
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style lang="scss">
  .sceneLibrary {
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    .bread{
      margin-bottom: 15px;
    }
    .searchArea {
      width: 100%;
      margin-bottom: 20px;
      .el-input {
        width: 20%;
        float: left;
      }
      .el-input:nth-of-type(1) {
        margin-right: 50px;
      }
      .el-button {
        float: right
      }
    }
    .searchArea::before, .searchArea::after {
      display: block;
      content: '';
      clear: both;
    }
    .tableArea {
      widows: 100%;
      margin: 10px 0px 10px 0px;
    }
  }
</style>
