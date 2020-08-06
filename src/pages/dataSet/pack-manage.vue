<template>
  <div class="packContainer">
    <div class="bread" v-if="this.$route.query.sceneId">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item  :to="{ path: '/manage/sceneManagement' }">场景管理</el-breadcrumb-item>
        <el-breadcrumb-item>PACK数据管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bread" v-else-if="this.$route.path==='/manage/pack'">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>PACK数据管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bread" v-else-if="this.$route.query.datasetId">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item  :to="{ path: '/manage/dataset' }">数据集管理</el-breadcrumb-item>
        <el-breadcrumb-item>PACK数据管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search" v-if="!this.$route.query.sceneId">
      <div>
        <el-input v-model="packName" placeholder="PACK名称" clearable></el-input>
        <el-input v-model="path" placeholder="路径" clearable></el-input>
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
        <el-button type="primary" @click="search">查询</el-button>
      </div>
      <el-button type="primary" @click="seniorSearch">高级查询</el-button>
    </div>
    <el-button type="primary" @click="refreshData" v-if="!this.$route.query.sceneId">刷新数据</el-button>
    <el-button type="primary" @click="bindDataset" v-if="this.$route.path === '/manage/pack'">绑定数据集</el-button>
    <span style="color:red">{{ message }}</span>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
      class="tableContainer"
      @selection-change="handleSelectionChange"
      max-height="650"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        fixed
        prop="packName"
        label="packName"
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
              <span> {{ label.labelName }}</span>
            </el-tooltip>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="path" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="source" label="source" width="80" align="center"></el-table-column>
      <el-table-column prop="imageHeight" label="imageHeight" width="120" align="center"></el-table-column>
      <el-table-column prop="imageWeight" label="imageWeight" width="120" align="center"></el-table-column>
      <el-table-column prop="focalLength" label="focalLength" width="120" align="center"></el-table-column>
      <el-table-column
        prop="imageIndex"
        label="imageIndex"
        width="120"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="frameNumber" label="frameNumber" width="125" align="center"></el-table-column>
      <el-table-column prop="frameRate" label="frameRate" width="110" align="center"></el-table-column>
      <el-table-column prop="collect_version" label="collect_version" width="125" align="center"></el-table-column>
      <el-table-column prop="totalNum" label="totalNum" width="110" align="center"></el-table-column>
      <el-table-column prop="misscanNum" label="misscanNum" width="120" align="center"></el-table-column>
      <el-table-column prop="canContime" label="canContime" width="110" align="center"></el-table-column>
      <el-table-column prop="ispLost" label="ispLost" width="110" align="center"></el-table-column>
      <el-table-column prop="timeLong" label="timeLong" width="110" align="center"></el-table-column>
      <el-table-column prop="mileage" label="mileage" width="110" align="center"></el-table-column>
      <el-table-column prop="minSpeed" label="minSpeed" width="110" align="center"></el-table-column>
      <el-table-column prop="maxSpeed" label="maxSpeed" width="125" align="center"></el-table-column>
      <el-table-column prop="averageSpeed" label="averageSpeed" width="125" align="center"></el-table-column>
      <el-table-column prop="cameraLoc" label="cameraLoc" width="110" align="center"></el-table-column>
      <el-table-column prop="cameraFov" label="cameraFov" width="110" align="center"></el-table-column>
      <el-table-column prop="softVersion" label="softVersion" width="110" align="center"></el-table-column>
      <el-table-column
        prop="createTime"
        label="createTime"
        width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="have_raw12" label="have_raw12" width="110" align="center"></el-table-column>
      <el-table-column prop="hour" label="hour" width="145" align="center"></el-table-column>
      <el-table-column prop="label_status" label="label_status" width="145" align="center"></el-table-column>
      <el-table-column prop="predict_status" label="predict_status" width="145" align="center"></el-table-column>
      <el-table-column prop="soft_version" label="soft_version" width="145" align="center"></el-table-column>
      <el-table-column prop="create_time" label="create_time" width="145" align="center"></el-table-column>-->
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        align="center"
        v-if="!this.$route.query.sceneId"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="deletePack(scope.row)">删除</el-button>
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
    <el-drawer
      :visible.sync="drawerVisible"
      direction="ttb"
      class="drawer"
      :with-header="false"
      size="60%"
    >
      <div class="drawerContainer">
        <h4>高级查询</h4>
        <el-form ref="form" :model="form" label-width="200px" :inline="true">
          <el-form-item label="摄像头路数" prop="imageIndex">
            <el-input v-model="form.imageIndex"></el-input>
          </el-form-item>
          <el-form-item label="图像宽度" prop="imageWeight">
            <el-input v-model="form.imageWeight"></el-input>
          </el-form-item>
          <el-form-item label="图像高度" prop="imageHeight">
            <el-input v-model="form.imageHeight"></el-input>
          </el-form-item>
          <el-form-item label="帧数" prop="frameNumber">
            <el-input v-model="form.frameNumber"></el-input>
          </el-form-item>
          <el-form-item label="帧率" prop="frameRate">
            <el-input v-model="form.frameRate"></el-input>
          </el-form-item>
          <el-form-item label="missCan" prop="missCan">
            <el-input v-model="form.missCan"></el-input>
          </el-form-item>
          <el-form-item label="采集版本" prop="collectioVersion">
            <el-input v-model="form.collectioVersion"></el-input>
          </el-form-item>
          <el-form-item label="can持续时间" prop="canConTime">
            <el-input v-model="form.canConTime"></el-input>
          </el-form-item>
          <el-form-item label="最小时速" prop="minSpeed">
            <el-input v-model="form.minSpeed"></el-input>
          </el-form-item>
          <el-form-item label="最大时速" prop="maxSpeed">
            <el-input v-model="form.maxSpeed"></el-input>
          </el-form-item>
          <el-form-item label="摄像头位置" prop="cameraLoc">
            <el-input v-model="form.cameraLoc"></el-input>
          </el-form-item>
        </el-form>
        <div class="handle">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="searchOk('form')">查询</el-button>
        </div>
      </div>
    </el-drawer>
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
      :havebindUserData="havebindUserData"
      @changeShowSelectPeople="changeShowSelectPeople"
      :getSearch="sendSearch"
      @commitBindPeople="commitBindPeople"
      @selectVersion ="selectVersion"
      :url="url"
      :versions="versions"
      :frameNumber="frameNumber"
      width="1900px"
    ></HitLabel>
  </div>
</template>
<script>
import {
  getAllLabel,
  delPack,
  saveDatasInDataSet,
  playPack,
  connectSceneData,
  flushPack,
  bindLabelByPack,
  versionListByType,
  queryAllDataFileInDatesetOrProject,
  getDataSetOptions
} from '../../api/api'
import HitLabel from '../../components/label/hit-label.vue'
export default {
  components: {
    HitLabel
  },
  data() {
    return {
      packName: '',
      path: '',
      allLabel: [],
      tableData: [],
      startNum: 1,
      range: 10,
      total: 0,
      labelvalue: '',
      drawerVisible: false,
      multipleSelection: [], // 选择的数据
      message: '', // 没选择数据时提示信息
      noselectDataset: '',
      packId: [], //选择的packID
      selectDataset: [], //
      dialogVisible: false,
      selectData: '',
      url: '',
      bindUserData: [],
      havebindUserData: [],
      sendSearch: [],
      showSelectPeople: false,
      bindLabelId: '',
      versions: [],//获取的所有versions
      version: '',//选择的版本
      disabledSelectMethods: true,
      method: '',
      frameNumber:0,
      methods: [
        {
          value: 1,
          label: 'is'
        },
        {
          value: 2,
          label: 'contains'
        },
      ],
      form: {
        imageIndex: '',
        imageWeight: '',
        imageHeight: '',
        frameNumber: '',
        frameRate: '',
        missCan: '',
        collectioVersion: '',
        canConTime: '',
        minSpeed: '',
        maxSpeed: '',
        cameraLoc: '',
      }
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
            pack: {
              ...this.form,
              packName: this.packName,
              path: this.path
            }
          }).then((res) => {
            if (res.state === 1000) {
              this.tableData = res.data.packLists
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
              this.tableData = res.data.sceneData.pack
              this.total = res.data.total
            } else {
              this.$message({
                type: 'error',
                message: res.message,
              })
            }
          })
        }
      } else if (path === '/manage/pack') {
          queryAllDataFileInDatesetOrProject({
          dataType: 0,
          labels: this.labelvalue && this.labelvalue.join(','),
          projectId: sessionStorage.getItem('projectId'),
          startNum: this.startNum,
          range: this.range,
          labelConnector: this.method,
          pack: {
            ...this.form,
            packName: this.packName,
            path: this.path,
          }
        }).then((res) => {
          if (res.state === 1000) {
            this.tableData = res.data.packLists
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
    deletePack(rowData) {
      this.$confirm('确定要删除此pack？', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delPack({
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
    seniorSearch() {
      this.drawerVisible = true
    },
    searchOk(formName) {
      this.drawerVisible = false
      this.initData()
      this.$refs[formName].resetFields()
    },
    bindDataset() {
      if (this.multipleSelection.length > 0) {
        this.message = ''
        this.packId = this.multipleSelection.map((item) => item.id)
        getDataSetOptions({
          projectId: sessionStorage.getItem('projectId'),
          dataType: 0
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
    selectDatasetOk() {
      if (this.selectData) {
        this.noselectDataset = ''
        saveDatasInDataSet({
          datasetId: this.selectData,
          pack: this.packId,
        }).then((res) => {
          if (res.state === 1000) {
            this.$message({
              type: 'success',
              message: res.message,
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
        this.noselectDataset = '请选择pack'
      }
    },
    bindLabel(rowData) {
      this.frameNumber=rowData.frameNumber
      this.bindLabelId = rowData.id
      playPack({ packId: rowData.id }).then((res) => {
        if (res.state === 1000) {
          this.url = res.data.path
        }
      })
      this.willBindData()
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
    refreshData() {
      flushPack({
        projectId:sessionStorage.getItem('projectId')
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
      bindLabelByPack({
        packId: this.bindLabelId,
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
    selectVersion(val){
      getAllLabel({
        labelVersionId: val
      }).then((res) => {
        if (res.state === 1000) {
          this.allLabel = res.data.allLabels
        }
      })
      // this.willBindData()
    },
    willBindData(){
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
.packContainer {
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
      max-width: 200px;
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
