<template>
  <div class="datasetContainer">
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>数据集管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search">
      <el-input v-model="dataSetName" placeholder="数据集名称" clearable></el-input>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <el-button type="primary" @click="creatDataSet">
      <i class="el-icon-circle-plus-outline"></i>创建数据集
    </el-button>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
      class="table"
      max-height="650"
    >
      <el-table-column
        fixed
        prop="dataSetName"
        label="数据集名称"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="packNum" label="PACK数" width="80" align="center"></el-table-column>
      <el-table-column prop="gtNum" label="GT数" width="80" align="center"></el-table-column>
      <el-table-column prop="packRelGtRate" label="PACK与GT关联度" width="140" align="center"></el-table-column>
      <el-table-column prop="channel" label="采集渠道" width="145" align="center"></el-table-column>
      <el-table-column prop="country" label="国家" width="145" align="center"></el-table-column>
      <el-table-column prop="dataType" label="类型" width="145" align="center"></el-table-column>
      <el-table-column prop="creator" label="创建人" width="180" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
      <el-table-column prop="caseSuiteDesc" label="描述" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editDateSet(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteDataSet(scope.row)">删除</el-button>
          <!-- <el-button type="text" @click="versionManage(scope.row)">版本管理</el-button> -->
          <el-button type="text" @click="datasetDetail(scope.row)">数据详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="startNum"
      :page-sizes="[5, 10, 20]"
      :page-size="range"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="pageChange"
      @current-change="startNumChange"
    ></el-pagination>
    <el-dialog
      :title="isCreateDataSet ? '创建数据集' : '编辑数据集'"
      :visible.sync="dialogVisible"
      width="30%"
      @open="submitButtonDisabled = false"
    >
      <el-form ref="form" :model="dataset" label-width="100px" :rules="rules">
        <el-form-item label="数据集名称" prop="name">
          <el-input v-model="dataset.name"></el-input>
        </el-form-item>
        <el-form-item label="渠道名称" prop="channel">
          <el-input v-model="dataset.channel"></el-input>
        </el-form-item>
        <el-form-item label="所属国家" prop="country">
          <el-input v-model="dataset.country"></el-input>
        </el-form-item>
        <el-form-item label="数据集类型" prop="dataType">
          <el-select v-model="dataset.dataType" placeholder="请选择数据集类型" :disabled="!isCreateDataSet">
            <el-option
              v-for="item in datasetType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="dataset.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel('form')">取 消</el-button>
        <el-button type="primary" @click="clickOk('form')" :disabled="submitButtonDisabled">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDataSet,
  createDataSetApi,
  editDataSetApi,
  delDataSetApi,
} from '../../api/api'
export default {
  data() {
    return {
      dataSetName: '',
      tableData: [],
      startNum: 1,
      range: 10,
      total: 0,
      dialogVisible: false,
      isCreateDataSet: true,
      submitButtonDisabled: true,
      datasetType: [
        {
          label: 'pack',
          value: 0,
        },
        {
          label: 'image',
          value: 1,
        }
      ],
      dataset: {
        name: '',
        channel: '',
        country: '',
        dataType: '',
        remark: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入数据集名称', trigger: 'blur' },
        ],
        channel: [{ required: true, message: '请输入渠道', trigger: 'blur' }],
        country: [
          { required: true, message: '请输入所属国家', trigger: 'blur' },
        ],
        dataType: [
          { required: true, message: '请选择数据集类型', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    //初始化表格数据
    initData() {
      getDataSet({
        dataSetName: this.dataSetName,
        projectId: sessionStorage.getItem('projectId'),
        startNum: this.startNum,
        range: this.range,
      }).then((res) => {
        if (res.state === 1000) {
          const data = res.data.dataSetList.map((item) => {
            return {
              id: item.id,
              dataSetName: item.dataSetName,
              channel: item.channel,
              packNum: item.packNum,
              gtNum: item.gtNum,
              packRelGtRate: item.packRelGtRate,
              country: item.country,
              creator: item.creator,
              projectId: item.projectId,
              createTime: item.createTime,
              dataType: item.dataType === 0 ? 'pack' : 'image',
            }
          })
          this.tableData = data

          this.total = res.data.total
        } else {
          this.$message({
            type: 'info',
            message: res.message,
          })
        }
      })
    },
    // 点击查询按钮
    search() {
      this.startNum = 1
      this.initData()
    },
    pageChange(range) {
      this.range = range
      this.initData()
    },
    startNumChange(startNum) {
      this.startNum = startNum
      this.initData()
    },
    //点击创建数据集
    creatDataSet() {
      this.dialogVisible = true
      this.isCreateDataSet = true
      this.dataset = {}
    },
    //创建和编辑数据集弹框的确认按钮
    clickOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitButtonDisabled = true
          this.dialogVisible = false
          if (this.isCreateDataSet) {
            const params = {
              ...this.dataset,
              projectId: sessionStorage.getItem('projectId'),
              userAccount: sessionStorage.getItem('userAccount'),
            }
            createDataSetApi(params).then((res) => {
              if (res.state === 1000) {
                this.$message({
                  type: 'success',
                  message: '创建成功',
                  duration: 1000,
                })
                this.initData()
              } else {
                this.$message({
                  type: 'error',
                  message: res.message,
                  duration: 1000,
                })
              }
            })
          } else {
            editDataSetApi({
              ...this.dataset,
              userAccount: sessionStorage.getItem('userAccount'),
            }).then((res) => {
              if (res.state === 1000) {
                this.$message({
                  type: 'success',
                  message: '编辑成功',
                  duration: 1000,
                })
                this.initData()
              } else {
                this.$message({
                  type: 'error',
                  message: res.message,
                  duration: 1000,
                })
              }
              this.dialogVisible = false
            })
          }
        }
      })
    },
    //弹窗取消按钮
    clickCancel(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 点击编辑按钮
    editDateSet(rowData) {
      this.dataset = {
        name: rowData.dataSetName,
        id: rowData.id,
        channel: rowData.channel,
        country: rowData.country,
        dataType:
          rowData.dataType === 'pack'
            ? 0
            : rowData.dataType === 'image'
              ? 1
              : 2,
        remark: rowData.remark,
      }
      this.isCreateDataSet = false
      this.dialogVisible = true
    },
    // 删除数据集
    deleteDataSet(rowData) {
      this.$confirm('确定要删除此数据集？', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delDataSetApi({
            ids: [rowData.id],
            userAccount: sessionStorage.getItem('userAccount'),
          }).then((res) => {
            if (res.state === 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              setTimeout(() => {
                this.initData()
              }, 500)
            } else {
              this.$message({
                type: 'error',
                message: res.message,
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 点击数据详情，页面进行跳转
    datasetDetail(rowData) {
      console.log(rowData)
      this.$router.push({
        path: '/manage/datasetDetail',
        query: {
          datasetId: rowData.id,
          dataType:rowData.dataType
        },
      })
    },
  },
  created() {
    this.dataSetName = ''
    this.initData()
  },
}
</script>
<style lang="scss">
.datasetContainer {
  margin: 20px;
  .bread{
    margin-bottom: 15px;
  }
  .search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .el-input {
      width: 200px;
    }
  }
  .table {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 15px;
  }
}
</style>
