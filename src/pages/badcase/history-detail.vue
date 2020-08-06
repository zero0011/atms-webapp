<template>
  <div class="history">
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>badcase管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/badcase' }">算法测试badcase</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/badcaseHistory' }">badcase分类历史</el-breadcrumb-item>
        <el-breadcrumb-item>badcase分类历史详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
      max-height="650"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="versionName" label="版本" width="300" align="center" show-overflow-tooltip>
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
      <el-table-column prop="badcaseName" label="名称" width="120" align="center"></el-table-column>
      <el-table-column
        prop="badcasePath"
        label="路径"
        width="200"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="desc"
        label="问题描述"
        width="200"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import{historyDetail}from '../../api/api'
  export default {
    data() {
      return {
        tableData: []
      }
    },     
     methods: {
        getHistoryDetail() {
          historyDetail({
            historyId:this.$route.query.historyId
          }).then(res=>{
            if(res.state===1000){
              this.tableData = res.data.historyList
            }
          })
          
        }
      },
    created () {
      this.getHistoryDetail()
      
    },
    
  }

</script>

<style lang="scss">
.history{
  margin: 20px;
  .bread{
    margin-bottom: 15px;
  }
}


</style>