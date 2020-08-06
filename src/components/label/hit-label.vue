<template>
  <div class="selectPeople">
    <el-dialog
      :visible.sync="showCanSelectUser"
      :show-close="false"
      class="bindUser"
      :width="width"
      :close-on-press-escape="false"
    >
      <div class="container">
        <img :src="imageUrl" v-if="imageUrl"/>
        <div class="packbroad" v-if="url">
          <!-- <el-button>
            <i class="el-icon-caret-left"></i>
          </el-button>-->
          <div style="text-align: center">
            <el-button @click="handle">
              {{pause === 0 ? '暂停' : '播放'}}
            </el-button>
            <el-button @click="handleFast" :disabled="count === 2">
              <i class="el-icon-caret-right"></i>
            </el-button>
          </div>
          <img :src="packUrl" />
          <vue-slider v-model="value" @drag-end="change()" ref="slider" drag-on-click/>
        </div>
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
          <!-- <el-input v-model="input" placeholder="请输入内容，回车键搜索" size="mini" @keyup.native.enter="searchUsers"></el-input> -->
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogBindUser('close')">取 消</el-button>
        <el-button type="primary" @click="closeDialogBindUser('confirm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { getAllLabel } from '../../api/api'
export default {
  components: {
    VueSlider
  },
  props: {
    showSelectPeople: {
      type: Boolean,
      required: true,
    },
    // 'bindUserData': {
    //   type: Array,
    //   required: true
    // },
    havebindUserData: {
      type: Array,
      required: true,
    },
    getSearch: {
      type: Array,
      required: true,
    },
    url: {
      type: String,
    },
    imageUrl:{
      type:String
    },
    frameNumber: {
      type: Number,
    },
    versions: {
      type: Array,
      required: true,
    },
    width: {
      type: String,
      required: false,
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
      packUrl: '',
      pause: 0,
      count: 1,
      value: 0
    }
  },
  methods: {
    // 查询，从子组件内调用父组件的方法
    searchUsers() {
      // 判断search是什么类型，如果没有不用管
      if (this.searchType > 0) {
        this.$emit('searchFromComponent', {
          userName: this.input,
          searchType: this.searchType,
        })
      }
    },
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
      // console.log(this.prepareSelectUser)
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

        // return {
        //   label: ele.label,
        //   children:ele.children.map(eleChildren => {
        //     return {
        //       // label: eleChildren.label + '(' + eleChildren.accountName + ')',
        //       label: eleChildren.label,
        //       id: eleChildren.id,
        //       type: 'user',
        //       disabled: false,
        //       labelPath:ele.label,
        //       labelVersion:this.versionValue.versionName
        //     }
        //   })
        // }
      })
      // console.log(this.canSelectUser)
      this.tempCanSelectUser = this.canSelectUser
      this.total += 1
    },
    handle() {
      this.pause === 0 ? (this.pause = 1) : (this.pause = 0)
      this.packUrl=''
      if (this.pause === 0) {
        this.sliderSpeed()
        this.packUrl = this.url + '&pause='+this.pause
      } else if (this.pause == 1) {
        clearInterval(this.timer)
        this.packUrl = this.url + '&pause='+this.pause
      }
    },
    //快进
    handleFast() {
      this.count++
      this.packUrl = this.url + '&fps=' + this.count * 25
      this.value = 0
      this.sliderSpeed()
    },
    // 拖拽
    change() {
      clearInterval(this.timer)
      const speed = this.value / 100
      const offset = Math.ceil(speed * this.frameNumber)
      this.packUrl = this.url + '&offset=' + offset
      this.sliderSpeed()
    },
    // 进度条变化
    sliderSpeed() {
      let _this = this
      if(_this.timer&&this.count===2){
        this.value=0
        clearInterval(this.timer)
      }
      const speed = (100 / (_this.frameNumber /(_this.count*25))) / 20
      _this.timer = setInterval(() => {    
        _this.value += speed
        if (_this.value >= 100) {
          clearInterval(_this.timer)
          _this.value = 0
        }
      }, 50)
    },
  },
  watch: {
    url(val) {
      this.packUrl = val
      this.sliderSpeed()
    },
    showSelectPeople(val) {
      // if (!val) {
      //   this.value = null
      //   this.input = ''
      // }
      if (this.timer) {
        this.value = 0
        clearInterval(this.timer)
      }
      this.showCanSelectUser = val
      this.searchType = 1
      this.getLabel()  
    },

    // bindUserData (val) {
    //   this.canSelectUser = []
    //   this.canSelectUser = val.map(ele => {
    //     return {
    //       label: ele.label,
    //       children: ele.children.map(eleChildren => {
    //         return {
    //           // label: eleChildren.label + '(' + eleChildren.accountName + ')',
    //           label: eleChildren.label,
    //           id: eleChildren.id,
    //           type: 'user',
    //           disabled: false,
    //           labelPath:ele.label,
    //           labelVersion:this.versionValue.versionName
    //         }
    //       })
    //     }
    //   })
    //   console.log(this.canSelectUser)
    //   this.tempCanSelectUser = this.canSelectUser
    //   this.total += 1
    // },
    havebindUserData(val) {
      this.haveSelectedUser = []
      this.haveSelectedUser.push(
        ...val.map((ele) => {
          return {
            // fullName: ele.userName + '(' + ele.accountName + ')'
            fullName: ele.userName,
            id: ele.id,
            labelPath: ele.labelPath,
            labelVersion: ele.labelVersion,
          }
        })
      )
      // console.log(this.haveSelectedUser)
      this.total += 1
    },
    total(val) {
      if (val === 2) {
        this.stopSelect()
      }
    },
    // 从父组件传递过来的值
    getSearch(val) {
      this.canSelectUser = []
      this.canSelectUser = val.map((ele) => {
        return {
          label: ele.label,
          children: ele.children.map((eleChildren) => {
            return {
              label: eleChildren.label + '(' + eleChildren.accountName + ')',
              type: 'user',
              disabled: false,
            }
          }),
        }
      })
      this.stopSelect()
    },
  },
  // created() {
  //   this.getLabel()
  // }
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
        // border-left: 1px solid #DCDFE6;
        // border-right: 1px solid #DCDFE6;
        .el-table {
          // height: 450px;
          width: 620px;
          // tr > th:first-of-type{
          //   border-right: 1px solid #DCDFE6
          // }
          // tr > td:first-of-type {
          //   border-right: 1px solid #DCDFE6;
          //   height: 40px;
          //   padding: 3px 0
          // }
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

// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__header-wrapper > .el-table__header > thead > tr > th:first-of-type{
//   border-right: 1px solid #DCDFE6
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper {
//   height: 402px;
//   overflow-y: auto
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table > .el-table__body-wrapper > .el-table__body > tbody > tr > td:first-of-type {
//   border-right: 1px solid #DCDFE6;
//   height: 40px;
//   padding: 3px 0
// }
// .selectPeople .el-input--mini .el-input__inner {
//   width: 100px
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .left > .el-select {
//   /* margin-top: 10px; */
//   display: inline-block
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .left > .el-input {
//   display: inline-block;
//   width: 195px;
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .left > .el-input > .el-input__inner {
//   width: 100%;
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .left > .el-tree {
//   margin-top: 10px
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__footer > .dialog-footer > .el-button:nth-of-type(2) {
//   margin-right: 18px
// }

// .selectPeople > .bindUser > .el-dialog {
//   width: 70%;
//   height: 600px
// }

// .selectPeople > .bindUser > .el-dialog > .el-dialog__body {
//   padding: 0;
//   margin: 0;
//   width: 100%;
//   height: 500px;
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .left {
//   width: 20%;
//   float: left;
//   margin-left: 30px
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .left > h2 {
//   width: 100%;
//   height: 50px;
//   line-height: 50px;
//   text-align: center;
//   background-color: #ccc;
//   padding: 0px
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .left > .el-tree {
//   width: 298px;
//   height: 428px;
//   border: 1px solid #DCDFE6;
//   overflow-y: auto;
//   overflow-x: hidden
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .middle {
//   width: 10%;
//   float: left;
//   height: 500px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-left: 50px
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .middle > .el-button {
//   width: 80px;
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .right {
//   width: 30%;
//   float: left;
//   height: 500px;
//   margin-left: 50px
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .right > h2 {
//   width: 100%;
//   height: 50px;
//   line-height: 50px;
//   text-align: center;
//   background-color: #ccc;
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .right > .table{
//   width: 448px;
//   height: 432px;
//   border-left: 1px solid #DCDFE6;
//   border-right: 1px solid #DCDFE6;
//   margin-top: -17px;
// }
// .selectPeople > .bindUser > .el-dialog > .el-dialog__body > .right > .table > .el-table {
//   height: 432px;
//   width: 448px;
// }
</style>
