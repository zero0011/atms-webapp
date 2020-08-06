<template>
  <div class="project-container">
    <div class="search">
      <el-input v-model="projectName" placeholder="请输入项目名称"></el-input>
      <el-input v-model="projectNumber" placeholder="请输入项目编号"></el-input>
      <el-button type="primary" @click="searchProject" class="searchButton">查询</el-button>
    </div>
    <el-button type="primary" @click="createProject">
      <i class="el-icon-circle-plus-outline"></i>创建项目
    </el-button>
    <el-table :data="tableData" border style="width: 100%" class="table">
      <el-table-column prop="projectName" label="项目名称" width="180" align="center"></el-table-column>
      <el-table-column prop="projectDesc" label="项目描述" align="center"></el-table-column>
      <el-table-column prop="projectNumber" label="项目编号" width="120" align="center"></el-table-column>
      <el-table-column prop="projectType" label="项目类型" width="120" align="center"></el-table-column>
      <el-table-column prop="belongBu" label="所属BU" width="120" align="center"></el-table-column>
      <el-table-column prop="creator" label="创建人" width="180" align="center"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" width="180" align="center"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editProject(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteProject(scope.row)">删除</el-button>
          <el-button type="text" @click="userManage(scope.row)">人员管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="startNum"
      :page-sizes="[5, 10, 20]"
      :page-size="range"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="rangeChange"
      @current-change="startNumChange"
      style="margin-top: 20px"
      hide-on-single-page
    ></el-pagination>
    <el-dialog :title="isCreateProject ? '创建项目' : '编辑项目'" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="projectInformation" label-width="80px" :rules="rules">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="projectInformation.projectName"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="projectDesc">
          <el-input v-model="projectInformation.projectDesc"></el-input>
        </el-form-item>
        <el-form-item label="项目编号" prop="projectNumber">
          <el-input v-model="projectInformation.projectNumber"></el-input>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-input v-model="projectInformation.projectType"></el-input>
        </el-form-item>
        <el-form-item label="所属BU" prop="belongBu">
          <el-input v-model="projectInformation.belongBu"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="creator">
          <el-input v-model="projectInformation.creator"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
            v-model="projectInformation.beginTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="projectInformation.endTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickOk('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getProject,
  deleteProject,
  createProjectApi,
  editProjectApi,
} from '../../api/api'
export default {
  data() {
    return {
      projectName: '',
      projectNumber: '',
      tableData: [],
      startNum: 1,
      range: 10,
      total: 0,
      dialogVisible: false,
      isCreateProject: true,
      projectInformation: {
        projectName: '',
        projectNumber: '',
        projectType: '',
        belongBu: '',
        creator: '',
        beginTime: '',
        endTime: '',
      },
      rules: {
        projectName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        projectNumber: [
          { required: true, message: '请输入项目编号', trigger: 'blur' },
        ],
        projectType: [
          { required: true, message: '请输入项目类型', trigger: 'blur' },
        ],
        belongBu: [
          { required: true, message: '请输入所属BU', trigger: 'blur' },
        ],
        creator: [{ required: true, message: '请输入创建者', trigger: 'blur' }],
        beginTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' },
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    searchProject() {
      this.getAllProject()
    },
    getAllProject() {
      getProject({
        // projectName: this.projectName,
        // projectNumber: this.projectNumber,
        // startNum: this.startNum,
        // range: this.range
      }).then((res) => {
        if (res.state === 1000) {
          this.tableData = res.data.projects
          this.total = res.data.total
        }
      })
    },
    editProject(rowData) {
      this.projectInformation = rowData
      this.dialogVisible = true
      this.isCreateProject = false
    },
    createProject() {
      this.projectInformation = {}
        ; (this.isCreateProject = true), (this.dialogVisible = true)
    },
    deleteProject(rowData) {
      this.$confirm('确定要删除项目？', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteProject({
            projectId: rowData.projectId,
          }).then(
            (res) => {
              if (res.state === 1000) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
                setTimeout(() => {
                  this.getAllProject()
                }, 500)
              } else {
                // this.$message.error(res.message)
              }
            },
            (rej) => {
              this.$message({
                type: 'error',
                message: '失败',
                duration: 1000,
              })
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    clickOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isCreateProject) {
            createProjectApi(this.projectInformation).then((res) => {
              if (res.state === 1000) {
                this.$message({
                  type: 'success',
                  message: '创建成功',
                  duration: 1000,
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '创建失败',
                  duration: 1000,
                })
              }
              this.dialogVisible = false
            })
          } else {
            editProjectApi(this.projectInformation).then((res) => {
              if (res.state === 1000) {
                this.$message({
                  type: 'success',
                  message: '编辑成功',
                  duration: 1000,
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '编辑失败',
                  duration: 1000,
                })
              }
              this.dialogVisible = false
            })
          }
        }
      })
    },
    rangeChange(val) {
      this.range = val
      this.startNum = 1
      this.getAllProject()
    },
    startNumChange(val) {
      this.startNum = val
      this.getAllProject()
    },
    userManage(rowData) {
      this.$router.push({
        path: '/manage/user',
        query: { projectId: rowData.projectId },
      })
    },
  },
  created() {
    this.getAllProject()
  },
}
</script>
<style lang="scss">
.project-container {
  padding: 20px;
}
.search {
  margin-bottom: 20px;
  .el-input {
    width: 200px;
    margin-right: 50px;
  }

  .searchButton {
    float: right;
  }
}
.table {
  margin-top: 10px;
}
</style>
