<template>
  <div class="project-container">
    <div class="search">
      <el-input v-model="realName" placeholder="请输入姓名"></el-input>
      <el-input v-model="role" placeholder="请输入项目角色"></el-input>
      <el-button type="primary" @click="searchMember" class="searchButton">查询</el-button>
    </div>
    <!-- <el-button type="primary" @click="createProject">
      <i class="el-icon-circle-plus-outline"></i>添加人员
    </el-button>-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="realName" label="姓名" aslign="center"></el-table-column>
      <el-table-column prop="accountName" label="域账号" align="center"></el-table-column>
      <el-table-column prop="department" label="部门" align="center"></el-table-column>
      <el-table-column prop="role" label="角色" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteUser(scope.row)">删除</el-button>
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
  </div>
</template>
<script>
import { getProject, getUserList, deleteUser } from '../../api/api'
export default {
  data() {
    return {
      realName: '',
      role: '',
      tableData: [],
      startNum: 1,
      range: 10,
      total: 0
    }
  },
  methods: {
    initData() {
      getUserList({
        projectId: this.$route.query.projectId,
        realName: this.realName,
        role: this.role,
        startNum: this.startNum,
        range: this.range
      }).then(res => {
        if (res.state === 1000) {
          this.tableData = res.rows
          this.total = res.total
        }
      })
    },
    searchMember() {
      this.initData()
    },
    deleteUser(rowData) {
      this.$confirm('确定要移除人员？', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({
          projectId: rowData.userIds
        }).then(res => {
          if (res.state === 1000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            setTimeout(() => {
            }, 500)
          } else {
            // this.$message.error(res.message)
          }
        }, rej => {
          this.$message({
            type: 'error',
            message: '失败',
            duration: 1000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
  },
  created() {
    this.initData()
  },

}
</script>
<style lang="scss">
.project-container {
  padding: 20px;
}
.search {
  margin-bottom: 10px;
  .el-input {
    width: 200px;
    margin-right: 50px;
  }
  .searchButton {
    float: right;
  }
}
</style>