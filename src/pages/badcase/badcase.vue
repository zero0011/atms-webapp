<template>
  <div class="badcaseContainer">
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>badcase管理</el-breadcrumb-item>
        <el-breadcrumb-item>算法测试badcase</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search">
      <div>
        <el-select v-model="badcaseVersionId" clearable placeholder="选择badcase版本" @change="changeBadcaseVersion">
          <el-option
            v-for="item in badcaseVersionList"
            :key="item.versionId"
            :label="item.versionName"
            :value="item.versionId"
          ></el-option>
        </el-select>
        <el-input v-model="badcaseName" placeholder="badcase名称" clearable></el-input>
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
    <el-button type="primary" @click="createVersion">创建版本</el-button>
    <el-button type="primary" @click="refreshData" :disabled="badcaseVersionId.length===0">刷新数据</el-button>
    <el-button type="primary" @click="collection" :disabled="buttonDisabled">分类汇总</el-button>
    <el-button type="primary" @click="history">分类历史</el-button>  
    <el-table
      :data="tableData"
      border
      :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
      class="tableContainer"
      max-height="650"
      empty-text="暂无数据,请先创建badcase版本"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="badcaseName" label="名称" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="versionName" label="版本" width="180" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="labels" label="标签" width="300" align="center">
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
      <el-table-column prop="model" label="模型" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="badcasePath"
        label="路径"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="desc"
        label="问题描述"
        width="200"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-if="scope.row.isSelected" v-model="scope.row.desc" @focus="focusEvent(scope.row)" @blur="blurEvent(scope.row)" v-focus></el-input>
          <p @click="cellClick(scope.row)" v-else>{{scope.row.desc}}</p>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="deleteBadcase(scope.row)">删除</el-button>
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
    <el-dialog
      :title="'创建版本'"
      :visible.sync="dialogVisible"
      width="30%"
      @open="submitButtonDisabled = false"
    >
      <el-form ref="form" :model="badcase" label-width="100px" :rules="rules">
        <el-form-item label="版本名称" prop="versionName">
          <el-input v-model="badcase.versionName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="badcase.versionDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel('form')">取 消</el-button>
        <el-button type="primary" @click="clickOk('form')" :disabled="submitButtonDisabled">确 定</el-button>
      </span>
    </el-dialog>
    <BadcaseLabel
      :showSelectPeople="showSelectPeople"
      :bindUserData="bindUserData"
      @changeShowSelectPeople="changeShowSelectPeople"
      @commitBindPeople="commitBindPeople"
      @selectVersion="selectVersion"
      :versions="versions"
      :bindLabelId="bindLabelId"
      :badcaseIds="badcaseIds"
    ></BadcaseLabel>
  </div>
</template>
<script>
import {
  getAllLabel,
  delBadcase,
  flushBadcase,
  addBadcaseLabel,
  versionListByType,
  createBadcaseVersion,
  getAllCase,
  getAllVersion,
  makeCollect,
  getBadcaseIds
} from '../../api/api'
import { baseUrl } from '../../util/http'
import BadcaseLabel from '../../components/label/badcase-label.vue'
export default {
  components: {
    BadcaseLabel
  },
  data() {
    return {
      badcaseName: '',
      badcaseVersionId:'',
      allLabel: [],
      tableData: [],
      badcaseVersionList:[],
      startNum: 1,
      range: 10,
      total: 0,
      labelvalue: '',
      bindUserData: [],
      bindLabelId: 0,
      versions: [],//获取的所有versions
      version: '',//选择的版本
      showSelectPeople: false,
      disabledSelectMethods: true,
      dialogVisible:false,
      submitButtonDisabled: true,
      buttonDisabled:true,
      method: '',
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
      badcase:{
        versionName:'',
        versionDesc:''
      },
      rules: {
        versionName: [
          { required: true, message: '请输入数据集名称', trigger: 'blur' },
        ]
      },
      badcaseIds:[]
    }
  },
  // 自定义指令
   directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
      }
    }
  },
  methods: {
    //初始化表格数据
    initData() {
      getAllCase({
        versionId:this.badcaseVersionId,
        labelids: this.labelvalue && this.labelvalue.join(','),
        projectId: sessionStorage.getItem('projectId'),
        startNum: this.startNum,
        range: this.range,
        labelConnector: this.method,
        badcaseName:this.badcaseName
      }).then((res) => {
        if (res.state === 1000) {
          this.tableData = res.data.badcaseList.map(item=>{
            return {...item,isSelected:false}
          })
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
      this.buttonDisabled=false
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
    // 删除badcase
    deleteBadcase(rowData) {
      this.$confirm('确定要删除此Badcase？', '重要操作警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delBadcase({
            badcaseId: rowData.id,
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
      this.bindLabelId = rowData.id
      getBadcaseIds({
        versionId:this.badcaseVersionId,
        labelids: this.labelvalue && this.labelvalue.join(','),
        projectId: sessionStorage.getItem('projectId'),
        startNum: this.startNum,
        range: this.range,
        labelConnector: this.method,
        badcaseName:this.badcaseName
      }).then(res=>{
        if(res.state===1000){
          const data = res.data.ids.map((item,index)=>{
            this.badcaseIds.push({
              index,
              badcaseId:item
            })
          })
        }
      })
      // this.willBindData()
      this.showSelectPeople = true
    },
    //刷新数据
    refreshData() {
      flushBadcase({
        projectId: sessionStorage.getItem('projectId'),
        versionId:this.badcaseVersionId
      }).then(res => {
        if (res.state === 1000) {
          this.$message({
            type: 'success',
            message: '刷新成功'
          })
        } else {
          this.$message({
            type: 'error',
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
      addBadcaseLabel({
        badcaseId: this.bindLabelId,
        labels: data.map(ele => ele.id)
      }).then(res => {
        if (res.state === 1000) {
          this.$message({
            type: 'success',
            message: res.message
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    changeVersion(val) {
      this.getLabel()
    },
    changeBadcaseVersion(){
      this.initData()
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
    },
    //弹窗取消按钮
    clickCancel(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    //点击创建版本按钮
    createVersion(){
      this.dialogVisible=true
      this.badcase={}
    },
    //创建badcase版本的确定按钮
    clickOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitButtonDisabled = true
          this.dialogVisible = false
            createBadcaseVersion({
              ...this.badcase,
              versionType:7,
              creator:sessionStorage.getItem('userAccount'),
              projectId:sessionStorage.getItem('projectId')
            }).then((res) => {
              if (res.state === 1000) {
                this.$message({
                  type: 'success',
                  message: '创建成功',
                  duration: 1000,
                })
                this.getAllBadcaseVersion()
                // this.initData()
              } else {
                this.$message({
                  type: 'error',
                  message: res.message,
                  duration: 1000,
                })
              }
            })
        }
      })
    },
    //获取所有的badcase版本
    getAllBadcaseVersion(){
      getAllVersion({
        versionType:7,
        projectId:sessionStorage.getItem('projectId')
      }).then(res=>{
        if(res.state===1000){
          this.badcaseVersionList=res.data.versionList
        }
        this.badcaseVersionId=res.data.versionList&&res.data.versionList[0].versionId
        if(this.badcaseVersionList.length>0){
          this.initData()
        }
      })
    },
    //分类汇总
    collection(){
      makeCollect({
        projectId:sessionStorage.getItem('projectId')
      }).then(res=>{
        if(res.state===1000){
          this.$message({
            type:'success',
            message:'分类汇总成功'
          })
        }else{
          this.$message({
            type:'error',
            message:res.message
          })
        }
      })
    },
    history(){
      this.$router.push({
        path:'/manage/badcaseHistory'
      })
    },
    focusEvent (row) {
      row.oldDesc = row.desc
    },
    blurEvent (row) {
      row.isSelected = !row.isSelected
      if (row.desc !== row.oldDesc) {
        badcaseDesc({
          badcaseId:row.badcaseId,
          badcaseDesc:row.desc
        }).then(res=>{
          if(res.state===1000){
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            })
          }else{
            this.$message({
              message: res.message,
              type: 'error',
              duration: 1000
            })
          }
        })

      }
    },
    cellClick (row) {
      row.isSelected = !row.isSelected
    }
  },
  created() {
    this.getVersionList() //查询所有的标签版本
    this.getLabel() 
    this.getAllBadcaseVersion()//查询所有的badcase版本
  },
}
</script>
<style lang="scss">
.badcaseContainer {
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
