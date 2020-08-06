<template>
  <div class="scene">
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>场景数据管理</el-breadcrumb-item>
        <el-breadcrumb-item  :to="{ path: '/manage/sceneLibrary' }">场景库管理</el-breadcrumb-item>
        <el-breadcrumb-item>场景管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="searchArea">
      <el-input placeholder="场景名称" v-model="sceneNameT" clearable></el-input>
      <el-button type="primary" @click="filterSceneData">查询</el-button>
    </div>
    <div class="tableArea">
      <el-table :data="tableData" border style="width: 100%">
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
            <el-button @click="connectData(scope.row)" type="text" size="small">关联数据</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="returnButton">
      <el-button type="primary" @click="returnLastPage">返回</el-button>
    </div>
  </div>
</template>

<script>
import HitLabel from '../../components/label/hit-label.vue'
import { searchSceneByProjectOrSceneLibrary,connectSceneData } from '../../api/api'
export default {
  components: {
    HitLabel
  },
  data() {
    return {
      sceneNameT: '',
      sceneRepoId: '',
      dataCamera: '',
      belongSceneLibrary: '',
      tableData: [],
      title: '',
      dialogVisible: false,
      ruleForm: {
        sceneName: '',
        collectCamera: '',
        dataType: '',
        roadCondition: '',
        modelType: '',
        applicableScene: '',
        carType: '',
        dataArea: ''
      },
      rules: {
        sceneName: [
          {
            required: true,
            message: '请输入场景名称',
            trigger: 'blur'
          }, {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur'
          }
        ],
        collectCamera: [
          {
            required: true,
            message: '请输入采集摄像头',
            trigger: 'blur'
          }, {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur'
          }
        ],
        dataType: [
          {
            required: true,
            message: '请输入数据工况',
            trigger: 'blur'
          }, {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur'
          }
        ],
        roadCondition: [
          {
            required: true,
            message: '请输入细分路况',
            trigger: 'blur'
          }, {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur'
          }
        ],
        modelType: [
          { required: true, message: '请选择模型类型', trigger: 'change' }
        ],
        applicableScene: [
          {
            required: true,
            message: '请输入应用场景',
            trigger: 'blur'
          }, {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur'
          }
        ],
        carType: [
          {
            required: true,
            message: '请输入车辆类型',
            trigger: 'blur'
          }, {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur'
          }
        ],
        dataArea: [
          {
            required: true,
            message: '请输入数据地域',
            trigger: 'blur'
          }, {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur'
          }
        ],
      },
      path: '',
      sceneName: '',
      innerVisible: false,
      showHitLabel: false
    }
  },
  methods: {
    initeData() {
      searchSceneByProjectOrSceneLibrary({
        sceneName: this.sceneNameT,
        labelConnector: '',
        labelIds: '',
        projectId: '',
        sceneRepoId: this.sceneRepoId,
        startNum: 1,
        range: 50
      }).then(res => {
        if (res.state === 1000) {
          this.tableData = res.data.sceneLists
        }
      })
    },
    createScene() {
      setTimeout(() => {
        this.dialogVisible = true
      }, 0)
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
            // sceneName:场景名称,
            // dataWc:数据工况,
            // roadWc:细分路况,
            // modelId:10001,
            // realScene:应用场景,
            // collectionCar:采集车辆类型,
            // area:地域,
            // creator:xinyu.xu,
            // projectId:100000,
            // camera:摄像头1
          })
          setTimeout(() => {
            // this.ruleForm.sceneLibraryName = '',
            // this.ruleForm.sceneLibraryDescription = ''
            this.dialogVisible = false
          }, 0);
        } else {
          return false
        }
      })
    },
    beforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          // this.ruleForm.sceneLibraryName = '',
          // this.ruleForm.sceneLibraryDescription = ''
          done()
        })
        .catch(_ => { })
    },
    filterSceneData() {
    },
    editScene() {
    },
    deleteScene() {
    },
    connectData(rowData) {
      connectSceneData({
        sceneId: rowData.id,
      }).then((res) => {
        if (res.state === 1000) {
          if (res.data.sceneData.pack) {
            this.$router.push({
              path: '/manage/datasetDetail',
              query: {
                sceneId: rowData.id,
                dataType: 'pack'
              },
            })
          } else if (res.data.sceneData.image) {
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
    returnLastPage() {
      this.$router.push({
        path: this.path
      })
    },
    openHitLabel() {
      this.showHitLabel = true
    }
  },
  created() {
    if (this.$route.query.from === '/manage/sceneLibrary') {
      // this.sceneRepId = this.$route.query.sceneRepId
      this.path = this.$route.query.from
      this.sceneName = this.$route.query.sceneName
      this.sceneRepoId = this.$route.query.sceneRepoId
    }
    this.initeData()
  }
}
</script>

<style lang="scss">
.scene {
  box-sizing: border-box;
  padding: 20px;
  .bread{
    margin-bottom: 15px;
  }
  .searchArea {
    width: 100%;
    .el-input {
      width: 20%;
      float: left;
    }
    .el-input:nth-of-type(1),
    .el-input:nth-of-type(2) {
      margin-right: 50px;
    }
    .el-button {
      float: right;
    }
  }
  .searchArea::before,
  .searchArea::after {
    display: block;
    content: '';
    clear: both;
  }
  .tableArea {
    widows: 100%;
    margin: 10px 0px 10px 0px;
  }
  .returnButton {
    width: 100%;
    margin-top: 40px;
    text-align: center;
  }
}
</style>