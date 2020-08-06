<template>
  <div class="imageContainer">
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>GT数据管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search">
      <div>
        <el-input v-model="imageKey" placeholder="imageKey" clearable></el-input>
        <el-select v-model="version" clearable placeholder="选择标签版本" @change="changeVersion">
          <el-option
            v-for="item in versions"
            :key="item.versionId"
            :label="item.versionName"
            :value="item.versionId"
          ></el-option>
        </el-select>
        <el-select
          v-model="labelvalue"
          placeholder="选择标签"
          multiple
          filterable
          clearable
          @change="selectLabels"
        >
          <el-option-group v-for="(group, index) in allLabel" :key="index" :label="group.labelPath">
            <el-option
              v-for="item in group.labelInfo"
              :key="item.labelId"
              :label="item.labelName"
              :value="item.labelId"
            ></el-option>
          </el-option-group>
        </el-select>
        <el-select v-model="method" placeholder="查询方式" :disabled="disabledSelectMethods">
          <el-option
            v-for="item in methods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <el-button type="primary" @click="refreshData">刷新数据</el-button>
    <el-button type="primary" @click="importVisible=true">关联关系导入</el-button>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
      class="tableContainer"
      max-height="650"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed label="imageKey" width="300" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="handleClick(scope.row)">{{scope.row.imageKey}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="label" label="label" width="300" align="center">
        <template slot-scope="scope">
          <el-tag
            type="success"
            disable-transitions
            v-for="(label, index) in scope.row.label"
            :key="index"
            style="margin-left: 10px;margin-bottom:5px"
          >
            <el-tooltip effect="dark" placement="top">
              <div slot="content">{{label.labelVersion}}--{{label.labelPath}}--{{ label.labelName }}</div>
              <span>{{ label.labelName }}</span>
            </el-tooltip>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="model" label="model" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="batch" label="batch" width="120" align="center"></el-table-column>
      <el-table-column
        prop="gtPath"
        label="gtPath"
        width="200"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="fileName"
        label="fileName"
        width="200"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="fileType"
        label="fileType"
        width="200"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="source" label="source" width="120" align="center"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="deleteGt(scope.row)">删除</el-button> -->
          <el-button type="text" @click="bindLabel(scope.row)">打标签</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="startNum"
      :page-sizes="[5, 10, 20]"
      :page-size="range"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="sizeChange"
      @current-change="startNumChange"
    ></el-pagination>
    <el-dialog title="数据关系导入" :visible.sync="importVisible" class="dialogCaseVisible">
      <div>
        <el-upload
          class="upload-demo"
          :action="url"
          :show-file-list="false"
          accept=".json"
          :before-upload="beforeUploadFile"
          :on-success="uploadSuccess"
          :data="upLoadText"
          :headers="importHeaders"
        >
          <el-button type="primary" @click="upLoadFile()">json文件导入</el-button>
        </el-upload>
        <p>导入说明：</p>
      </div>
      <ul>
        <li>1.请上传json文件</li>
        <li>2.导入的模版字段为</li>
        <li>Image_key:pack_name</li>
      </ul>
    </el-dialog>
    <HitLabel
      :showSelectPeople="showSelectPeople"
      :bindUserData="bindUserData"
      :havebindUserData="havebindUserData"
      @changeShowSelectPeople="changeShowSelectPeople"
      :getSearch="sendSearch"
      @commitBindPeople="commitBindPeople"
      @selectVersion="selectVersion"
      :versions="versions"
      width="1100px"
    ></HitLabel>
  </div>
</template>
<script>
import {
  getAllLabel,
  delGt,
  flushGt,
  addGtLabel,
  versionListByType,
  queryAllDataFileInDatesetOrProject
} from '../../api/api'
import { baseUrl } from '../../util/http'
import HitLabel from '../../components/label/hit-label.vue'
export default {
  components: {
    HitLabel
  },
  data() {
    return {
      imageKey: '',
      allLabel: [],
      tableData: [],
      startNum: 1,
      range: 10,
      total: 0,
      labelvalue: '',
      imageId: [], //选择的imageID
      bindUserData: [],
      havebindUserData: [],
      sendSearch: [],
      showSelectPeople: false,
      bindLabelId: '',
      versions: [],//获取的所有versions
      version: '',//选择的版本
      disabledSelectMethods: true,
      method: '',
      importVisible: false,
      upLoadText: {},
      url: '',
      importHeaders:'',
      methods: [
        {
          value: 1,
          label: 'is'
        },
        {
          value: 2,
          label: 'contains'
        },
      ]
    }
  },
  methods: {
    //初始化表格数据
    initData() {
      queryAllDataFileInDatesetOrProject({
        dataType: 2,
        labels: this.labelvalue && this.labelvalue.join(','),
        projectId: sessionStorage.getItem('projectId'),
        startNum: this.startNum,
        range: this.range,
        labelConnector: this.method,
        gt: {
          imageKey: this.imageKey,
        }
      }).then((res) => {
        if (res.state === 1000) {
          const data = res.data.gt.map((item) => {
            return {
              imageKey: item.imageKey,
              source: item.source,
              model: item.model,
              batch: item.batch,
              gtPath: item.gtPath,
              label: item.label,
              fileId: item.fileId,
              fileType: item.fileType === 0 ? 'pack' : (item.fileType === 1 ? 'image' : ''),
              fileName: item.fileName,
              imageKeyId: item.imageKeyId
            }
          })
          this.tableData = data
          this.total = res.data.total
        } else {
          this.$message({
            type: 'error',
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
    sizeChange(range) {
      this.range = range
      this.startNum = 1
      this.initData()
    },
    startNumChange(startNum) {
      this.startNum = startNum
      this.initData()
    },

    deleteGt(rowData) {
      this.$confirm('确定要删除此GT？', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delGt({
            packIds: [rowData.id],
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
    getLabel() {
      getAllLabel({
        labelVersionId: this.version
      }).then((res) => {
        if (res.state === 1000) {
          this.allLabel = res.data.allLabels
        }
      })
    },
    //点击打标签的按钮
    bindLabel(rowData) {
      this.bindLabelId = rowData.imageKeyId
      this.willBindData()
      this.havebindUserData = rowData.label && rowData.label.map(ele => {
        return {
          userName: ele.labelName,
          id: ele.labelId,
          labelPath: ele.labelPath,
          labelVersion: ele.labelVersion
        }
      })
      this.showSelectPeople = true
    },
    //刷新数据
    refreshData() {
      flushGt({
        projectId: sessionStorage.getItem('projectId')
      }).then(res => {
        if (res.state === 1000) {
          this.$message({
            type: 'success',
            message: '刷新成功'
          })
        } else {
          this.$message({
            type: 'erroe',
            message: res.message
          })
        }
      })
    },
    //关闭打标签的弹窗
    changeShowSelectPeople() {
      this.showSelectPeople = false
    },
    // 打标签的确定按钮
    commitBindPeople(data) {
      addGtLabel({
        imageKeyId: this.bindLabelId,
        labels: data.map(ele => ele.id)
      }).then(res => {
        if (res.state === 1000) {
          this.showSelectPeople = false
          setTimeout(() => {
            this.initData()
          }, 0)
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
          this.showSelectPeople = false
        }
      })
    },
    changeVersion(val) {
      this.getLabel()
    },
    //查询所有的标签版本
    getVersionList() {
      versionListByType({
        dataType: 6
      }).then(res => {
        if (res.state === 1000) {
          this.versions = res.data.labelVersions
        }
      })
    },
    selectLabels(val) {
      if (val.length) {
        this.disabledSelectMethods = false
        this.method = 2
      } else {
        this.disabledSelectMethods = true
        this.method = ''
      }
    },
    selectVersion(val) {
      getAllLabel({
        labelVersionId: val
      }).then((res) => {
        if (res.state === 1000) {
          this.allLabel = res.data.allLabels
        }
      })
      this.willBindData()
    },
    // 打标签可以选的数据
    willBindData() {
      this.bindUserData = this.allLabel.map(ele => {
        return {
          label: ele.labelPath,
          children: ele.labelInfo.map(ele => {
            return {
              label: ele.labelName,
              id: ele.labelId
            }
          })
        }
      })
    },
    handleClick(rowData) {
      this.$router.push({
        path: '/manage/gtDetail',
        query: {
          imageKeyId: rowData.imageKeyId,
          from: '/manage/gt'
        }
      })
    },
    beforeUploadFile(file) {
      this.fileName = file.name.slice(0, file.name.lastIndexOf('.'))
      const fileSize = file.size / 1024 / 1024 < 3
      const fileType = file.type === 'application/json'
      if (!fileSize) {
        this.$message.error('上传文件大小不能超过3MB!')
      }
      if (!fileType) {
        this.$message.error('上传文件只能json')
      }
      return fileSize && fileType
    },
    uploadSuccess(response) {
      if (response.state === 1000) {
        this.$message({
          showClose: true,
          message: '导入成功',
          type: 'success'
        })
        this.initData()
        this.importVisible = false
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
        this.importVisible = false
      }
    },
    // 导入前增加参数
    upLoadFile() {
      this.upLoadText = {
        accountName: sessionStorage.getItem('userAccount')
      }
    },
  },
  created() {
    this.initData()
    this.getVersionList()
    this.getLabel()
    this.url = baseUrl + '/data/gtBindDatas.action'
    this.importHeaders={token:sessionStorage.getItem('token')}
  },
}
</script>
<style lang="scss">
.imageContainer {
  margin: 20px;
  .bread{
    margin-bottom: 15px;
  }
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .el-input {
      width: 200px;
      margin-right: 20px;
    }
  }
  .tableContainer {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 20px;
  }
  .drawer {
    width: calc(100% - 250px);
    margin-left: 250px;
    overflow: auto;
    .drawerContainer {
      margin: 20px;
      overflow: auto;
      h4 {
        border-bottom: 2px solid blue;
        padding-bottom: 10px;
      }
      .handle {
        display: flex;
        justify-content: center;
        margin-top: 50px;
      }
    }
  }
}
</style>
