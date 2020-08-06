<template>
  <div class="sceneManagement">
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>场景管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="searchArea">
      <el-input placeholder="场景名称" v-model="sceneName" clearable></el-input>
      <el-select v-model="version" clearable placeholder="选择标签版本" @change="changeVersion">
        <el-option
          v-for="item in versions"
          :key="item.versionId"
          :label="item.versionName"
          :value="item.versionId"
        ></el-option>
      </el-select>
      <el-select v-model="label" placeholder="选择标签" multiple @change="selectLabels">
        <el-option-group
          v-for="(group, index) in labelOptions"
          :key="index"
          :label="group.labelPath"
        >
          <el-option
            v-for="item in group.labelInfo"
            :key="item.labelId"
            :label="item.labelName"
            :value="item.labelId"
          ></el-option>
        </el-option-group>
      </el-select>
      <el-select v-model="method" placeholder="查询方式" :disabled="disabledMethods">
        <el-option
          v-for="item in methods"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="filterSceneData">查询</el-button>
    </div>
    <div class="createScene">
      <el-button type="primary" @click="createScene">创建场景</el-button>
      <el-button type="primary" @click="bindSceneLibrary">绑定场景库</el-button>
      <span style="color:red">{{ message }}</span>
    </div>
    <el-dialog title="绑定场景库" :visible.sync="dialogShowVisible" width="30%">
      <el-select v-model="value1" placeholder="请选择" @change="selectSceneId">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <p style="color:red">{{ noSelectScene }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShowVisible = false">取 消</el-button>
        <el-button type="primary" @click="bindingSceneLibrary">确 定</el-button>
      </span>
    </el-dialog>
    <div class="tableArea">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        max-height="660"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="sceneName" label="场景名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="camera" label="采集摄像头" align="center" width="100"></el-table-column>
        <el-table-column prop="dataWc" label="数据工况" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建者" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roadWc" label="模型类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="realScene" label="应用场景" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="label" label="标签" align="center" width="300">
          <template slot-scope="scope">
            <el-tag
              type="success"
              disable-transitions
              v-for="(label, index) in scope.row.label"
              :key="index"
              style="margin-left: 10px;margin-bottom:5px"
            >
              <el-tooltip effect="dark" placement="top">
                <div
                  slot="content"
                >{{label.labelVersion}}--{{label.labelPath}}--{{ label.labelName }}</div>
                <span>{{ label.labelName }}</span>
              </el-tooltip>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="collectionCar"
          label="采集车辆类型"
          align="center"
          width="110"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="area" label="数据地域" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-button @click="bindLabel(scope.row)" type="text" size="small">打标签</el-button>
            <el-button @click="connectData(scope.row)" type="text" size="small">关联数据</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 20]"
      :page-size="currentSize"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="sizeChange"
      @current-change="pageChange"
    ></el-pagination>
    <div class="dialog">
      <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :show-close="false">
        <div class="create">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="场景名称" prop="sceneName">
              <el-input v-model="ruleForm.sceneName" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="采集摄像头" prop="collectCamera">
              <el-input v-model="ruleForm.collectCamera" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="数据工况" prop="dataType">
              <el-input v-model="ruleForm.dataType" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="细分路况" prop="roadCondition">
              <el-input v-model="ruleForm.roadCondition" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="模型类型" prop="modelType">
              <el-select v-model="ruleForm.modelType" placeholder="请选择模型类型">
                <el-option
                  v-for="item in models"
                  :key="item.modelId"
                  :label="item.modelName"
                  :value="item.modelId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="应用场景" prop="applicableScene">
              <el-input v-model="ruleForm.applicableScene" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="车辆类型" prop="carType">
              <el-input v-model="ruleForm.carType" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="数据地域" prop="dataArea">
              <el-input v-model="ruleForm.dataArea" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">创 建</el-button>
              <el-button @click="resetForm('ruleForm')">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="edit"></div>
      </el-dialog>
    </div>
    <SelectPeople
      :showSelectPeople="showSelectPeople"
      :bindUserData="bindUserData"
      :havebindUserData="havebindUserData"
      @changeShowSelectPeople="changeShowSelectPeople"
      @commitBindPeople="commitBindPeople"
      @searchFromComponent="getSearchFromComponent"
      @selectVersion="selectVersion"
      :getSearch="sendSearch"
      :versions="versions"
      width="1100px"
    ></SelectPeople>
  </div>
</template>

<script>
import SelectPeople from '../../components/label/hit-label.vue'
import {
  getAllLabelVersions,
  getAllLabel,
  searchSceneByProjectOrSceneLibrary,
  createScene,
  searchSceneLibrary,
  bindSceneBySceneLibrary,
  bindLabelByScene,
  versionListByType,
  getModel,
  connectSceneData
} from '../../api/api'
export default {
  components: {
    SelectPeople,
  },
  data() {
    return {
      sceneId: '',
      value1: '',
      options: [],
      dialogShowVisible: false,
      showSelectPeople: false,
      bindUserData: [],
      havebindUserData: [],
      sendSearch: [],
      sceneName: '',
      version: '',
      versions: [],
      label: [],
      currentPage: 1,
      currentSize: 10,
      total: 0,
      method: '',
      methods: [
        {
          value: 1,
          label: 'is',
        },
        {
          value: 2,
          label: 'contains',
        },
      ],
      disabledMethods: true,
      delayEnter: false,
      count: 2,
      labelOptions: [],
      title: '',
      dialogVisible: false,
      models: [],
      ruleForm: {
        sceneName: '',
        collectCamera: '',
        dataType: '',
        roadCondition: '',
        modelType: '',
        applicableScene: '',
        carType: '',
        dataArea: '',
      },
      rules: {
        sceneName: [
          {
            required: true,
            message: '请输入场景名称',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur',
          },
        ],
        collectCamera: [
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur',
          },
        ],
        dataType: [
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur',
          },
        ],
        roadCondition: [
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur',
          },
        ],
        applicableScene: [
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur',
          },
        ],
        carType: [
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur',
          },
        ],
        dataArea: [
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur',
          },
        ],
      },
      tableData: [],
      bindScene: '',
      message: '',
      noSelectScene: '',
    }
  },
  methods: {
    selectSceneId(id) {
      this.noSelectScene = ''
    },
    bindingSceneLibrary() {
      if (this.value1) {
        this.noSelectScene = ''
        bindSceneBySceneLibrary({
          sceneRepoId: this.value1,
          scene: this.bindScene,
        }).then((res) => {
          if (res.state === 1000) {
            this.$message({
              type: 'success',
              message: '绑定成功',
            })
            this.dialogShowVisible = false
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            })
            this.dialogShowVisible = false
          }
        })
      } else {
        this.noSelectScene = '请选择场景库'
      }
    },
    bindSceneLibrary() {
      if (this.bindScene) {
        this.message = ''
        searchSceneLibrary({
          repoName: '',
          startNum: 1,
          range: 1000,
          projectId: sessionStorage.getItem('projectId'),
        }).then((res) => {
          if (res.state === 1000) {
            this.options.splice(0, this.options.length)
            res.data.sceneRepoLists.forEach((ele) => {
              this.options.push({
                label: ele.sceneRepoName,
                value: ele.sceneRepoId,
              })
            })
          }
        })
        this.dialogShowVisible = true
      } else {
        this.message = '请选择场景'
      }
    },
    handleSelectionChange(val) {
      if (val.length) {
        this.bindScene = val.map((ele) => ele.id)
        // let arr = val.map(ele => ele.id)
        // this.bindScene = arr.join(',')
        // console.log(this.bindScene)
      }
    },
    getSearchFromComponent() { },
    commitBindPeople(user) {
      // let projectMember = []
      // if (user.length === 0) {
      //   projectMember = ''
      // } else {
      //   projectMember = user.map(ele => ele.fullName.split('(')[1].split(')')[0]).join(',')
      // }
      bindLabelByScene({
        sceneId: this.sceneId,
        labels: user.map((ele) => ele.id),
      }).then((res) => {
        if (res.state === 1000) {
          this.showSelectPeople = false
          setTimeout(() => {
            this.searchSceneByProjectOrSL()
          }, 0)
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          })
          this.showSelectPeople = false
        }
      })
      // addMemberInCurrentProjectByYearInput({
      //   projectId: this.projectId,
      //   projectMember
      // }).then(res => {
      //   if (res.state === 1000) {
      //     this.showSelectPeople = false
      //     setTimeout(() => {
      //       this.initGetYearData()
      //     })
      //   } else {
      //     this.netError()
      //   }
      // }, rej => {
      //   this.netError()
      // })
    },
    changeShowSelectPeople(bol) {
      this.showSelectPeople = false
    },
    bindLabel(rowData) {
      this.sceneId = rowData.id
      let arr2 = rowData.label
      this.willBindData()
      this.havebindUserData = arr2.map((ele) => {
        return {
          userName: ele.labelName,
          id: ele.id,
          labelPath: ele.labelPath,
          labelVersion: ele.labelVersion
        }
      })
      setTimeout(() => {
        this.showSelectPeople = true
      })
    },
    initData() {
      this.searchSceneByProjectOrSL()
      this.getLabels()
    },
    searchSceneByProjectOrSL() {
      let labelString = ''
      if (this.label.length) {
        labelString = this.label.join(',')
      }
      searchSceneByProjectOrSceneLibrary({
        sceneName: this.sceneName,
        labelConnector: this.method,
        labelIds: labelString,
        projectId: sessionStorage.getItem('projectId'),
        sceneRepoId: '',
        startNum: this.currentPage,
        range: this.currentSize,
      }).then((res) => {
        if (res.state === 1000) {
          this.tableData = res.data.sceneLists
          this.total = res.data.total
        }
      })
    },
    changeVersion(val) {
      this.getLabels()
      this.label = []
      this.disabledMethods = true
      this.method = ''
    },
    selectLabels(val) {
      if (val.length) {
        this.disabledMethods = false
        this.method = 2
      } else {
        this.disabledMethods = true
        this.method = ''
      }
    },
    getLabels() {
      getAllLabel({
        labelVersionId: this.version,
        labelName: '',
      }).then((res) => {
        if (res.state === 1000) {
          this.labelOptions = res.data.allLabels
        }
      })
    },
    filterSceneData() {
      this.searchSceneByProjectOrSL()
      // if (this.count === 2) {
      //   console.log(1)
      //   this.count = 1
      //   const setTimer = setInterval(() => {
      //     this.count = this.count - 1
      //     if (this.count === 0) {
      //       clearInterval(setTimer)
      //       this.count = 2
      //     }
      //   }, 1000)
      // }
    },
    createScene() {
      this.getModels()
      setTimeout(() => {
        this.dialogVisible = true
      }, 0)
    },
    getModels() {
      getModel().then((res) => {
        if (res.state === 1000) {
          this.models = res.data.models
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      setTimeout(() => {
        this.dialogVisible = false
      }, 0)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createScene({
            sceneName: this.ruleForm.sceneName,
            dataWc: this.ruleForm.dataType,
            roadWc: this.ruleForm.roadCondition,
            modelId: this.ruleForm.modelType,
            realScene: this.ruleForm.applicableScene,
            collectionCar: this.ruleForm.carType,
            area: this.ruleForm.dataArea,
            creator: sessionStorage.getItem('userAccount'),
            projectId: sessionStorage.getItem('projectId'),
            camera: this.ruleForm.collectCamera,
          }).then((res) => {
            if (res.state === 1000) {
              setTimeout(() => {
                this.dialogVisible = false
                this.$refs[formName].resetFields()
                this.initData()
              }, 0)
            }
          })
        } else {
          return false
        }
      })
    },
    connectData(rowData) {
      connectSceneData({
        sceneId: rowData.id,
      }).then((res) => {
        if (res.state === 1000) {
          console.log(res.data.sceneData)
          if (res.data.sceneData.pack) {
            this.$router.push({
              path: '/manage/datasetDetail',
              query: {
                sceneId: rowData.id,
                dataType: 'pack'
              },
            })
          }else if(res.data.sceneData.image){
            this.$router.push({
              path: '/manage/datasetDetail',
              query: {
                sceneId: rowData.id,
                dataType: 'image'
              },
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          })
        }
      })

    },
    //查询所有的标签版本
    getVersionList() {
      versionListByType({
        dataType: 6,
      }).then((res) => {
        if (res.state === 1000) {
          this.versions = res.data.labelVersions
        }
      })
    },
    sizeChange(size) {
      this.currentSize = size
      this.currentPage = 1
      this.initData()
    },
    pageChange(page) {
      this.currentPage = page
      this.initData()
    },
    selectVersion(val) {
      getAllLabel({
        labelVersionId: val
      }).then((res) => {
        if (res.state === 1000) {
          this.labelOptions = res.data.allLabels
        }
      })
      this.$nextTick(() => {
        this.willBindData()
      })

    },
    willBindData() {
      this.bindUserData = this.labelOptions.map((ele) => {
        return {
          label: ele.labelPath,
          children: ele.labelInfo.map((ele) => {
            return {
              label: ele.labelName,
              id: ele.labelId,
            }
          }),
        }
      })
    },
  },
  created() {
    this.initData()
    this.getVersionList()
    this.getLabels()
  },
}
</script>

<style lang="scss">
.sceneManagement {
  box-sizing: border-box;
  padding: 20px;
  .bread{
    margin-bottom: 15px;
  }
  .searchArea {
    width: 100%;
    margin-bottom: 15px;
    > .el-input {
      width: 20%;
      float: left;
      margin-right: 10px;
    }
    > .el-select {
      width: 20%;
      float: left;
      margin-right: 10px;
    }
    > .el-button {
      float: right;
    }
  }
  .searchArea::before,
  .searchArea::after {
    display: block;
    content: '';
    clear: both;
  }
  .createScene {
    margin-top: 15px;
  }
  .tableArea {
    margin: 10px 0;
  }
}
</style>
