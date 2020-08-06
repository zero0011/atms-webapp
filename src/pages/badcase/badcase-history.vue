<template>
  <div class="history">
    <div class="bread">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>badcase管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/badcase' }">算法测试badcase</el-breadcrumb-item>
        <el-breadcrumb-item>badcase分类历史</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{ background: 'rgb(250, 250, 250)' }"
      class="tableContainer"
      max-height="650"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="history_number" label="版本号" align="center"></el-table-column>
      <el-table-column prop="history_name" label="分类名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="lookDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import{allCollectHistory}from '../../api/api'
  export default {
    data() {
      return {
        tableData: []
      }
    },     
     methods: {
        getAllCollectHistory() {
          allCollectHistory({
            projectId:sessionStorage.getItem('projectId')
          }).then(res=>{
            if(res.state===1000){
              this.tableData = res.data.historyList
            }
          })
          
        },
        lookDetail(rowData){
          this.$router.push({
            path:'manage/historyDetail',
            query:{
              historyId:rowData.id
            }
          })
        }
      },
    created () {
      this.getAllCollectHistory()
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