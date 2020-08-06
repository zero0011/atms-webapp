<template>
  <div class="selectPeople">
    <el-dialog
      :visible.sync="showCanSelectUser"
      :show-close="false"
      class="bindUser"
      width="1900px"
      :close-on-press-escape="false"
      @open="open"
    >
      <div class="container">
        <img :src="imageUrl"/>
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
              <el-table-column prop="fullName" label="标签名称" width="160" align="center"></el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button @click="deleteBindResourse(scope.$index)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <el-button @click="clickLeft">上一个</el-button>
      <el-button @click="clickRight">下一个</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogBindUser('close')">取 消</el-button>
        <el-button type="primary" @click="closeDialogBindUser('confirm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllLabel,bindBadcaseLabel } from '../../api/api'
import { baseUrl } from '../../util/http'
export default {
  props: {
    showSelectPeople: {
      type: Boolean,
      required: true,
    },
    // 'bindUserData': {
    //   type: Array,
    //   required: true
    // },
    frameNumber: {
      type: Number,
    },
    versions: {
      type: Array,
      required: true,
    },
    badcaseIds:{
      type:Array,
      required:true
    },
    bindLabelId:{
      type:Number,
      required:true
    },
  },
  data() {
    return {
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
      total: 0,
      searchType: 0,
      labelOptions: [],
      imageUrl:'',
      index:0,
      allBadCaseIds:[]
    }
  },
  methods: {
    getSelect(val) {
      // this.$emit('selectVersion',val)
      this.getLabel()
    },
    deleteBindResourse(index) {
      // 恢复禁用选项
      this.canSelectUser.map((ele) => {
        return {
          label: ele.label,
          children: ele.children.map((eleTwo) => {
            if (eleTwo.label === this.haveSelectedUser[index].fullName) {
              this.$set(eleTwo, 'disabled', false)
            }
          }),
        }
      })
      this.haveSelectedUser.splice(index, 1)
    },
    // 初始化时判断已经勾选的在可选择的列表中禁止选择
    stopSelect() {
      console.log(444444444444)
      this.haveSelectedUser.forEach((eleOne) => {
        this.canSelectUser.map((eleTwo) => {
          return {
            label: eleTwo.label,
            children: eleTwo.children.map((eleThree) => {
              // if (eleOne.fullName === eleThree.label) {
              if (eleOne.id === eleThree.id) {
                this.$set(eleThree, 'disabled', true)
              }
            }),
          }
        })
      })
      this.total = 0
    },
    addSelectUser() {
      if (this.prepareSelectUser.length > 0) {
        let arr = []
        this.haveSelectedUser.forEach((ele) => {
          arr.push(ele.id)
        })
        let arr2 = []
        this.prepareSelectUser.forEach((ele) => {
          if (arr.indexOf(ele.id) < 0) {
            arr2.push({
              fullName: ele.label,
              id: ele.id,
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
                if (eleOne.id === eleThree.id) {
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
        this.$emit('changeShowSelectPeople', false)
        this.$nextTick(() => {
          this.canSelectUser = []
          this.haveSelectedUser = []
          this.prepareSelectUser = []
          this.tempCanSelectUser = []
          this.versionValue = ''
          this.count = 1
        })
      }
      if (action === 'confirm') {
        this.$emit('commitBindPeople', this.haveSelectedUser)
        this.versionValue = ''
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
    getLabel() {
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
              id: item.labelId,
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
      this.total += 1
    },
    // 查询已经绑定的标签
    selectHaveBindLabel(){
      bindBadcaseLabel({
        badcaseId:this.bindLabelId
      }).then(res=>{
        if(res.state===1000){
          this.haveSelectedUser= res.data.bindLabels
          this.total += 1
        }
      })
    },
    // 点击上一个
    clickLeft(){
      this.index--
      const last = this.allBadCaseIds.find((item,index)=>
        item.index === this.index
      )
      const badcaseId = last.badcaseId
      this.imageUrl= baseUrl+'/badcase/at/viewImage.action?badcaseId='+badcaseId
      this.selectHaveBindLabel()
      this.canSelectUser = []
      this.haveSelectedUser = []
      this.prepareSelectUser = []
      this.tempCanSelectUser = []
      this.versionValue = ''
      this.count = 1
    },
    //点击下一个
    clickRight(){
      console.log(this.allBadCaseIds)
      console.log(this.badecaseIds)
      this.index++
      const next = this.allBadCaseIds.find((item,index)=>
        item.index === this.index
      )
      const badcaseId = next.badcaseId
      console.log(next)
      this.imageUrl= baseUrl+'/badcase/at/viewImage.action?badcaseId='+badcaseId
      this.selectHaveBindLabel()
      this.$nextTick(() => {
          this.canSelectUser = []
          this.haveSelectedUser = []
          this.prepareSelectUser = []
          this.tempCanSelectUser = []
          this.versionValue = ''
          this.count = 1
        })
    },
    open(){
      console.log(this.badcaseIds)
      console.log(this.bindLabelId)
      const aa = this.bindLabelId
      this.allBadCaseIds = this.badcaseIds
      console.log(this.allBadCaseIds)
      const selectBadcase = this.badcaseIds.find((item,index)=>{
        return item.badcaseId==aa
        })
      console.log(selectBadcase)
      // this.index = selectBadcase.index
    }
  },
  watch: {
    url(val) {
      this.packUrl = val
    },
    showSelectPeople(val) {
      this.showCanSelectUser = val
      this.searchType = 1
      this.getLabel()  
    },
    // havebindUserData(val) {
    //   this.haveSelectedUser = []
    //   this.haveSelectedUser.push(
    //     ...val.map((ele) => {
    //       return {
    //         // fullName: ele.userName + '(' + ele.accountName + ')'
    //         fullName: ele.userName,
    //         id: ele.id,
    //         labelPath: ele.labelPath,
    //         labelVersion: ele.labelVersion,
    //       }
    //     })
    //   )
    //   // console.log(this.haveSelectedUser)
    //   this.total += 1
    // },
    total(val) {
      if (val === 2) {
        this.stopSelect()
      }
    },
    // badcaseIds(val){
    //   console.log(val)
    //   this.allids=val 
    //   console.log(this.allids)
    // },
    bindLabelId(val){
      // console.log(this.allids)
      // const selectBadcase = this.allids.find(item=>item.badcaseId===this.bindLabelId)
      // console.log(selectBadcase)
      // this.index = selectBadcase.index
      this.imageUrl= baseUrl+'/badcase/at/viewImage.action?badcaseId='+this.bindLabelId  
      console.log(this.imageUrl)  
    },
  },
  created() {
    this.getLabel()
  },
}
</script>

<style lang="scss">
.selectPeople {
  .container {
    display: flex;
    justify-content: center;
    img{
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
}
</style>
