<template>
  <div class="label">
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
        ></el-tree>
        <div style="text-align: center;padding-top: 10px" v-if="noData">暂无数据</div>
      </div>
      <LabelHistoryGroup v-if="treeNodeType === 1" :nodeData="nodeData"></LabelHistoryGroup>
      <LabelHistoryDetail v-if="treeNodeType === 2" :nodeData="nodeData"></LabelHistoryDetail>
    </div>
  </div>
</template>
<script type="text/jsx">
import { rootNodeByVersionId, childNodeByVersionId } from '../../api/api'
import LabelHistoryGroup from './label-history-group.vue'
import LabelHistoryDetail from './label-history-detail.vue'
import { baseUrl } from '../../util/http'
export default {
  components: { LabelHistoryGroup, LabelHistoryDetail },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      nodeData: [],
      treeNodeType: 0,
      noData: false,
      schema: null,
      tableData: []
    }
  },
  methods: {
    initData() {
      rootNodeByVersionId({
        versionId:this.$route.query.versionId
        }).then(res => {
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
      childNodeByVersionId({ 
        parentId: data.id
       }).then(res => {
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
    }
  },
  created() {
    this.initData()
  },
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
    margin: 20px 20px 0 ;
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
    }
  }
}
</style>
