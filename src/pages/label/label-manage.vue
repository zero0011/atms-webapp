<template>
  <div class="label">
    <div class="label-header">
      <el-button type="primary" @click="download">查看模板</el-button>
      <el-button type="primary" @click="importLabelVisible=true">导入</el-button>
      <el-button type="primary" @click="labelVersionManage">版本管理</el-button>
    </div>
    <div class="label-container">
      <div class="label-container-left">
        <el-tree
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          empty-text
          default-expand-all
          node-key="id"
          ref="tree"
          @node-click="handleNodeClick"
          :render-content="renderContent"
          @node-contextmenu="nodeRightClcik"
        ></el-tree>
        <div
          class="menu"
          ref="menu"
          @mouseenter="mouseInMenu"
          @mouseleave="mouseOutMenu"
          v-if="showMenu"
        >
          <ul>
            <li
              v-for="(val, key) in rightMenuArr"
              :key="key"
              @mouseenter="menuMouseenter"
              @mouseleave="menuMouseleave"
              @click="getMenuName(val, $event)"
            >{{ val }}</li>
          </ul>
        </div>
        <div style="text-align: center;padding-top: 10px" v-if="noData">暂无数据</div>
      </div>
      <LabelGroup v-if="treeNodeType === 1" :nodeData="nodeData"></LabelGroup>
      <LabelDetail v-if="treeNodeType === 2" :nodeData="nodeData"></LabelDetail>
    </div>
    <!-- 创建标签组弹框 -->
    <el-dialog
      :visible.sync="createLabelGroupVisible"
      width="40%"
      title="创建标签组"
      :show-close="false"
    >
      <el-form :model="labelGroupForm" :rules="rules" ref="labelGroupForm" label-width="100px">
        <el-form-item label="标签组名称" prop="groupName">
          <el-input v-model="labelGroupForm.groupName" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="groupDesc">
          <el-input v-model="labelGroupForm.groupDesc" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('labelGroupForm')">取 消</el-button>
        <el-button type="primary" @click="createLabelGroup('labelGroupForm')">创建</el-button>
      </span>
    </el-dialog>
    <!-- 创建标签弹窗 -->
    <el-dialog :visible.sync="createLabelVisible" width="30%" title="创建标签">
      <el-form :model="labelForm" :rules="labelRules" ref="labelForm" label-width="100px">
        <el-form-item label="标签名称" prop="labelName">
          <el-input v-model="labelForm.labelName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="labelDesc">
          <el-input v-model="labelForm.labelDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createLabelVisible = false">取 消</el-button>
        <el-button type="primary" @click="createLabel('labelForm')">创建</el-button>
      </span>
    </el-dialog>
    <el-dialog title="标签导入" :visible.sync="importLabelVisible" class="dialogCaseVisible">
      <div>
        <el-upload
          class="upload-demo"
          :action="url"
          :show-file-list="false"
          accept=".json"
          :before-upload="beforeUploadFile"
          :on-success="uploadSuccess"
          :headers="headers"
          :data="upLoadText"
        >
          <el-button type="primary" @click="upLoadFile()">json文件导入</el-button>
        </el-upload>
        <p>请先下载json格式的导入模板导入</p>
      </div>
      <ul>
        <li>标签导入说明：</li>
        <li>1、请务必先下载导入模板，并直接使用模板进行标签数据的编辑，否则可能会导入失败</li>
        <li>2、模板中nodeType的值仅可为1或2(1代表标签组,2代表标签)</li>
      </ul>
    </el-dialog>
  </div>
</template>
<script type="text/jsx">
import { getRootNode, getChildNode, addLabelOrLabelGroup, delLabel, exportLabel, downloadFormWork, getLabelVersion } from '../../api/api'
import LabelDetail from '../../components/label/label-detail.vue'
import LabelGroup from '../../components/label/label-group.vue'
import { baseUrl } from '../../util/http'
export default {
  components: { LabelDetail, LabelGroup },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      nodeData: [],
      treeNodeType: 0,
      createLabelGroupVisible: false,
      createLabelVisible: false,
      versionManageVisible: false,//版本管理弹窗
      importLabelVisible: false,
      labelGroupForm: {
        groupName: '',
        groupDesc: ''
      },
      rules: {
        groupName: [
          { required: true, message: '请输入标签组名称', trigger: 'blur' },
          { max: 100, message: '标签组名称最长100字节', trigger: 'blur' }
        ],
        groupDesc: [
          { max: 200, message: '标签组描述最长200字节', trigger: 'blur' }
        ]
      },
      labelForm: {
        labelName: '',
        labelDesc: ''
      },
      labelRules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { max: 100, message: '标签名称最长100字节', trigger: 'blur' }
        ],
        labelDesc: [
          { max: 200, message: '标签描述最长200字节', trigger: 'blur' }
        ]
      },
      showMenu: false,
      rightMenuArr: [],
      currentMouseRightClickNodeInfo: null,
      url: '',
      noData: false,
      headers: {},
      upLoadText: {},
      schema: null,
      tableData: []
    }
  },
  methods: {
    initData() {
      getRootNode().then(res => {
        if (res.state === 1000) {
          if (res.data.rootNode.length) {
            this.noData = false
            this.treeData = res.data.rootNode.map(ele => {
              return {
                nodeId: ele.nodeId,
                nodeName: ele.nodeName,
                id: ele.nodeId,
                nodeType: 0,
                children: []
              }
            })
          } else {
            this.noData = true
          }
        } else {
          this.noData = true
        }
      }, rej => {
        this.noData = true
      })
    },
    handleNodeClick(data) {
      this.treeNodeType = data.nodeType
      this.nodeData.splice(0, 2)
      this.nodeData = [data.nodeId, data.nodeName]
      getChildNode({ parentId: data.id }).then(res => {
        if (res.state === 1000) {
          data.children.splice(0, data.children.length)
          if (res.data.childNode.length) {
            const childrenData = res.data.childNode.map(ele => {
              return {
                nodeId: ele.nodeId,
                id: ele.nodeId,
                nodeName: ele.nodeName,
                nodeType: ele.nodeType,
                childType: ele.childType,
                children: []
              }
            })
            this.$refs.tree.updateKeyChildren(data.id, childrenData)
          } else {
          }
        }
      }, rej => {
      })
    },
    renderContent(h, { node, data, store }) {
      if (data.nodeType === 0) {
        return (
          <div>
            <i class="el-icon-folder-opened"></i>
            <span style="margin-left: 5px">{data.nodeName}</span>
          </div>
        )
      }
      if (data.nodeType === 1) {
        return (
          <div>
            <i class="el-icon-document"></i>
            <span style="margin-left: 5px">{data.nodeName}</span>
          </div>
        )
      }
      if (data.nodeType === 2) {
        return (
          <div>
            <i class="el-icon-collection-tag"></i>
            <span style="margin-left: 5px">{data.nodeName}</span>
          </div>
        )
      }
    },
    // 创建标签组
    createLabelGroup(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addLabelOrLabelGroup({
            fartherId: this.currentMouseRightClickNodeInfo.id,
            labelName: this.labelGroupForm.groupName,
            labelDesc: this.labelGroupForm.groupDesc,
            createAccount: sessionStorage.getItem('userAccount'),
            type: 1
          }).then(res => {
            if (res.state === 1000) {
              this.$message({
                type: 'success',
                message: '创建成功',
                duration: 1000
              })
              this.createLabelGroupVisible = false
              this.initData()
            }
          }, rej => {
            this.$message({
              type: 'error',
              message: '创建失败，请稍后再试！',
              duration: 1000
            })
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.createLabelGroupVisible = false
    },
    // 创建标签
    createLabel(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addLabelOrLabelGroup({
            fartherId: this.currentMouseRightClickNodeInfo.id,
            labelName: this.labelForm.labelName,
            labelDesc: this.labelForm.labelDesc,
            createAccount: sessionStorage.getItem('userAccount'),
            type: 2
          }).then(res => {
            if (res.state === 1000) {
              this.$message({
                type: 'success',
                message: '创建成功',
                duration: 1000
              })
              this.createLabelVisible = false
              this.initData()
            }else{
              this.$message({
                type:'error',
                message:res.message
              })
            }
          })
        } else {
          return false;
        }
      })
    },
    mouseInMenu(event) {
      event.target.style.cursor = 'pointer'
    },
    mouseOutMenu(event) {
      event.target.style.cursor = 'auto'
    },
    menuMouseenter(event) {
      event.target.style.backgroundColor = '#d9d9d9'
    },
    menuMouseleave(event) {
      event.target.style.backgroundColor = ''
    },
    getMenuName(name, evn) {
      if (name === '新增标签组') {
        this.createLabelGroupVisible = true
      }
      if (name === '新增标签') {
        this.createLabelVisible = true
      } else if (name === '删除标签组') {
        this.$confirm('确定要删除标签组？', '重要操作警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delLabel({
            nodeId: this.currentMouseRightClickNodeInfo.nodeId,
            type: 1
          }).then(res => {
            if (res.state === 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              setTimeout(() => {
                this.initData()
              }, 500)
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.$message({
              type: 'error',
              message: res.message,
              duration: 1000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (name === '删除标签') {
        this.$confirm('确定要删除标签？', '重要操作警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delLabel({
            nodeId: this.currentMouseRightClickNodeInfo.nodeId,
            type: 2
          }).then(res => {
            if (res.state === 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              setTimeout(() => {
                this.initData()
              }, 500)
            } else {
              this.$message.error(res.message)
            }
          }, rej => {
            this.$message({
              type: 'error',
              message: res.message,
              duration: 1000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }

    },
    nodeRightClcik(evn, obj, node, ele) {
      this.currentMouseRightClickNodeInfo = obj
      this.showMenu = true
      if (obj.nodeType === 0) {
        this.rightMenuArr = ['新增标签组']
      }
      if (obj.nodeType === 1) {
        if (obj.childType === 0) {
          this.rightMenuArr = ['新增标签组', '新增标签', '删除标签组']
        } else if (obj.childType === 1) {
          this.rightMenuArr = ['新增标签组', '删除标签组']
        } else {
          this.rightMenuArr = ['新增标签', '删除标签组']
        }
      }
      if (obj.nodeType === 2) {
        this.rightMenuArr = ['删除标签']
      }
      this.$nextTick(() => {
        this.$refs.menu.style.top = (evn.clientY - 64 - 40 - 20 - 24 - 3) + 'px'
        this.$refs.menu.style.left = (evn.clientX - 250 - 20 - 24) + 'px'
      })
    },
    exportLabel() {
      exportLabel().then(res => {
        if (res.state === 1000) {
          window.location.href = res.data.labelFilePath
        } else {
          this.$message({
            type: 'info',
            message: res.message
          })
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
        this.importLabelVisible = false
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
        this.importLabelVisible = false
      }
    },
    download() {
      downloadFormWork().then(res => {
        if (res.state === 1000) {
          window.open(res.data.url)
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 导入前增加参数
    upLoadFile() {
      this.upLoadText = {
        accountName: sessionStorage.getItem('userAccount')
      }
    },
    // 版本管理
    versionManage() {
      this.versionManageVisible = true
      getLabelVersion().then(res => {
        if (res.state === 1000) {
          this.tableData = res.data.labelVersionHistory
        } else {
          this.$message({
            type: 'info',
            message: res.message
          })
        }
      })
    },
    labelVersionManage(){
      this.$router.push({
        path: '/manage/versionManagement',
        query: {
          from: '/manage/label'
        }
      })
    }
  },
  created() {
    this.initData()
    this.url = baseUrl + '/label/importLabel.action'
    this.headers = { token: sessionStorage.getItem('token') }
  },
  mounted() {
    let doc = document.getElementsByClassName('label-container')[0]
    doc.addEventListener('contextmenu', function (evn) {
      evn.preventDefault()
    })
    window.addEventListener('click', () => {
      if (this.showMenu) {
        this.showMenu = false
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.label {
  height: 100%;
  display: flex;
  flex-direction: column;
  .label-header {
    margin: 20px 0 10px 20px;
    .upload-demo {
      display: inline-block;
      margin: 0 10px 0 10px;
    }
  }
  .label-container {
    flex: 1;
    margin: 0 20px 0 20px;
    border-top: 3px #000 solid;
    height: 100%;
    display: flex;
    .label-container-left {
      position: relative;
      width: 30%;
      height: 100%;
      border-right: 3px solid #000;
      float: left;
      overflow: auto;
      .filter-tree {
        position: absolute;
      }
      .menu {
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: #f2f2f2;
        border: 1px solid #000;
        box-shadow: 1px 1px 2px 1px #ccc;
        width: 40%;
        text-align: center;
        ul {
          margin: 0;
          padding: 0;
          list-style: none;
          li {
            padding: 3px 0px;
          }
        }
      }
    }
  }
}
</style>
