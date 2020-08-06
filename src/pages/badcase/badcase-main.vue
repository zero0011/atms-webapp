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
        <el-select
          v-model="badcaseVersionId"
          clearable
          placeholder="选择badcase版本"
          @change="changeBadcaseVersion"
        >
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
      empty-text="暂无数据,请先切换或创建badcase版本"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        fixed
        prop="badcaseName"
        label="名称"
        width="180"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="versionName"
        label="版本"
        width="150"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="labelBOS" label="标签" width="300" align="center">
        <template slot-scope="scope">
          <el-tag
            type="success"
            disable-transitions
            v-for="(label, index) in scope.row.labelBOS"
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
      <el-table-column prop="badcasePath" label="路径" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="问题描述" width="200" align="center">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.isSelected"
            v-model="scope.row.desc"
            @focus="focusEvent(scope.row)"
            @blur="blurEvent(scope.row)"
            v-focus
          ></el-input>
          <p @click="cellClick(scope.row)" style="width:180px;height:40px">{{scope.row.desc}}</p>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150" align="center">
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
    <el-dialog
      :visible.sync="showCanSelectUser"
      :show-close="false"
      class="bindUser"
      width="1900px"
      :close-on-press-escape="false"
    >
      <div class="container">
        <img :src="imageUrl" />
        <div class="left">
          <h2>{{ title1 }}</h2>
          <el-select
            v-model="versionValue"
            clearable
            placeholder="请选择"
            @change="getSelect"
            size="medium"
          >
            <el-option
              v-for="item in versions"
              :key="item.versionId"
              :label="item.versionName"
              :value="item.versionId"
            ></el-option>
          </el-select>
          <el-tree
            :data="canSelectUser"
            show-checkbox
            empty-text
            node-key="id"
            @check-change="getSelectNode"
            ref="tree"
          ></el-tree>
        </div>
        <div class="middle">
          <el-button type="primary" plain @click="addSelectUser">> 添加</el-button>
        </div>
        <div class="right">
          <h2>{{ title2 }}</h2>
          <div class="table">
            <el-table :data="haveSelectedUser" empty-text border height="550px">
              <el-table-column prop="labelVersion" label="版本" width="100" align="center"></el-table-column>
              <el-table-column prop="labelPath" label="所在标签组" width="260" align="center"></el-table-column>
              <el-table-column prop="labelName" label="标签名称" width="160" align="center"></el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button @click="deleteBindResourse(scope.$index)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="lastAndNext">
      <el-button @click="clickLeft" :disabled="index===0">上一个</el-button>
      <el-button
        @click="clickRight"
        :disabled="index === badcaseIds.length-1 || badcaseIds.length===0"
      >下一个</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogBindUser('close')">取 消</el-button>
        <el-button type="primary" @click="closeDialogBindUser('confirm')">确 定</el-button>
      </span>
    </el-dialog>
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
  getBadcaseIds,
  bindBadcaseLabel,
  badcaseDesc
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
      badcaseVersionId: '',
      allLabel: [],
      tableData: [],
      badcaseVersionList: [],
      startNum: 1,
      range: 10,
      total: 0,
      labelvalue: '',
      bindUserData: [],
      bindLabelId: 0,
      versions: [],//获取的所有标签版本versions
      version: '',//选择的标签版本
      disabledSelectMethods: true,
      dialogVisible: false,
      submitButtonDisabled: true,
      buttonDisabled: true,
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
      badcase: {
        versionName: '',
        versionDesc: ''
      },
      rules: {
        versionName: [
          { required: true, message: '请输入数据集名称', trigger: 'blur' },
        ]
      },
      badcaseIds: [],
      // 显示弹窗
      showCanSelectUser: false,
      // 可以选择的用户
      canSelectUser: [],
      // 临时存储可以选择的用户
      tempCanSelectUser: [],
      // 已经选择的用户
      haveSelectedUser: [],
      // 准备选择的用户
      prepareSelectUser: [],
      // 标题名称
      title1: '待选择标签',
      // 标题名称
      title2: '已选择标签',
      versionValue: '',
      input: '',
      count: 0,
      searchType: 0,
      labelOptions: [],
      imageUrl: '',
      index: 0
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
        versionId: this.badcaseVersionId,
        labelids: this.labelvalue && this.labelvalue.join(','),
        projectId: sessionStorage.getItem('projectId'),
        startNum: this.startNum,
        range: this.range,
        labelConnector: this.method,
        badcaseName: this.badcaseName
      }).then((res) => {
        if (res.state === 1000) {
          this.tableData = res.data.badcaseList.map(item => {
            return { ...item, isSelected: false }
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
      this.buttonDisabled = false
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
        versionId: this.badcaseVersionId,
        labelids: this.labelvalue && this.labelvalue.join(','),
        projectId: sessionStorage.getItem('projectId'),
        startNum: this.startNum,
        range: this.range,
        labelConnector: this.method,
        badcaseName: this.badcaseName
      }).then(res => {
        if (res.state === 1000) {
          const data = res.data.ids.map((item, index) => {
            this.badcaseIds.push({
              index,
              badcaseId: item
            })
          })
          const selectBadcase = this.badcaseIds.find((item, index) => {
            return item.badcaseId == this.bindLabelId
          })
          this.index = selectBadcase.index
        }
      })
      this.imageUrl = baseUrl + '/badcase/at/viewImage.action?badcaseId=' + this.bindLabelId
      this.selectHaveBindLabel()
      this.getBadcaseLabel()

      this.$nextTick(() => {
        this.showCanSelectUser = true
      })

    },
    //刷新数据
    refreshData() {
      flushBadcase({
        projectId: sessionStorage.getItem('projectId'),
        versionId: this.badcaseVersionId
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
    changeVersion(val) {
      this.getLabel()
    },
    changeBadcaseVersion() {
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
    createVersion() {
      this.dialogVisible = true
      this.badcase = {}
    },
    //创建badcase版本的确定按钮
    clickOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitButtonDisabled = true
          this.dialogVisible = false
          createBadcaseVersion({
            ...this.badcase,
            versionType: 7,
            creator: sessionStorage.getItem('userAccount'),
            projectId: sessionStorage.getItem('projectId')
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
    getAllBadcaseVersion() {
      getAllVersion({
        versionType: 7,
        projectId: sessionStorage.getItem('projectId')
      }).then(res => {
        if (res.state === 1000) {
          this.badcaseVersionList = res.data.versionList
        }
        this.badcaseVersionId = res.data.versionList && res.data.versionList[0].versionId
        if (this.badcaseVersionList.length > 0) {
          this.initData()
        }
      })
    },
    //分类汇总
    collection() {
      makeCollect({
        projectId: sessionStorage.getItem('projectId'),
        versionId: this.badcaseVersionId,
        labelids: this.labelvalue && this.labelvalue.join(','),
        labelConnector: this.method,
        badcaseName: this.badcaseName,
        userAccount:sessionStorage.getItem('userAccount')
      }).then(res => {
        if (res.state === 1000) {
          this.$message({
            type: 'success',
            message: '分类汇总成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    history() {
      this.$router.push({
        path: '/manage/badcaseHistory'
      })
    },
    focusEvent(row) {
      row.oldDesc = row.desc
    },
    blurEvent(row) {
      row.isSelected = !row.isSelected
      if (row.desc !== row.oldDesc) {
        badcaseDesc({
          badcaseId: row.id,
          badcaseDesc: row.desc
        }).then(res => {
          if (res.state === 1000) {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1000
            })
            this.initData()
          } else {
            this.$message({
              message: res.message,
              type: 'error',
              duration: 1000
            })
          }
        })

      }
    },
    cellClick(row) {
      row.isSelected = !row.isSelected
    },








    getSelect(val) {
      // this.$emit('selectVersion',val)
      this.getBadcaseLabel()
    },
    deleteBindResourse(index) {
      // 恢复禁用选项
      this.canSelectUser.map((ele) => {
        return {
          label: ele.label,
          children: ele.children.map((eleTwo) => {
            if (eleTwo.label === this.haveSelectedUser[index].labelName) {
              this.$set(eleTwo, 'disabled', false)
            }
          }),
        }
      })
      this.haveSelectedUser.splice(index, 1)
    },
    // 初始化时判断已经勾选的在可选择的列表中禁止选择
    stopSelect() {
      console.log(1111111111111)
      console.log(this.haveSelectedUser)
      console.log(this.canSelectUser)
      this.haveSelectedUser.forEach((eleOne) => {
        this.canSelectUser.map((eleTwo) => {
          return {
            label: eleTwo.label,
            children: eleTwo.children.map((eleThree) => {
              // if (eleOne.fullName === eleThree.label) {
              if (eleOne.labelId === eleThree.labelId) {
                this.$set(eleThree, 'disabled', true)
              }
            }),
          }
        })
      })
      this.count = 0
    },
    addSelectUser() {
      if (this.prepareSelectUser.length > 0) {
        let arr = []
        this.haveSelectedUser.forEach((ele) => {
          arr.push(ele.labelId)
        })
        let arr2 = []
        this.prepareSelectUser.forEach((ele) => {
          if (arr.indexOf(ele.labelId) < 0) {
            arr2.push({
              labelName: ele.label,
              labelId: ele.labelId,
              labelPath: ele.labelPath,
              labelVersion:
                ele.labelVersionName && ele.labelVersionName.versionName,
            })
          }
        })
        this.haveSelectedUser.push(...arr2)
        this.haveSelectedUser.forEach((eleOne) => {
          this.canSelectUser.map((eleTwo) => {
            return {
              label: eleTwo.label,
              children: eleTwo.children.map((eleThree) => {
                if (eleOne.labelId === eleThree.labelId) {
                  this.$set(eleThree, 'disabled', true)
                }
              }),
            }
          })
        })
        this.prepareSelectUser = []
      }
    },
    closeDialogBindUser(action) {
      if (action === 'close') {
        this.showCanSelectUser = false
        this.$nextTick(() => {
          this.canSelectUser = []
          this.haveSelectedUser = []
          this.prepareSelectUser = []
          this.tempCanSelectUser = []
          this.versionValue = ''
          this.count = 1
        })
        this.initData()
      }
      if (action === 'confirm') {
        addBadcaseLabel({
          badcaseId: this.bindLabelId,
          labels: this.haveSelectedUser.map(ele => ele.labelId)
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
        this.versionValue = ''
        this.showCanSelectUser = false
        this.initData()
      }
    },
    // 待选择的用户数组
    getSelectNode() {
      this.prepareSelectUser = []
      this.$refs.tree.getCheckedNodes().forEach((ele) => {
        if (ele.type === 'user') {
          this.prepareSelectUser.push(ele)
        }
      })
    },
    getBadcaseLabel() {
      getAllLabel({
        labelVersionId: this.versionValue,
      }).then((res) => {
        if (res.state === 1000) {
          this.labelOptions = res.data.allLabels
          this.canSelect()
        }
      })
    },
    canSelect() {
      this.canSelectUser = []
      this.canSelectUser = this.labelOptions.map((ele) => {
        return {
          label: ele.labelPath,
          children: ele.labelInfo.map((item) => {
            return {
              label: item.labelName,
              labelId: item.labelId,
              type: 'user',
              disabled: false,
              labelPath: ele.labelPath,
              labelVersionName: this.versions.find(
                (item) => item.versionId === this.versionValue
              ),
            }
          }),
        }
      })
      this.tempCanSelectUser = this.canSelectUser
      this.count += 1
    },
    // 查询已经绑定的标签
    selectHaveBindLabel() {
      bindBadcaseLabel({
        badcaseId: this.bindLabelId
      }).then(res => {
        if (res.state === 1000) {
          this.haveSelectedUser = res.data.labels
          this.count += 1
        }
      })
    },
    // 点击上一个 先提交上一次的数据
    clickLeft() {
       addBadcaseLabel({
          badcaseId: this.bindLabelId,
          labels: this.haveSelectedUser.map(ele => ele.labelId)
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
      this.versionValue = ''
      this.index--
      const last = this.badcaseIds.find((item, index) =>
        item.index === this.index
      )
      this.bindLabelId = last.badcaseId
      this.imageUrl = baseUrl + '/badcase/at/viewImage.action?badcaseId=' + this.bindLabelId
      this.canSelectUser = []
      this.haveSelectedUser = []
      this.prepareSelectUser = []
      this.tempCanSelectUser = []
      this.versionValue = ''
      this.count = 0
      this.selectHaveBindLabel()
      this.canSelect()
    },
    //点击下一个 先提交上一次的数据
    clickRight() {
       addBadcaseLabel({
          badcaseId: this.bindLabelId,
          labels: this.haveSelectedUser.map(ele => ele.labelId)
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
        this.versionValue = ''
      this.index++
      const next = this.badcaseIds.find((item, index) =>
        item.index === this.index
      )
      this.bindLabelId = next.badcaseId
      this.imageUrl = baseUrl + '/badcase/at/viewImage.action?badcaseId=' + this.bindLabelId
      this.$nextTick(()=>{
        this.canSelectUser = []
        this.haveSelectedUser = []
        this.prepareSelectUser = []
        this.tempCanSelectUser = []
        this.versionValue = ''
        this.count = 1
        this.selectHaveBindLabel()
        this.canSelect()
      })
    }
  },
  created() {
    this.getVersionList() //查询所有的标签版本
    this.getLabel()
    this.getAllBadcaseVersion()//查询所有的badcase版本
  },
  watch: {
    count(val) {
      if (val === 2) {
        this.stopSelect()
      }
    }
  }
}
</script>
<style lang="scss">
.badcaseContainer {
  margin: 20px;
  .bread {
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
  .container {
    display: flex;
    justify-content: center;
    img {
      width: 44%;
    }
    .packbroad {
      width: 44%;
      img {
        width: 100%;
        margin: 10px 0;
      }
    }

    .left {
      // width: 20%;
      margin-left: 10px;
      h2 {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: #ccc;
        margin: 0 0 10px;
      }
      .el-input {
        width: 320px;
      }
      .el-tree {
        width: 320px;
        height: 485px;
        border: 1px solid #dcdfe6;
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 10px;
      }
    }
    .middle {
      // width: 10%;
      height: 600px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 10px;
    }
    .right {
      // width: 30%;
      height: 600px;
      h2 {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: #ccc;
        margin: 0;
      }
      .table {
        width: 620px;
        height: 550px;
        .el-table {
          width: 620px;
          .el-table__body-wrapper {
            // height: 420px;
            overflow-y: auto;
            overflow-x: hidden;
          }
        }
      }
    }
  }
  .lastAndNext{
    margin: 20px 0 0 18%;
  }
}
</style>
