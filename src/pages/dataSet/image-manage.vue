<template>
  <div class="imageContainer">
        <div class="bread" v-if="this.$route.query.sceneId">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item  :to="{ path: '/manage/sceneManagement' }">场景管理</el-breadcrumb-item>
        <el-breadcrumb-item>Image数据管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bread" v-else-if="this.$route.path==='/manage/image'">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>Image数据管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bread" v-else-if="this.$route.query.datasetId">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item  :to="{ path: '/manage/dataset' }">数据集管理</el-breadcrumb-item>
        <el-breadcrumb-item>Image数据管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search" v-if="!this.$route.query.sceneId">
      <div>
        <el-input v-model="imageName" placeholder="image名称" clearable></el-input>
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
    <el-button type="primary" @click="refreshData" v-if="!this.$route.query.sceneId">刷新数据</el-button>
    <el-button type="primary" @click="bindDataset" v-if="this.$route.path === '/manage/image'">绑定数据集</el-button>
    <span style="color:red">{{ message }}</span>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
      class="tableContainer"
      @selection-change="handleSelectionChange"
      max-height="620"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        fixed
        prop="imageName"
        label="imageName"
        width="300"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
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
      <el-table-column
        prop="imagePath"
        label="imagePath"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="source" label="source" width="80" align="center"></el-table-column>
      <el-table-column prop="createTime" label="createTime" width="180" align="center"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        align="center"
        v-if="!this.$route.query.sceneId"
      >
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="deleteImage(scope.row)">删除</el-button> -->
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
    <el-dialog title="选择数据集" :visible.sync="dialogVisible" width="30%">
      <el-select v-model="selectData" placeholder="请选择数据集" filterable>
        <el-option
          v-for="item in selectDataset"
          :key="item.datasetId"
          :label="item.datasetName"
          :value="item.datasetId"
        ></el-option>
      </el-select>
      <p style="color:red">{{noselectDataset}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectDatasetOk">确 定</el-button>
      </span>
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
      :imageUrl="url"
      width="1900px"
    ></HitLabel>
  </div>
</template>
<script>
import {
  getAllLabel,
  getDataSetOptions,
  saveDatasInDataSet,
  connectSceneData,
  flushImage,
  addImageLabel,
  versionListByType,
  queryAllDataFileInDatesetOrProject
} from '../../api/api'
import HitLabel from '../../components/label/hit-label.vue'
import {baseUrl} from '../../util/http'
export default {
  components: {
    HitLabel
  },
  data() {
    return {
      imageName: '',
      allLabel: [],
      tableData: [],
      startNum: 1,
      range: 10,
      total: 0,
      labelvalue: '',
      multipleSelection: [], // 选择的数据
      message: '', // 没选择数据时提示信息
      noselectDataset: '',
      imageId: [], //选择的imageID
      selectDataset: [], //
      dialogVisible: false,
      selectData: '',  //绑定数据集时选的数据集
      bindUserData: [],
      havebindUserData: [],
      sendSearch: [],
      showSelectPeople: false,
      bindLabelId: '',
      versions: [],//获取的所有versions
      version: '',//选择的版本
      disabledSelectMethods: true,
      method: '',
      url:'',
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
      const path = this.$route.path
      if (path === '/manage/datasetDetail') {
        if (this.$route.query.datasetId) {
          queryAllDataFileInDatesetOrProject({
            labels: this.labelvalue && this.labelvalue.join(','),
            datasetId: this.$route.query.datasetId,
            startNum: this.startNum,
            range: this.range,
            labelConnector: this.method,
            image: {
              imageName: this.imageName
            }
          }).then((res) => {
            if (res.state === 1000) {
              this.tableData = res.data.image
              this.total = res.data.total
            } else {
              this.$message({
                type: 'error',
                message: res.message,
              })
            }
          })
        } else {
          connectSceneData({
            sceneId: this.$route.query.sceneId,
          }).then((res) => {
            if (res.state === 1000) {
              this.tableData = res.data.sceneData.image
              this.total = res.data.total
            } else {
              this.$message({
                type: 'error',
                message: res.message,
              })
            }
          })
        }
      } else if (path === '/manage/image') {
        queryAllDataFileInDatesetOrProject({
          dataType: 1,
          labels: this.labelvalue && this.labelvalue.join(','),
          projectId: sessionStorage.getItem('projectId'),
          startNum: this.startNum,
          range: this.range,
          labelConnector: this.method,
          image: {
            imageName: this.imageName
          }
        }).then((res) => {
          if (res.state === 1000) {
            this.tableData = res.data.image
            this.total = res.data.total
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            })
          }
        })
      }
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

    // 删除pack
    deleteImage(rowData) {
      this.$confirm('确定要删除此image？', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delImage({
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //点击绑定数据集
    bindDataset() {
      if (this.multipleSelection.length > 0) {
        this.message = ''
        this.imageId = this.multipleSelection.map((item) => item.id)
        getDataSetOptions({
          projectId: sessionStorage.getItem('projectId'),
          dataType: 1
        }).then((res) => {
          if (res.state === 1000) {
            this.selectDataset = res.data.dataSetList
          } else {
            this.$message({
              type: 'info',
              message: res.message,
            })
          }
        })
        this.dialogVisible = true
      } else {
        this.message = '请先选择数据'
      }
    },
    //绑定数据集弹窗的确定按钮
    selectDatasetOk() {
      if (this.selectData) {
        this.noselectDataset = ''
        saveDatasInDataSet({
          datasetId: this.selectData,
          image: this.imageId
        }).then((res) => {
          if (res.state === 1000) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.initData()
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            })
          }
          this.dialogVisible = false
          this.selectData = ''
          this.multipleSelection = []
        })
      } else {
        this.noselectDataset = '请选择image'
      }
    },
    //点击打标签的按钮
    bindLabel(rowData) {
      this.bindLabelId = rowData.id
      this.willBindData()
      this.url=baseUrl+'/data/previewImageFile.action'+'?imageId='+rowData.id
      this.havebindUserData = rowData.label && rowData.label.map(ele => {
        return {
          userName: ele.labelName,
          id: ele.labelId,
          labelPath: ele.labelPath,
          labelVersion:ele.labelVersion
        }
      })
      this.showSelectPeople = true
    },
    //刷新数据
    refreshData() {
      flushImage({
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
    commitBindPeople(user) {
      addImageLabel({
        imageId: this.bindLabelId,
        labels: user.map(ele => ele.id)
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
  },
  created() {
    this.initData()
    this.getVersionList()
    this.getLabel()
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
    margin-bottom: 15px;
    .el-input {
      width: 200px;
      margin-right: 20px;
    }
  }
  .tableContainer {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 15px;
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
